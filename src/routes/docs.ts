import { Hono } from 'hono';

const docs = new Hono();

const DOCS_CONTENT = `
# DocKit API Documentation

**Base URL:** \`https://dockit.live\` (or your self-hosted instance)

---

## Authentication

All API endpoints (except signup, login, and document viewing) require authentication via API key.

Include your API key in requests using either:
- \`Authorization: Bearer dk_live_...\`
- \`X-API-Key: dk_live_...\`

---

## Endpoints

### POST /v1/auth/signup

Create an account and get an API key.

\`\`\`json
{
  "email": "agent@example.com",
  "password": "secure123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "abc123",
  "email": "agent@example.com",
  "api_key": "dk_live_...",
  "doc_limit": 15,
  "message": "Account created. Save your API key."
}
\`\`\`

---

### POST /v1/auth/login

\`\`\`json
{
  "email": "agent@example.com",
  "password": "secure123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "abc123",
  "email": "agent@example.com",
  "api_key": "dk_live_...",
  "doc_count": 3,
  "doc_limit": 15
}
\`\`\`

---

### GET /v1/account/me

Get account info and usage stats. Requires auth.

**Response:**
\`\`\`json
{
  "id": "abc123",
  "email": "agent@example.com",
  "doc_count": 3,
  "doc_limit": 15,
  "docs_remaining": 12,
  "recent_documents": [...]
}
\`\`\`

---

### POST /v1/documents

Generate a document. Requires auth.

\`\`\`json
{
  "template": "invoice",
  "data": { ... },
  "context": "Optional context string",
  "theme": {
    "mode": "light",
    "colors": { "primary": "#2563eb" }
  }
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "document_id": "abc123",
  "template": "invoice",
  "title": "Invoice INV-001",
  "url": "https://dockit.live/d/abc123",
  "created_at": "2025-01-01T00:00:00.000Z"
}
\`\`\`

---

### GET /v1/documents/:id

Get document metadata. Requires auth (must own the document).

---

### PATCH /v1/documents/:id

Update a document. The URL stays the same.

\`\`\`json
{
  "data": { ... },
  "theme": { "mode": "dark" }
}
\`\`\`

---

### DELETE /v1/documents/:id

Delete a document. Frees up one document from your quota.

---

### GET /d/:id

**Public.** View the rendered document as a beautiful HTML page. No authentication required.

---

## Templates

### invoice

\`\`\`json
{
  "from": { "name": "Acme Corp", "address": "123 Main St", "email": "billing@acme.com", "logo_url": "https://..." },
  "to": { "name": "Client Inc", "address": "456 Oak Ave", "email": "pay@client.com" },
  "invoice_number": "INV-001",
  "date": "2025-01-15",
  "due_date": "2025-02-15",
  "items": [
    { "description": "Web Development", "quantity": 40, "unit_price": 150 },
    { "description": "Design", "quantity": 10, "unit_price": 200 }
  ],
  "tax_rate": 10,
  "notes": "Payment due within 30 days",
  "currency": "USD"
}
\`\`\`

### proposal

\`\`\`json
{
  "title": "Website Redesign Proposal",
  "from": { "name": "Jane Smith", "title": "Creative Director", "company": "DesignCo" },
  "to": { "name": "John Doe", "company": "Client Inc" },
  "date": "2025-01-15",
  "sections": [
    { "heading": "Overview", "content": "Markdown content here..." },
    { "heading": "Timeline", "content": "- Phase 1: Discovery\\n- Phase 2: Design" }
  ],
  "pricing": [
    { "item": "Design Phase", "price": 5000 },
    { "item": "Development", "price": 10000 }
  ],
  "total": 15000,
  "currency": "USD",
  "valid_until": "2025-02-15"
}
\`\`\`

### report

\`\`\`json
{
  "title": "Q4 Performance Report",
  "subtitle": "October - December 2024",
  "author": "Analytics Team",
  "date": "2025-01-10",
  "table_of_contents": true,
  "sections": [
    { "heading": "Executive Summary", "content": "Markdown content..." },
    { "heading": "Key Metrics", "content": "| Metric | Value |\\n|---|---|\\n| Revenue | $1.2M |" }
  ]
}
\`\`\`

### letter

\`\`\`json
{
  "from": { "name": "Jane Smith", "address": "123 Business Ave\\nNew York, NY 10001" },
  "to": { "name": "John Doe", "address": "456 Client St\\nSan Francisco, CA 94102" },
  "date": "January 15, 2025",
  "subject": "Partnership Opportunity",
  "body": "Dear John,\\n\\nI'm writing to discuss...",
  "signature": "Jane Smith"
}
\`\`\`

### resume

\`\`\`json
{
  "name": "Jane Smith",
  "title": "Senior Software Engineer",
  "email": "jane@example.com",
  "phone": "+1 555-0123",
  "location": "San Francisco, CA",
  "website": "https://jane.dev",
  "linkedin": "https://linkedin.com/in/janesmith",
  "summary": "10+ years of experience...",
  "experience": [
    {
      "role": "Senior Engineer",
      "company": "TechCorp",
      "period": "2020 - Present",
      "description": "- Led team of 5\\n- Shipped 3 major products"
    }
  ],
  "education": [
    { "degree": "BS Computer Science", "school": "MIT", "year": "2014" }
  ],
  "skills": ["TypeScript", "React", "Node.js", "PostgreSQL"]
}
\`\`\`

### freeform

\`\`\`json
{
  "content": "# My Document\\n\\nAny **markdown** content here.\\n\\n- Lists\\n- Tables\\n- Code blocks\\n\\nAll supported."
}
\`\`\`

---

## Themes

All templates support theming:

\`\`\`json
{
  "theme": {
    "mode": "light",
    "colors": {
      "primary": "#2563eb"
    }
  }
}
\`\`\`

- \`mode\`: \`"light"\` (default) or \`"dark"\`
- \`colors.primary\`: Any hex color for accents

---

## Limits

- **Free tier:** 15 documents per API key
- Documents can be updated unlimited times (PATCH)
- Deleting a document frees up quota

---

## Errors

All errors return JSON:

\`\`\`json
{
  "error": "Description of what went wrong"
}
\`\`\`

| Status | Meaning |
|--------|---------|
| 400 | Bad request / missing fields |
| 401 | Invalid or missing API key |
| 404 | Document not found |
| 409 | Email already registered |
| 429 | Document limit reached |
`;

docs.get('/', (c) => {
  // Render docs as HTML with simple styling
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation — DocKit</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a202c; background: #fafbfc; line-height: 1.7; }
    .docs { max-width: 780px; margin: 0 auto; padding: 48px 24px 96px; }
    .docs h1 { font-size: 32px; font-weight: 700; margin-top: 48px; margin-bottom: 12px; }
    .docs h1:first-child { margin-top: 0; }
    .docs h2 { font-size: 22px; font-weight: 600; margin-top: 40px; margin-bottom: 8px; }
    .docs h3 { font-size: 17px; font-weight: 600; margin-top: 28px; margin-bottom: 8px; color: #2563eb; }
    .docs p { margin-bottom: 12px; color: #334155; }
    .docs hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
    .docs code { font-family: 'JetBrains Mono', monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; color: #0f172a; }
    .docs pre { background: #0f172a; color: #e2e8f0; padding: 20px 24px; border-radius: 10px; overflow-x: auto; margin: 12px 0 20px; line-height: 1.5; }
    .docs pre code { background: none; color: inherit; padding: 0; font-size: 13px; }
    .docs ul, .docs ol { padding-left: 24px; margin-bottom: 12px; }
    .docs li { margin-bottom: 4px; color: #334155; }
    .docs table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; }
    .docs th, .docs td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
    .docs th { background: #f8fafc; font-weight: 600; }
    .docs strong { font-weight: 600; }
    .docs a { color: #2563eb; text-decoration: none; }
    .back { display: inline-block; margin-bottom: 24px; color: #64748b; font-size: 14px; text-decoration: none; }
    .back:hover { color: #2563eb; }
  </style>
</head>
<body>
  <div class="docs">
    <a class="back" href="/">← Back to DocKit</a>
    <div id="content"></div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <script>
    const md = ${JSON.stringify(DOCS_CONTENT)};
    document.getElementById('content').innerHTML = marked.parse(md);
  <\/script>
</body>
</html>`);
});

export default docs;
