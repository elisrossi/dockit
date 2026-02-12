import { Hono } from 'hono';
import { getDocument } from '../lib/documents.js';
import { renderDocument } from '../lib/renderer.js';
import type { TemplateName } from '../lib/documents.js';

const viewer = new Hono();

// GET /d/:id — public document viewer
viewer.get('/:id', (c) => {
  const doc = getDocument(c.req.param('id'));

  if (!doc) {
    return c.html(`<!DOCTYPE html>
<html><head><title>Not Found — DocKit</title>
<style>body{font-family:Inter,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f2f5;color:#1a202c;}
.box{text-align:center;}.code{font-size:72px;font-weight:700;color:#e2e8f0;}.msg{font-size:18px;margin-top:8px;color:#718096;}</style></head>
<body><div class="box"><div class="code">404</div><div class="msg">Document not found</div></div></body></html>`, 404);
  }

  const data = JSON.parse(doc.data);
  const theme = doc.theme ? JSON.parse(doc.theme) : undefined;
  const html = renderDocument(doc.template as TemplateName, data, theme);

  return c.html(html);
});

export default viewer;
