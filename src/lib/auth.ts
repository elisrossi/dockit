import { createHash, randomBytes } from 'crypto';
import { nanoid } from 'nanoid';
import db from './db.js';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const check = createHash('sha256').update(salt + password).digest('hex');
  return check === hash;
}

export function generateApiKey(): string {
  return `dk_live_${randomBytes(24).toString('base64url')}`;
}

export function generateId(): string {
  return nanoid(12);
}

export interface Account {
  id: string;
  email: string;
  password_hash: string;
  api_key: string;
  created_at: string;
  doc_count: number;
  doc_limit: number;
}

export function createAccount(email: string, password: string): { account: Account; api_key: string } {
  const id = generateId();
  const api_key = generateApiKey();
  const password_hash = hashPassword(password);

  db.prepare(`
    INSERT INTO accounts (id, email, password_hash, api_key) VALUES (?, ?, ?, ?)
  `).run(id, email, password_hash, api_key);

  const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id) as Account;
  return { account, api_key };
}

export function getAccountByEmail(email: string): Account | undefined {
  return db.prepare('SELECT * FROM accounts WHERE email = ?').get(email) as Account | undefined;
}

export function getAccountByApiKey(apiKey: string): Account | undefined {
  return db.prepare('SELECT * FROM accounts WHERE api_key = ?').get(apiKey) as Account | undefined;
}

export function incrementDocCount(accountId: string): void {
  db.prepare('UPDATE accounts SET doc_count = doc_count + 1 WHERE id = ?').run(accountId);
}

export function decrementDocCount(accountId: string): void {
  db.prepare('UPDATE accounts SET doc_count = doc_count - 1 WHERE id = ? AND doc_count > 0').run(accountId);
}
