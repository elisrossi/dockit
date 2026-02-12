# DocKit API — Agent-Friendly Reference

Base URL: `https://dockit.live` (or self-hosted)

## Auth

```
POST /v1/auth/signup
Content-Type: application/json
{"email": "...", "password": "..."}
→ 201 {"id", "email", "api_key": "dk_live_...", "doc_limit": 15}
```

## Create Document

```
POST /v1/documents
Authorization: Bearer dk_live_...
Content-Type: application/json
{
  "template": "invoice|proposal|report|letter|resume|freeform",
  "data": { ... },
  "theme": { "mode": "light|dark", "colors": { "primary": "#hex" } }
}
→ 201 {"document_id", "url": "https://dockit.live/d/ID", "title"}
```

## Templates & Data Schemas

### invoice
```json
{"from":{"name":"","address":"","email":"","logo_url":""},"to":{"name":"","address":"","email":""},"invoice_number":"INV-001","date":"2025-01-15","due_date":"2025-02-15","items":[{"description":"","quantity":1,"unit_price":100}],"tax_rate":10,"notes":"","currency":"USD"}
```

### proposal
```json
{"title":"","from":{"name":"","title":"","company":""},"to":{"name":"","company":""},"date":"","sections":[{"heading":"","content":"markdown"}],"pricing":[{"item":"","price":0}],"total":0,"currency":"USD","valid_until":""}
```

### report
```json
{"title":"","subtitle":"","author":"","date":"","table_of_contents":true,"sections":[{"heading":"","content":"markdown"}]}
```

### letter
```json
{"from":{"name":"","address":""},"to":{"name":"","address":""},"date":"","subject":"","body":"markdown","signature":""}
```

### resume
```json
{"name":"","title":"","email":"","phone":"","location":"","website":"","linkedin":"","summary":"","experience":[{"role":"","company":"","period":"","description":"markdown"}],"education":[{"degree":"","school":"","year":""}],"skills":["skill1","skill2"]}
```

### freeform
```json
{"content":"# Markdown\n\nAny content here."}
```

## Other Endpoints

```
GET  /v1/account/me          → usage stats (auth required)
GET  /v1/documents/:id       → doc metadata (auth, owner only)
PATCH /v1/documents/:id      → update doc, same URL (auth)
DELETE /v1/documents/:id     → delete doc, frees quota (auth)
GET  /d/:id                  → public rendered document
```

## Limits
- 15 free documents per key
- PATCH unlimited
- DELETE frees 1 slot
