/* eslint-disable @typescript-eslint/no-unsafe-return */
import 'dotenv/config';
import { Hono } from 'hono';
import { createClient } from '@libsql/client';
import { compress } from 'hono/compress';
import { sentry } from '@hono/sentry';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import * as Sentry from '@sentry/node';
import { libsqlIntegration } from 'sentry-integration-libsql-client';

import { parseArticle, generateHtml } from './services/articleServices.js';
import rootTemplate from './templates/rootTemplate.js';
import urlTemplate from './templates/urlTemplate.js';
import errorTemplate from './templates/errorTemplate.js';

type Env = {
	SENTRY_DSN: string;
	ENVIRONMENT: string;
};

type Article = {
	author: string | null;
	content: string;
	date_published: string | null;
	dek: string | null;
	direction: string;
	domain: string;
	excerpt: string | null;
	lead_image_url: string | null;
	next_page_url: string | null;
	rendered_pages: number;
	title: string;
	total_pages: number;
	url: string;
	word_count: number;
};

const db = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN,
})

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.ENVIRONMENT,
	integrations: [libsqlIntegration(db, Sentry)],
});

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
		const id = createId();
		const article = await parseArticle(url);
		await db.execute({
			sql: `INSERT INTO articles (id, author, content, date_published, dek, direction, domain, excerpt, lead_image_url, next_page_url, rendered_pages, title, total_pages, url, word_count)
					VALUES (:id, :author, :content, :date_published, :dek, :direction, :domain, :excerpt, :lead_image_url, :next_page_url, :rendered_pages, :title, :total_pages, :url, :word_count)`,
			args: {
				id: id,
				author: article.author,
				content: article.content,
				date_published: article.date_published,
				dek: article.dek,
				direction: article.direction,
				domain: article.domain,
				excerpt: article.excerpt,
				lead_image_url: article.lead_image_url,
				next_page_url: article.next_page_url,
				rendered_pages: article.rendered_pages,
				title: article.title,
				total_pages: article.total_pages,
				url: article.url,
				word_count: article.word_count,
			},
		});
		return c.redirect('article/' + id);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}
});

app.get('/article/:id', async (c) => {
	const id = c.req.param('id');
	try {
		z.string().cuid2().parse(id);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}

	try {
		const rows = await db.execute({
			sql: 'SELECT * FROM articles WHERE id = :id',
			args: {
				id: id,
			},
		});

		const article = rows.rows[0];
		delete article.id;
		delete article.user_id;

		const articleHtml = generateHtml(article as unknown as Article);
		const html = urlTemplate(articleHtml);
		return c.html(html);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}
});

// TODO - POST request for article_id page for adding user_id to article
app.post('/article/:id', async (c) => {
	const id = c.req.param('id');
	try {
		z.string().cuid2().parse(id);
	} catch (_) {
		const html = errorTemplate('Failed to parse URL');
		return c.html(html);
	}
});

// TODO - POST request for auth page

// for unauth, redirect for auth page; otherwise, do nothing

serve({ fetch: app.fetch, port: Number(process.env.PORT) }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
