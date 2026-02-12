import { Hono } from 'hono';
import { createAccount, getAccountByEmail, verifyPassword } from '../lib/auth.js';

const auth = new Hono();

// POST /v1/auth/signup
auth.post('/signup', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return c.json({ error: 'email and password required' }, 400);
  }

  const existing = getAccountByEmail(body.email);
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  if (body.password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const { account, api_key } = createAccount(body.email, body.password);

  return c.json({
    id: account.id,
    email: account.email,
    api_key,
    doc_limit: account.doc_limit,
    message: 'Account created. Save your API key — it won\'t be shown again in full.'
  }, 201);
});

// POST /v1/auth/login
auth.post('/login', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return c.json({ error: 'email and password required' }, 400);
  }

  const account = getAccountByEmail(body.email);
  if (!account || !verifyPassword(body.password, account.password_hash)) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  return c.json({
    id: account.id,
    email: account.email,
    api_key: account.api_key,
    doc_count: account.doc_count,
    doc_limit: account.doc_limit,
  });
});

export default auth;
