import { Hono } from 'hono';

const landing = new Hono();

landing.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocKit — Document Generation API for AI Agents</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a202c; background: #fafbfc; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    .container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

    /* Hero */
    .hero { padding: 80px 0 64px; text-align: center; }
    .hero-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; background: #eff6ff; color: #2563eb; margin-bottom: 24px; }
    .hero h1 { font-size: 48px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; }
    .hero h1 span { background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 18px; color: #64748b; max-width: 560px; margin: 16px auto 0; }

    /* Code block */
    .code-section { padding: 0 0 64px; }
    .code-block { background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 32px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7; overflow-x: auto; position: relative; }
    .code-block .comment { color: #64748b; }
    .code-block .string { color: #34d399; }
    .code-block .key { color: #93c5fd; }
    .code-block .method { color: #fbbf24; }
    .code-label { position: absolute; top: 12px; right: 16px; font-size: 11px; color: #475569; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Features */
    .features { padding: 64px 0; border-top: 1px solid #e2e8f0; }
    .features h2 { text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 48px; }
    .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
    .feature { padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; }
    .feature-icon { width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px; }
    .feature h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
    .feature p { font-size: 14px; color: #64748b; }

    /* Templates */
    .templates { padding: 64px 0; border-top: 1px solid #e2e8f0; }
    .templates h2 { text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    .templates .subtitle { text-align: center; color: #64748b; margin-bottom: 32px; }
    .template-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .chip { padding: 10px 20px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; font-size: 14px; font-weight: 500; }

    /* CTA */
    .cta { padding: 64px 0; text-align: center; border-top: 1px solid #e2e8f0; }
    .cta-code { background: #f1f5f9; padding: 12px 24px; border-radius: 8px; display: inline-block; font-family: monospace; font-size: 14px; color: #334155; margin-top: 16px; }

    /* Footer */
    footer { padding: 32px 0; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0; }

    @media (max-width: 768px) {
      .hero h1 { font-size: 32px; }
      .feature-grid { grid-template-columns: 1fr; }
      .code-block { font-size: 11px; padding: 20px; }
    }
  </style>
</head>
<body>

<div class="container">
  <section class="hero">
    <div class="hero-badge">🔧 Built for AI Agents</div>
    <h1>Generate beautiful documents<br>with a <span>single API call</span></h1>
    <p>POST structured data, get back a hosted URL. Invoices, proposals, reports, letters, resumes — all print-ready, no browser automation required.</p>
  </section>

  <section class="code-section">
    <div class="code-block">
      <span class="code-label">curl</span>
<span class="comment"># 1. Create an account</span>
curl -X POST https://dockit.live/v1/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email": "agent@example.com", "password": "secure123"}'

<span class="comment"># 2. Generate an invoice</span>
curl -X POST https://dockit.live/v1/documents \\
  -H "Authorization: Bearer <span class="string">dk_live_your_api_key</span>" \\
  -H "Content-Type: application/json" \\
  -d '{
    <span class="key">"template"</span>: <span class="string">"invoice"</span>,
    <span class="key">"data"</span>: {
      <span class="key">"from"</span>: { "name": "Acme Corp", "email": "billing@acme.com" },
      <span class="key">"to"</span>: { "name": "Client Inc", "email": "pay@client.com" },
      <span class="key">"invoice_number"</span>: <span class="string">"INV-001"</span>,
      <span class="key">"items"</span>: [{ "description": "API Integration", "quantity": 1, "unit_price": 2500 }]
    }
  }'

<span class="comment"># → { "document_id": "abc123", "url": "https://dockit.live/d/abc123" }</span>
    </div>
  </section>

  <section class="features">
    <h2>Why DocKit?</h2>
    <div class="feature-grid">
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Instant Generation</h3>
        <p>Documents are generated and hosted in milliseconds. No queues, no waiting, no browser spin-up.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>Beautiful by Default</h3>
        <p>Professional typography, clean layouts, and print-optimized CSS. Dark mode support included.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🖨️</div>
        <h3>Print-Ready</h3>
        <p>Every document has pixel-perfect @media print CSS. Users click "Print" and get a perfect PDF.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🤖</div>
        <h3>Agent-Friendly</h3>
        <p>Simple REST API designed for AI agents. POST JSON, get a URL. That's it.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📝</div>
        <h3>6 Templates</h3>
        <p>Invoice, proposal, report, letter, resume, and freeform markdown. All customizable with themes.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🔗</div>
        <h3>Hosted URLs</h3>
        <p>Each document gets a permanent URL. Share it, embed it, or update it via API — same link.</p>
      </div>
    </div>
  </section>

  <section class="templates">
    <h2>Templates</h2>
    <p class="subtitle">Each template accepts structured data and renders a beautiful, print-ready document.</p>
    <div class="template-chips">
      <div class="chip">📄 Invoice</div>
      <div class="chip">💼 Proposal</div>
      <div class="chip">📊 Report</div>
      <div class="chip">✉️ Letter</div>
      <div class="chip">👤 Resume</div>
      <div class="chip">📝 Freeform (Markdown)</div>
    </div>
  </section>

  <section class="cta">
    <h2>Get Started Free</h2>
    <p style="color:#64748b">15 free documents per API key. No credit card required.</p>
    <div class="cta-code">POST /v1/auth/signup → { "email": "...", "password": "..." }</div>
  </section>
</div>

<footer>
  <div class="container">DocKit &copy; 2025 · <a href="/docs" style="color:#2563eb;text-decoration:none">API Docs</a></div>
</footer>

</body>
</html>`);
});

export default landing;
