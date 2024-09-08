import 'dotenv/config';
import { Hono } from 'hono';
import { createClient } from '@libsql/client';
import * as Sentry from '@sentry/node';
import { libsqlIntegration } from 'sentry-integration-libsql-client';
import { Resend } from 'resend';
import { compress } from 'hono/compress';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';

import { parseArticle, generateHtml } from './articleServices.js';
import rootTemplate from './templates/rootTemplate.js';
import urlTemplate from './templates/urlTemplate.js';
import errorTemplate from './templates/errorTemplate.js';
import { authenticator, logger } from './middlewares.js';

// types
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

// pre-app setup
const dbClient = createClient({
	url: process.env.TURSO_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.ENVIRONMENT,
	integrations: [libsqlIntegration(dbClient, Sentry)],
});

const emailClient = new Resend(process.env.RESEND_API_KEY);

// app setup
const app = new Hono();

app.use(compress({ encoding: 'gzip' }));

app.use('*', logger());

app.use('/robots.txt', serveStatic({ root: './', rewriteRequestPath: () => '/public/robots.txt' }));
app.use('/public/*', serveStatic({ root: './' }));

app.use('*', authenticator());

// app routes
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
		const html = errorTemplate('Invalid URL');
		return c.html(html);
	}

	try {
		const id = createId();
		const article = await parseArticle(url);
		await dbClient.execute({
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
		const html = errorTemplate('Failed to parse content');
		return c.html(html);
	}
});

app.get('/article/:id', async (c) => {
	const id = c.req.param('id');
	let article;
	try {
		z.string().cuid2().parse(id);
		const rows = await dbClient.execute({
			sql: 'SELECT * FROM articles WHERE id = :id',
			args: {
				id: id,
			},
		});

		article = rows.rows[0];
	} catch (_) {
		return c.notFound();
	}

	try {
		delete article.id;
		delete article.user_id;

		const articleHtml = generateHtml(article as unknown as Article);
		const html = urlTemplate(articleHtml);
		return c.html(html);
	} catch (_) {
		const html = errorTemplate('Failed to display content');
		return c.html(html);
	}
});

app.get('/login', (c) => {
	// TODO - return html template
	return c.text('login');
});

app.post('/login', async (c) => {
	try {
		const body = await c.req.parseBody();
		const email = body.email as string;
		const password = body.password as string;

		z.string().email().parse(email);
		z.string().parse(password);

		const rows = await dbClient.execute({
			sql: 'SELECT * FROM users WHERE email = :email',
			args: {
				email: email,
			},
		});
		const user = rows.rows[0];

		// compare passwords

		// generate passcode
		let passcode = '123456';

		// insert passcode into database

		await emailClient.emails.send({
			from: 'jlfreeman@freemanapps.org',
			to: [email],
			subject: 'Here is your one time passcode',
			html: `<p>${passcode}</p>`,
		});

		// replace with HTML for login/validate form
		return c.html('TODO');
	} catch (_) {
		const html = errorTemplate('Invalid user and/or password');
		return c.html(html);
	}
});

// TODO - POST request for login/validate page

// TODO - GET request for dashboard page

// app deploy
serve({ fetch: app.fetch, port: Number(process.env.PORT) }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
