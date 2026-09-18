import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Add the Postgres plugin in Railway, or set DATABASE_URL for local development.'
  );
  process.exit(1);
}

// Railway's managed Postgres presents a certificate that does not chain to a
// public root, so verification is disabled for non-local connections only.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
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
  submitted_title text
);

CREATE TABLE IF NOT EXISTS answers (
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id   text NOT NULL,
  -- NULL means the client cleared this answer. The row is kept so its
  -- client_revision survives as a watermark; deleting it would let a write
  -- that is still in flight, carrying an older revision, resurrect the answer.
  response      text CHECK (response IN ('yes', 'yes-ccw', 'yes-customized', 'na', 'no')),
  justification text NOT NULL DEFAULT '',
  evidence      text NOT NULL DEFAULT '',
  -- Monotonic per client, so a write that arrives out of order can be
  -- recognised as stale and discarded rather than overwriting a newer answer.
  client_revision bigint NOT NULL DEFAULT 0,
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
ALTER TABLE answers ADD COLUMN IF NOT EXISTS client_revision bigint NOT NULL DEFAULT 0;
ALTER TABLE answers ALTER COLUMN response DROP NOT NULL;

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
