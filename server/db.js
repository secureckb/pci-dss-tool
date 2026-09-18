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
  variant        text NOT NULL CHECK (variant IN ('merchant', 'service-provider')),
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
  response      text NOT NULL CHECK (response IN ('yes', 'yes-ccw', 'yes-customized', 'no', 'na')),
  justification text NOT NULL DEFAULT '',
  evidence      text NOT NULL DEFAULT '',
  updated_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS answers_assessment_idx ON answers (assessment_id);
CREATE INDEX IF NOT EXISTS assessments_created_idx ON assessments (created_at DESC);
`;

export async function migrate() {
  await pool.query(SCHEMA);
  console.log('Database schema is up to date.');
}
