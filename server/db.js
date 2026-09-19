import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Add the Postgres plugin in Railway, or set DATABASE_URL for local development.'
  );
  process.exit(1);
}

// A local socket has nothing to intercept; anything else is verified.
//
// This used to pass `rejectUnauthorized: false` for every remote connection,
// because some managed Postgres certificates do not chain to a public root.
// That turns TLS into encryption without authentication: anything on the path
// can present its own certificate, take the connection, and read every
// assessment and the credentials used to reach them. Providers whose
// certificates cannot be verified now have to be declared, rather than every
// deployment silently paying for them.
//
//   DATABASE_CA        PEM for a private root, if the provider publishes one.
//   DATABASE_SSL=no-verify   Encrypt but do not verify. A deliberate choice.
//   DATABASE_SSL=off   No TLS at all, for a private network that has none.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
const sslMode = (process.env.DATABASE_SSL || '').trim().toLowerCase();
// A platform's private network — Railway's `*.railway.internal`, Render's
// `*.internal` — is not reachable from outside and does not offer TLS at all.
// Requiring it there is not a stricter policy, it is a connection that cannot be
// made, so the default would fail a correct deployment with a TLS error. An
// explicit DATABASE_SSL still wins over this.
const isPrivateNetwork = /@[^/@]*\.(railway\.internal|internal)(:\d+)?\//.test(process.env.DATABASE_URL || '');

function sslConfig() {
  if (isLocal || sslMode === 'off') return false;
  if (!sslMode && isPrivateNetwork) {
    console.log('Postgres is on the platform private network, which does not offer TLS. Connecting without it.');
    return false;
  }
  if (sslMode === 'no-verify') {
    console.warn(
      'DATABASE_SSL=no-verify: the Postgres certificate is not being verified. The connection is ' +
        'encrypted but not authenticated, so anything on the network path can impersonate the database.'
    );
    return { rejectUnauthorized: false };
  }
  if (process.env.DATABASE_CA) return { rejectUnauthorized: true, ca: process.env.DATABASE_CA };
  return { rejectUnauthorized: true };
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig(),
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres client error', err);
});

export function query(text, params) {
  return pool.query(text, params);
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS assessments (
  id             uuid PRIMARY KEY,
  token          text NOT NULL UNIQUE,
  variant        text CHECK (variant IN ('merchant', 'service-provider')),
  client_name    text NOT NULL,
  contact_name   text,
  contact_email  text,
  dba            text,
  scope_summary  text,
  internal_notes text,
  status         text NOT NULL DEFAULT 'in-progress'
                 CHECK (status IN ('in-progress', 'submitted')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  submitted_at   timestamptz,
  submitted_by   text,
  submitted_title text,
  -- Counts applied answer writes. A client that loaded the questionnaire, and
  -- then finds this has moved further than its own writes account for, is
  -- looking at answers that are no longer what the server holds.
  answers_revision bigint NOT NULL DEFAULT 0,
  -- Bumped whenever the questionnaire itself is replaced: an eligibility change
  -- or an assessor's reset. A write from a page that belongs to an earlier
  -- generation is answering a questionnaire that no longer exists.
  generation bigint NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers (
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id   text NOT NULL,
  -- NULL means the client cleared this answer. The row is kept so its
  -- version survives as a watermark; deleting it would let a write that is
  -- still in flight, carrying an older version, resurrect the answer.
  response      text CHECK (response IN ('yes', 'yes-ccw', 'na', 'no')),
  justification text NOT NULL DEFAULT '',
  evidence      text NOT NULL DEFAULT '',
  -- (client_epoch, client_seq) orders writes, so one that arrives out of order
  -- is recognised as stale and discarded rather than overwriting a newer answer.
  -- The epoch is issued by the database when a page loads and the sequence
  -- counts writes within that page, so ordering never depends on a device clock.
  client_epoch  bigint NOT NULL DEFAULT 0,
  client_seq    bigint NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS answers_assessment_idx ON answers (assessment_id);
CREATE INDEX IF NOT EXISTS assessments_created_idx ON assessments (created_at DESC);

-- Upgrades for databases created before the eligibility wizard existed. Each
-- statement is a no-op once applied, so this runs safely on every boot.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS saq_type text;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS eligibility jsonb;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS eligibility_completed_at timestamptz;
ALTER TABLE assessments ALTER COLUMN variant DROP NOT NULL;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS answers_revision bigint NOT NULL DEFAULT 0;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS generation bigint NOT NULL DEFAULT 0;
ALTER TABLE answers ADD COLUMN IF NOT EXISTS client_epoch bigint NOT NULL DEFAULT 0;
ALTER TABLE answers ADD COLUMN IF NOT EXISTS client_seq bigint NOT NULL DEFAULT 0;
ALTER TABLE answers ALTER COLUMN response DROP NOT NULL;

-- Answer ordering used to be a wall-clock millisecond taken from the client's
-- own device. Devices disagree, so one fast clock could set a watermark no
-- other device could beat and every later edit from them was discarded. The
-- epoch now comes from this sequence, which is the one clock every session
-- shares. Rows written under the old scheme are reset to epoch 0 rather than
-- carrying their millisecond value across: the two are not comparable, and
-- anything written after this migration is by definition newer than they are.
CREATE SEQUENCE IF NOT EXISTS client_epoch_seq AS bigint START WITH 1;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'answers' AND column_name = 'client_revision'
  ) THEN
    ALTER TABLE answers DROP COLUMN client_revision;
  END IF;
END $$;

-- The customized approach was offered as a response and should not have been: an
-- SAQ cannot be used to document it. Any answer recorded that way is cleared
-- rather than converted — turning it into a plain "Yes" would put an assertion
-- in an attestation that the client never made — so the requirement goes back to
-- unanswered and the client answers it again.
UPDATE answers SET response = NULL, justification = '', updated_at = now()
 WHERE response = 'yes-customized';
ALTER TABLE answers DROP CONSTRAINT IF EXISTS answers_response_check;
ALTER TABLE answers ADD CONSTRAINT answers_response_check
  CHECK (response IN ('yes', 'yes-ccw', 'na', 'no'));

-- Assessments created before the wizard already had their variant chosen by the
-- assessor; record the equivalent SAQ type so every row reads the same way.
UPDATE assessments
   SET saq_type = CASE WHEN variant = 'service-provider' THEN 'D-ServiceProvider' ELSE 'D-Merchant' END
 WHERE saq_type IS NULL AND variant IS NOT NULL;
`;

export async function migrate() {
  await pool.query(SCHEMA);
  console.log('Database schema is up to date.');
}
