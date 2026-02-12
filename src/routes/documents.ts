import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { createDocument, getDocument, updateDocument, deleteDocument, VALID_TEMPLATES, type TemplateName } from '../lib/documents.js';
import { incrementDocCount, decrementDocCount } from '../lib/auth.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3401';

const documents = new Hono();
documents.use('/*', authMiddleware);

// POST /v1/documents
documents.post('/', async (c) => {
  const account = c.get('account');

  // Check limit
  if (account.doc_count >= account.doc_limit) {
    return c.json({
      error: 'Document limit reached',
      doc_count: account.doc_count,
      doc_limit: account.doc_limit,
      message: `Free tier allows ${account.doc_limit} documents. Contact us to upgrade.`
    }, 429);
  }

  const body = await c.req.json().catch(() => null);
  if (!body?.template || !body?.data) {
    return c.json({ error: 'template and data fields are required' }, 400);
  }

  if (!VALID_TEMPLATES.includes(body.template)) {
    return c.json({ error: `Invalid template. Must be one of: ${VALID_TEMPLATES.join(', ')}` }, 400);
  }

  const doc = createDocument(
    account.id,
    body.template as TemplateName,
    body.data,
    body.context,
    body.theme
  );

  incrementDocCount(account.id);

  return c.json({
    document_id: doc.id,
    template: doc.template,
    title: doc.title,
    url: `${BASE_URL}/d/${doc.id}`,
    created_at: doc.created_at,
  }, 201);
});

// GET /v1/documents/:id
documents.get('/:id', (c) => {
  const account = c.get('account');
  const doc = getDocument(c.req.param('id'));

  if (!doc || doc.account_id !== account.id) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json({
    id: doc.id,
    template: doc.template,
    title: doc.title,
    context: doc.context,
    data: JSON.parse(doc.data),
    theme: doc.theme ? JSON.parse(doc.theme) : null,
    url: `${BASE_URL}/d/${doc.id}`,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  });
});

// PATCH /v1/documents/:id
documents.patch('/:id', async (c) => {
  const account = c.get('account');
  const body = await c.req.json().catch(() => null);

  if (!body) {
    return c.json({ error: 'Request body required' }, 400);
  }

  if (body.template && !VALID_TEMPLATES.includes(body.template)) {
    return c.json({ error: `Invalid template. Must be one of: ${VALID_TEMPLATES.join(', ')}` }, 400);
  }

  const doc = updateDocument(c.req.param('id'), account.id, body);
  if (!doc) {
    return c.json({ error: 'Document not found' }, 404);
  }

  return c.json({
    id: doc.id,
    template: doc.template,
    title: doc.title,
    url: `${BASE_URL}/d/${doc.id}`,
    updated_at: doc.updated_at,
  });
});

// DELETE /v1/documents/:id
documents.delete('/:id', (c) => {
  const account = c.get('account');
  const deleted = deleteDocument(c.req.param('id'), account.id);

  if (!deleted) {
    return c.json({ error: 'Document not found' }, 404);
  }

  decrementDocCount(account.id);
  return c.json({ deleted: true });
});

export default documents;
