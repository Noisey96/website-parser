import { Hono } from 'hono';
import { sentry } from '@hono/sentry';

import rootTemplate from './templates/rootTemplate';
import parseService from './services/parseService';
import urlTemplate from './templates/urlTemplate';

export type Env = {
	SENTRY_DSN: string;
	SENTRY_ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
	const logging = sentry({ dsn: c.env.SENTRY_DSN, environment: c.env.SENTRY_ENVIRONMENT });
	await logging(c, next);
});

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

export default app;
