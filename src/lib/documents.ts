import db from './db.js';
import { generateId } from './auth.js';

export interface Document {
  id: string;
  account_id: string;
  template: string;
  title: string | null;
  context: string | null;
  data: string; // JSON string
  theme: string | null; // JSON string
  created_at: string;
  updated_at: string;
}

export const VALID_TEMPLATES = ['invoice', 'proposal', 'report', 'letter', 'resume', 'freeform'] as const;
export type TemplateName = typeof VALID_TEMPLATES[number];

export function createDocument(
  accountId: string,
  template: TemplateName,
  data: Record<string, any>,
  context?: string,
  theme?: Record<string, any>
): Document {
  const id = generateId();
  const title = extractTitle(template, data);

  db.prepare(`
    INSERT INTO documents (id, account_id, template, title, context, data, theme)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, accountId, template, title, context || null, JSON.stringify(data), theme ? JSON.stringify(theme) : null);

  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document;
}

export function getDocument(id: string): Document | undefined {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document | undefined;
}

export function getDocumentsByAccount(accountId: string): Document[] {
  return db.prepare('SELECT * FROM documents WHERE account_id = ? ORDER BY created_at DESC').all(accountId) as Document[];
}

export function updateDocument(
  id: string,
  accountId: string,
  updates: { data?: Record<string, any>; context?: string; theme?: Record<string, any>; template?: TemplateName }
): Document | null {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND account_id = ?').get(id, accountId) as Document | undefined;
  if (!doc) return null;

  const newData = updates.data ? JSON.stringify(updates.data) : doc.data;
  const newTemplate = updates.template || doc.template;
  const newTitle = updates.data ? extractTitle(newTemplate as TemplateName, updates.data) : doc.title;
  const newContext = updates.context !== undefined ? updates.context : doc.context;
  const newTheme = updates.theme ? JSON.stringify(updates.theme) : doc.theme;

  db.prepare(`
    UPDATE documents SET data = ?, template = ?, title = ?, context = ?, theme = ?, updated_at = datetime('now')
    WHERE id = ? AND account_id = ?
  `).run(newData, newTemplate, newTitle, newContext, newTheme, id, accountId);

  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document;
}

export function deleteDocument(id: string, accountId: string): boolean {
  const result = db.prepare('DELETE FROM documents WHERE id = ? AND account_id = ?').run(id, accountId);
  return result.changes > 0;
}

function extractTitle(template: TemplateName, data: Record<string, any>): string {
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
