/* eslint-disable @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { sentry } from '@hono/sentry';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { z } from 'zod';

import parseService from './services/parseService.js';
import rootTemplate from './templates/rootTemplate.js';
import urlTemplate from './templates/urlTemplate.js';
import errorTemplate from './templates/errorTemplate.js';

export type Env = {
	SENTRY_DSN: string;
	ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(compress({ encoding: 'gzip' }));

app.use('*', async (c, next) => {
	console.log(`[${c.req.method}] ${c.req.url}`);
	await next();
});

app.use('*', async (c, next) => {
	const logging = sentry({ dsn: process.env.SENTRY_DSN, environment: process.env.ENVIRONMENT });
	await logging(c, next);
});

app.use('/public/*', serveStatic({ root: './' }));
app.use('/robots.txt', serveStatic({ root: './', rewriteRequestPath: () => '/public/robots.txt' }));

app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

app.get('/', (c) => {
	const html = rootTemplate;
	return c.html(html);
});

app.post('/', async (c) => {
	const body = await c.req.parseBody();
	const url = body.url as string;
	try {
		z.string().url().parse(url);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}

	try {
		const parsedHtml = await parseService(url);
		const html = urlTemplate(parsedHtml);
		return c.html(html);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}
});

serve({ fetch: app.fetch, port: Number(process.env.PORT) }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
