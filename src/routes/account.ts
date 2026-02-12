import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { getDocumentsByAccount } from '../lib/documents.js';

const account = new Hono();
account.use('/*', authMiddleware);

// GET /v1/account/me
account.get('/me', (c) => {
  const acct = c.get('account');
  const docs = getDocumentsByAccount(acct.id);

  return c.json({
    id: acct.id,
    email: acct.email,
    doc_count: acct.doc_count,
    doc_limit: acct.doc_limit,
    docs_remaining: Math.max(0, acct.doc_limit - acct.doc_count),
    created_at: acct.created_at,
    recent_documents: docs.slice(0, 5).map(d => ({
      id: d.id,
      template: d.template,
      title: d.title,
      created_at: d.created_at,
    })),
  });
});

export default account;
