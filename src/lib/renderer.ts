import Handlebars from 'handlebars';
import { marked } from 'marked';
import type { TemplateName } from './documents.js';

// Configure marked for sync usage
marked.use({ async: false });

// Register Handlebars helpers
Handlebars.registerHelper('markdown', (text: string) => {
  if (!text) return '';
  return new Handlebars.SafeString(marked.parse(text) as string);
});

Handlebars.registerHelper('currency', (amount: number, currency?: string) => {
  const curr = (typeof currency === 'string' && currency) || 'USD';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amount);
  } catch {
    return `${curr} ${amount.toFixed(2)}`;
  }
});

Handlebars.registerHelper('multiply', (a: number, b: number) => {
  return (a * b).toFixed(2);
});

Handlebars.registerHelper('json', (obj: any) => {
  return JSON.stringify(obj, null, 2);
});

Handlebars.registerHelper('eq', (a: any, b: any) => a === b);

Handlebars.registerHelper('add', (a: number, b: number) => a + b);

Handlebars.registerHelper('ifCond', function (this: any, v1: any, operator: string, v2: any, options: any) {
  switch (operator) {
    case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
    default: return options.inverse(this);
  }
});

// ─── Base Layout ──────────────────────────────────────────
function baseLayout(title: string, body: string, theme?: { mode?: string; colors?: { primary?: string } }): string {
  const mode = theme?.mode || 'light';
  const primary = theme?.colors?.primary || '#2563eb';
  const isDark = mode === 'dark';
  const bg = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1a202c';
  const mutedColor = isDark ? '#a0aec0' : '#718096';
  const borderColor = isDark ? '#2d3748' : '#e2e8f0';
  const surfaceBg = isDark ? '#16213e' : '#f7fafc';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${Handlebars.Utils.escapeExpression(title)} — DocKit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --primary: ${primary};
      --bg: ${bg};
      --text: ${textColor};
      --muted: ${mutedColor};
      --border: ${borderColor};
      --surface: ${surfaceBg};
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text);
      background: ${isDark ? '#0f0f23' : '#f0f2f5'};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      max-width: 820px;
      margin: 32px auto;
      background: var(--bg);
      padding: 64px 72px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06);
      border-radius: 8px;
      min-height: 1100px;
      position: relative;
    }

    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .print-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

    .powered-by {
      text-align: center;
      padding: 16px;
      color: var(--muted);
      font-size: 12px;
    }
    .powered-by a { color: var(--primary); text-decoration: none; }

    /* Typography */
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    h2 { font-size: 20px; font-weight: 600; margin-top: 32px; margin-bottom: 12px; color: var(--text); }
    h3 { font-size: 16px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; }
    p { margin-bottom: 12px; }
    
    /* Markdown content */
    .markdown-content h1 { font-size: 24px; margin-top: 32px; }
    .markdown-content h2 { font-size: 20px; }
    .markdown-content h3 { font-size: 16px; }
    .markdown-content ul, .markdown-content ol { padding-left: 24px; margin-bottom: 12px; }
    .markdown-content li { margin-bottom: 4px; }
    .markdown-content blockquote { border-left: 3px solid var(--primary); padding-left: 16px; color: var(--muted); margin: 16px 0; }
    .markdown-content code { background: var(--surface); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .markdown-content pre { background: var(--surface); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; }
    .markdown-content pre code { background: none; padding: 0; }
    .markdown-content table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .markdown-content th, .markdown-content td { padding: 8px 12px; border: 1px solid var(--border); text-align: left; }
    .markdown-content th { background: var(--surface); font-weight: 600; }
    .markdown-content a { color: var(--primary); }

    /* Tables */
    table.data-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .data-table th { text-align: left; padding: 10px 12px; border-bottom: 2px solid var(--border); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
    .data-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
    .data-table tr:last-child td { border-bottom: none; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-muted { color: var(--muted); }
    .text-small { font-size: 13px; }
    .text-primary { color: var(--primary); }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-8 { margin-top: 32px; }
    .mt-12 { margin-top: 48px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-8 { margin-bottom: 32px; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .gap-4 { gap: 16px; }
    .border-top { border-top: 1px solid var(--border); padding-top: 16px; }
    .border-bottom { border-bottom: 1px solid var(--border); padding-bottom: 16px; }

    .header-bar { height: 4px; background: var(--primary); border-radius: 4px 4px 0 0; margin: -64px -72px 48px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; background: var(--surface); color: var(--primary); border: 1px solid var(--border); }
    .logo-img { max-height: 48px; max-width: 200px; }
    .section { margin-top: 32px; }
    .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

    /* Print styles */
    @media print {
      body { background: white; }
      .page { margin: 0; padding: 48px 56px; box-shadow: none; border-radius: 0; max-width: none; }
      .print-btn, .powered-by { display: none !important; }
      .header-bar { margin: -48px -56px 40px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      @page { margin: 0.5in; size: A4; }
      h2, h3 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="page">
    ${body}
  </div>
  <div class="powered-by">Generated by <a href="/">DocKit</a></div>
  <button class="print-btn" onclick="window.print()">
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg>
    Print / Save PDF
  </button>
</body>
</html>`;
}

// ─── Template: Invoice ────────────────────────────────────
const invoiceTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="flex justify-between items-start mb-8">
  <div>
    {{#if data.from.logo_url}}<img src="{{data.from.logo_url}}" class="logo-img mb-4" alt="Logo"><br>{{/if}}
    <span class="font-bold" style="font-size:18px">{{data.from.name}}</span>
    {{#if data.from.address}}<div class="text-muted text-small mt-2" style="white-space:pre-line">{{data.from.address}}</div>{{/if}}
    {{#if data.from.email}}<div class="text-muted text-small">{{data.from.email}}</div>{{/if}}
    {{#if data.from.phone}}<div class="text-muted text-small">{{data.from.phone}}</div>{{/if}}
  </div>
  <div style="text-align:right">
    <h1 style="color:var(--primary)">INVOICE</h1>
    <div class="text-muted text-small mt-2">
      {{#if data.invoice_number}}<div><strong>Invoice #:</strong> {{data.invoice_number}}</div>{{/if}}
      {{#if data.date}}<div><strong>Date:</strong> {{data.date}}</div>{{/if}}
      {{#if data.due_date}}<div><strong>Due:</strong> {{data.due_date}}</div>{{/if}}
    </div>
  </div>
</div>

<div class="mb-8" style="background:var(--surface); padding:16px 20px; border-radius:8px">
  <div class="text-muted text-small font-semibold" style="text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px">Bill To</div>
  <div class="font-semibold">{{data.to.name}}</div>
  {{#if data.to.address}}<div class="text-muted text-small" style="white-space:pre-line">{{data.to.address}}</div>{{/if}}
  {{#if data.to.email}}<div class="text-muted text-small">{{data.to.email}}</div>{{/if}}
</div>

<table class="data-table">
  <thead>
    <tr>
      <th style="width:50%">Description</th>
      <th class="text-center">Qty</th>
      <th class="text-right">Unit Price</th>
      <th class="text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    {{#each data.items}}
    <tr>
      <td>{{this.description}}</td>
      <td class="text-center">{{this.quantity}}</td>
      <td class="text-right">{{currency this.unit_price ../data.currency}}</td>
      <td class="text-right">{{currency (multiply this.quantity this.unit_price) ../data.currency}}</td>
    </tr>
    {{/each}}
  </tbody>
</table>

<div class="flex justify-between mt-8">
  <div style="flex:1">
    {{#if data.notes}}<div class="text-muted text-small"><strong>Notes:</strong><br>{{data.notes}}</div>{{/if}}
  </div>
  <div style="min-width:240px">
    <div class="flex justify-between mb-2">
      <span class="text-muted">Subtotal</span>
      <span class="font-semibold">{{currency subtotal data.currency}}</span>
    </div>
    {{#if data.tax_rate}}
    <div class="flex justify-between mb-2">
      <span class="text-muted">Tax ({{data.tax_rate}}%)</span>
      <span class="font-semibold">{{currency tax data.currency}}</span>
    </div>
    {{/if}}
    <hr class="divider">
    <div class="flex justify-between">
      <span class="font-bold" style="font-size:16px">Total</span>
      <span class="font-bold" style="font-size:18px; color:var(--primary)">{{currency total data.currency}}</span>
    </div>
  </div>
</div>
`);

// ─── Template: Proposal ───────────────────────────────────
const proposalTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="mb-8">
  <span class="badge">PROPOSAL</span>
  <h1 class="mt-4">{{data.title}}</h1>
  <div class="text-muted mt-2">
    {{#if data.from.name}}Prepared by <strong>{{data.from.name}}</strong>{{/if}}
    {{#if data.from.title}}, {{data.from.title}}{{/if}}
    {{#if data.from.company}} at {{data.from.company}}{{/if}}
  </div>
  <div class="flex gap-4 text-muted text-small mt-2">
    {{#if data.date}}<span>Date: {{data.date}}</span>{{/if}}
    {{#if data.valid_until}}<span>Valid until: {{data.valid_until}}</span>{{/if}}
  </div>
  {{#if data.to}}
  <div class="mt-4" style="background:var(--surface); padding:12px 16px; border-radius:8px">
    <span class="text-muted text-small">Prepared for:</span> <strong>{{data.to.name}}</strong>{{#if data.to.company}} — {{data.to.company}}{{/if}}
  </div>
  {{/if}}
</div>

{{#each data.sections}}
<div class="section">
  <h2>{{this.heading}}</h2>
  <div class="markdown-content">{{{markdown this.content}}}</div>
</div>
{{/each}}

{{#if data.pricing}}
<div class="section">
  <h2>Pricing</h2>
  <table class="data-table">
    <thead><tr><th>Item</th><th class="text-right">Price</th></tr></thead>
    <tbody>
      {{#each data.pricing}}
      <tr><td>{{this.item}}</td><td class="text-right">{{currency this.price ../data.currency}}</td></tr>
      {{/each}}
    </tbody>
  </table>
  {{#if data.total}}
  <div class="flex justify-between mt-4 border-top">
    <span class="font-bold" style="font-size:16px">Total</span>
    <span class="font-bold" style="font-size:18px; color:var(--primary)">{{currency data.total data.currency}}</span>
  </div>
  {{/if}}
</div>
{{/if}}
`);

// ─── Template: Report ─────────────────────────────────────
const reportTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="mb-8">
  <span class="badge">REPORT</span>
  <h1 class="mt-4">{{data.title}}</h1>
  {{#if data.subtitle}}<p class="text-muted" style="font-size:18px; margin-top:4px">{{data.subtitle}}</p>{{/if}}
  <div class="text-muted text-small mt-4">
    {{#if data.author}}<span>By {{data.author}}</span>{{/if}}
    {{#if data.date}}<span> · {{data.date}}</span>{{/if}}
  </div>
</div>

{{#if data.table_of_contents}}
<div class="section" style="background:var(--surface); padding:20px 24px; border-radius:8px">
  <h3 style="margin-top:0">Table of Contents</h3>
  <ol style="padding-left:20px; margin-top:8px">
    {{#each data.sections}}
    <li style="margin-bottom:4px; color:var(--primary)">{{this.heading}}</li>
    {{/each}}
  </ol>
</div>
{{/if}}

{{#each data.sections}}
<div class="section">
  <h2>{{this.heading}}</h2>
  <div class="markdown-content">{{{markdown this.content}}}</div>
</div>
{{/each}}
`);

// ─── Template: Letter ─────────────────────────────────────
const letterTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="mb-8">
  <div class="font-semibold">{{data.from.name}}</div>
  {{#if data.from.address}}<div class="text-muted text-small" style="white-space:pre-line">{{data.from.address}}</div>{{/if}}
</div>

<div class="text-muted text-small mb-8">{{data.date}}</div>

<div class="mb-8">
  <div class="font-semibold">{{data.to.name}}</div>
  {{#if data.to.address}}<div class="text-muted text-small" style="white-space:pre-line">{{data.to.address}}</div>{{/if}}
</div>

{{#if data.subject}}<div class="font-bold mb-4" style="font-size:16px">Re: {{data.subject}}</div>{{/if}}

<div class="markdown-content">{{{markdown data.body}}}</div>

{{#if data.signature}}
<div class="mt-12">
  <div>Sincerely,</div>
  <div class="mt-8 font-semibold">{{data.signature}}</div>
</div>
{{/if}}
`);

// ─── Template: Resume ─────────────────────────────────────
const resumeTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="mb-8" style="text-align:center">
  <h1 style="font-size:32px">{{data.name}}</h1>
  {{#if data.title}}<p class="text-muted" style="font-size:18px">{{data.title}}</p>{{/if}}
  <div class="text-muted text-small mt-2 flex justify-between" style="justify-content:center; gap:16px; flex-wrap:wrap">
    {{#if data.email}}<span>{{data.email}}</span>{{/if}}
    {{#if data.phone}}<span>{{data.phone}}</span>{{/if}}
    {{#if data.location}}<span>{{data.location}}</span>{{/if}}
    {{#if data.website}}<span><a href="{{data.website}}" style="color:var(--primary)">{{data.website}}</a></span>{{/if}}
    {{#if data.linkedin}}<span><a href="{{data.linkedin}}" style="color:var(--primary)">LinkedIn</a></span>{{/if}}
  </div>
</div>

{{#if data.summary}}
<div class="section">
  <h2 style="border-bottom:2px solid var(--primary); padding-bottom:4px">Summary</h2>
  <p class="mt-2">{{data.summary}}</p>
</div>
{{/if}}

{{#if data.experience}}
<div class="section">
  <h2 style="border-bottom:2px solid var(--primary); padding-bottom:4px">Experience</h2>
  {{#each data.experience}}
  <div class="mt-4">
    <div class="flex justify-between">
      <div><strong>{{this.role}}</strong> — {{this.company}}</div>
      <div class="text-muted text-small">{{this.period}}</div>
    </div>
    {{#if this.description}}<div class="markdown-content text-small mt-2">{{{markdown this.description}}}</div>{{/if}}
  </div>
  {{/each}}
</div>
{{/if}}

{{#if data.education}}
<div class="section">
  <h2 style="border-bottom:2px solid var(--primary); padding-bottom:4px">Education</h2>
  {{#each data.education}}
  <div class="mt-4">
    <div class="flex justify-between">
      <div><strong>{{this.degree}}</strong> — {{this.school}}</div>
      <div class="text-muted text-small">{{this.year}}</div>
    </div>
  </div>
  {{/each}}
</div>
{{/if}}

{{#if data.skills}}
<div class="section">
  <h2 style="border-bottom:2px solid var(--primary); padding-bottom:4px">Skills</h2>
  <div class="mt-2" style="display:flex; flex-wrap:wrap; gap:8px">
    {{#each data.skills}}
    <span class="badge">{{this}}</span>
    {{/each}}
  </div>
</div>
{{/if}}

{{#each data.sections}}
<div class="section">
  <h2 style="border-bottom:2px solid var(--primary); padding-bottom:4px">{{this.heading}}</h2>
  <div class="markdown-content mt-2">{{{markdown this.content}}}</div>
</div>
{{/each}}
`);

// ─── Template: Freeform ───────────────────────────────────
const freeformTemplate = Handlebars.compile(`
<div class="header-bar"></div>
<div class="markdown-content">{{{markdown data.content}}}</div>
`);

// ─── Renderer ─────────────────────────────────────────────
const templates: Record<TemplateName, HandlebarsTemplateDelegate> = {
  invoice: invoiceTemplate,
  proposal: proposalTemplate,
  report: reportTemplate,
  letter: letterTemplate,
  resume: resumeTemplate,
  freeform: freeformTemplate,
};

export function renderDocument(
  template: TemplateName,
  data: Record<string, any>,
  theme?: { mode?: string; colors?: { primary?: string } }
): string {
  const tmpl = templates[template];
  if (!tmpl) throw new Error(`Unknown template: ${template}`);

  // Pre-compute invoice totals
  let context: Record<string, any> = { data };
  if (template === 'invoice' && data.items) {
    const subtotal = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
    const tax = data.tax_rate ? subtotal * (data.tax_rate / 100) : 0;
    context.subtotal = subtotal;
    context.tax = tax;
    context.total = subtotal + tax;
  }

  const body = tmpl(context);
  const title = extractDocTitle(template, data);
  return baseLayout(title, body, theme);
}

function extractDocTitle(template: TemplateName, data: Record<string, any>): string {
  switch (template) {
    case 'invoice': return `Invoice ${data.invoice_number || ''}`.trim();
    case 'proposal': return data.title || 'Proposal';
    case 'report': return data.title || 'Report';
    case 'letter': return data.subject || 'Letter';
    case 'resume': return data.name ? `${data.name} — Resume` : 'Resume';
    case 'freeform': return 'Document';
    default: return 'Document';
  }
}
