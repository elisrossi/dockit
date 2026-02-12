import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DB_PATH || 'data/dockit.db';
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    doc_count INTEGER NOT NULL DEFAULT 0,
    doc_limit INTEGER NOT NULL DEFAULT 15
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    template TEXT NOT NULL,
    title TEXT,
    context TEXT,
    data TEXT NOT NULL,
    theme TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_documents_account ON documents(account_id);
  CREATE INDEX IF NOT EXISTS idx_accounts_api_key ON accounts(api_key);
`);

export default db;
