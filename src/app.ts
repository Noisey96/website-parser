/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Hono } from 'hono';
import { sentry } from '@hono/sentry';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';

import rootTemplate from './templates/rootTemplate';
import parseService from './services/parseService';
import urlTemplate from './templates/urlTemplate';

/*
export type Env = {
	SENTRY_DSN: string;
	SENTRY_ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
	const logging = sentry({ dsn: c.env.SENTRY_DSN, environment: c.env.SENTRY_ENVIRONMENT });
	await logging(c, next);
});

*/

const app = new Hono();

app.use('/public/*', async (c, next) => {
	console.log(`[${c.req.method}] ${c.req.url}`);
	await next();
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
	const parsedHtml = await parseService(url);
	const html = urlTemplate(parsedHtml);
	return c.html(html);
});

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
