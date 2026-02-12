# 🔧 DocKit

**Professional document generation API for AI agents.**

POST structured data + template choice → get a hosted document URL. Beautiful HTML pages with print-optimized CSS. No browser automation, no Puppeteer, no Chrome.

## Quick Start

```bash
npm install
npm run dev  # starts on port 3401
```

## How It Works

1. **Sign up** → get an API key (`dk_live_...`)
2. **POST /v1/documents** with template + data → get a hosted URL
3. **Share the URL** — it's a beautiful, print-ready HTML page
4. **Print to PDF** from the browser (Cmd+P / Ctrl+P) for a perfect PDF

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/v1/auth/signup` | No | Create account, get API key |
| POST | `/v1/auth/login` | No | Login, get account info |
| GET | `/v1/account/me` | Yes | Usage stats |
| POST | `/v1/documents` | Yes | Generate a document |
| GET | `/v1/documents/:id` | Yes | Get document metadata |
| PATCH | `/v1/documents/:id` | Yes | Update document (same URL) |
| DELETE | `/v1/documents/:id` | Yes | Delete document |
| GET | `/d/:id` | No | View document (public) |

## Templates

- **invoice** — Professional invoices with line items, tax, totals
- **proposal** — Business proposals with sections and pricing
- **report** — Reports with markdown sections and table of contents
- **letter** — Formal letters with sender/recipient and markdown body
- **resume** — Clean resumes with experience, education, skills
- **freeform** — Any markdown content rendered beautifully

## Example

```bash
# Sign up
curl -X POST http://localhost:3401/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "secure123"}'

# Create an invoice
curl -X POST http://localhost:3401/v1/documents \
  -H "Authorization: Bearer dk_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "invoice",
    "data": {
      "from": {"name": "Acme Corp", "email": "billing@acme.com"},
      "to": {"name": "Client Inc", "email": "pay@client.com"},
      "invoice_number": "INV-001",
      "date": "2025-01-15",
      "due_date": "2025-02-15",
      "items": [
        {"description": "Web Development", "quantity": 40, "unit_price": 150},
        {"description": "Design", "quantity": 10, "unit_price": 200}
      ],
      "tax_rate": 10,
      "currency": "USD"
    }
  }'
```

Response:
```json
{
  "document_id": "abc123xyz",
  "url": "http://localhost:3401/d/abc123xyz"
}
```

## Theming

```json
{
  "theme": {
    "mode": "dark",
    "colors": { "primary": "#7c3aed" }
  }
}
```

## Tech Stack

- **Hono** — Fast web framework
- **better-sqlite3** — SQLite database
- **Handlebars** — Template engine
- **marked** — Markdown parser
- **TypeScript** — Type safety

## Pricing

- 15 free documents per API key
- Documents can be updated unlimited times
- Deleting frees quota

## License

MIT
