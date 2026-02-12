import type { Context, Next } from 'hono';
import { getAccountByApiKey, type Account } from '../lib/auth.js';

// Extend Hono context
declare module 'hono' {
  interface ContextVariableMap {
    account: Account;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  const apiKey = c.req.header('X-API-Key');

  let key: string | undefined;

  if (apiKey) {
    key = apiKey;
  } else if (authHeader?.startsWith('Bearer ')) {
    key = authHeader.slice(7);
  }

  if (!key) {
    return c.json({ error: 'Missing API key. Use Authorization: Bearer dk_live_... or X-API-Key header.' }, 401);
  }

  const account = getAccountByApiKey(key);
  if (!account) {
    return c.json({ error: 'Invalid API key.' }, 401);
  }

  c.set('account', account);
  await next();
}
