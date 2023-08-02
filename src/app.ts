/* eslint-disable @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Hono } from 'hono';
import { sentry } from '@hono/sentry';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { z } from 'zod';

import parseService from './services/parseService';
import rootTemplate from './templates/rootTemplate';
import formTemplate from './templates/formTemplate';
import errorTemplate from './templates/errorTemplate';
import urlTemplate from './templates/urlTemplate';

export type Env = {
	SENTRY_DSN: string;
	SENTRY_ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
	console.log(`[${c.req.method}] ${c.req.url}`);
	await next();
});

app.use('*', async (c, next) => {
	const logging = sentry({ dsn: process.env.SENTRY_DSN, environment: process.env.SENTRY_ENVIRONMENT });
	await logging(c, next);
});

app.use('/public/*', serveStatic({ root: './' }));

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
		const html = formTemplate('Please enter a URL');
		return c.html(html);
	}

	try {
		const parsedHtml = await parseService(url);
		const html = urlTemplate(parsedHtml);
		return c.html(html);
	} catch (_) {
		const html = errorTemplate(`Cannot parse ${url}`);
		return c.html(html);
	}
});

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
