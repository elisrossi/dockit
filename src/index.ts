import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import authRoutes from './routes/auth.js';
import accountRoutes from './routes/account.js';
import documentRoutes from './routes/documents.js';
import viewerRoutes from './routes/viewer.js';
import landingRoutes from './routes/landing.js';
import docsRoutes from './routes/docs.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Public routes
app.route('/', landingRoutes);
app.route('/docs', docsRoutes);
app.route('/d', viewerRoutes);

// API routes
app.route('/v1/auth', authRoutes);
app.route('/v1/account', accountRoutes);
app.route('/v1/documents', documentRoutes);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', version: '1.0.0' }));

const PORT = parseInt(process.env.PORT || '3401');

console.log(`
╔══════════════════════════════════════╗
║           🔧 DocKit v1.0.0          ║
║     Document Generation API for     ║
║            AI Agents                ║
╠══════════════════════════════════════╣
║  Server:  http://localhost:${PORT}      ║
║  Docs:    http://localhost:${PORT}/docs  ║
╚══════════════════════════════════════╝
`);

serve({ fetch: app.fetch, port: PORT });
