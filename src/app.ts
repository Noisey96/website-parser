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
import { compare } from 'bcrypt';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, sql } from 'drizzle-orm';

import { parseArticle, generateHtml } from './articleServices.js';
import rootTemplate from './templates/rootTemplate.js';
import urlTemplate from './templates/urlTemplate.js';
import errorTemplate from './templates/errorTemplate.js';
import { authenticator, logger } from './middlewares.js';
import { articles, SelectArticles, users, tokens } from '../db/dev/schema.js';
import { generateEmailToken } from './authServices.js';

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

const db = drizzle(dbClient);

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

//app.use('*', authenticator());

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
		const article = await parseArticle(url);
		const id = await db.insert(articles).values(article).returning({ id: articles.id });
		return c.redirect('article/' + id);
	} catch (_) {
		const html = errorTemplate('Failed to parse content');
		return c.html(html);
	}
});

app.get('/article/:id', async (c) => {
	const id = c.req.param('id');
	let article: SelectArticles;
	try {
		z.string().cuid2().parse(id);
		const rows = await db.select().from(articles).where(eq(articles.id, id));
		article = rows[0];
		if (!article) throw new Error('Article not found');
	} catch (_) {
		return c.notFound();
	}

	try {
		const articleHtml = generateHtml(article as Article);
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

		const rows = await db.select().from(users).where(eq(users.email, email));
		const user = rows[0];
		if (!user) throw new Error('Invalid email');

		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) throw new Error('Invalid password');

		const emailToken = await generateEmailToken();
		await db.insert(tokens).values({
			user_id: user.id,
			token_type: 'email',
			token: emailToken.passcodeHash,
			valid: 1,
			expiration: sql`datetime(${emailToken.expiration})`,
		});

		await emailClient.emails.send({
			from: 'jlfreeman@freemanapps.org',
			to: [email],
			subject: 'Here is your one time passcode',
			html: `<p>${emailToken.passcode}</p>`,
		});

		// replace with HTML for login/validate form - TODO
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
