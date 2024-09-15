import 'dotenv/config';
import { Hono } from 'hono';
import { Resend } from 'resend';
import { compress } from 'hono/compress';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { z } from 'zod';
import { compare } from 'bcrypt';
import { eq, and, gte } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';

import { generateCardHtml, parseArticle } from './services/articleServices.js';
import { rootHTML, mainMenuHTML, errorHTML } from './templates/common.js';
import articleHTML from './templates/article.js';
import parseUrlFormHTML from './templates/parseUrlForm.js';
import loginFormHTML from './templates/loginForm.js';
import { authenticator, logger } from './middlewares.js';
import { articles, SelectArticles, users, tokens } from '../db/dev/schema.js';
import { generateEmailToken, generateAccessJWT, generateAccessJWTExpiration } from './services/authServices.js';
import validateLoginFormHTML from './templates/validateLoginForm.js';
import dashboardHTML from './templates/dashboard.js';
import { database } from './services/dbServices.js';

// pre-app setup
const db = database(true);
const emailClient = new Resend(process.env.RESEND_API_KEY);

// app setup
type Variables = {
	user: { id: string };
};
const app = new Hono<{ Variables: Variables }>();

// built-in middlewares
app.use(compress({ encoding: 'gzip' }));
app.use('/robots.txt', serveStatic({ root: './', rewriteRequestPath: () => '/public/robots.txt' }));
app.use('/public/*', serveStatic({ root: './' }));

// custom middlewares
app.use('*', logger());
app.use('*', authenticator());

// app routes
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
app.onError((_, c) => c.json({ message: 'Internal Server Error', ok: false }, 500));

app.get('/', async (c) => {
	try {
		const user = c.get('user');

		const articleRows = await db.select().from(articles).where(eq(articles.user_id, user.id));

		const articleCardHtmls = articleRows.map((article) => generateCardHtml(article));
		const html = rootHTML(dashboardHTML(articleCardHtmls), mainMenuHTML());
		return c.html(html);
	} catch (_) {
		const html = rootHTML(errorHTML('Failed to load articles'), mainMenuHTML());
		return c.html(html);
	}
});

app.get('/article/new', (c) => {
	c.header('HX-Push-URL', c.req.path);
	let html;
	try {
		if (c.req.header('HX-Request')) html = parseUrlFormHTML();
		else html = rootHTML(parseUrlFormHTML(), mainMenuHTML());
		return c.html(html);
	} catch (_) {
		if (c.req.header('HX-Request')) html = errorHTML('Failed to load form');
		else html = rootHTML(errorHTML('Failed to load form'), mainMenuHTML());
		return c.html(html);
	}
});

app.post('/article/new', async (c) => {
	const user = c.get('user');
	const body = await c.req.parseBody();
	const url = body.url as string;
	try {
		z.string().url().parse(url);
	} catch (_) {
		const html = parseUrlFormHTML('Invalid URL');
		return c.html(html);
	}

	try {
		let article = await parseArticle(url);
		article.user_id = user.id;
		const ids = await db.insert(articles).values(article).returning({ id: articles.id });
		return c.redirect('article/' + ids[0].id);
	} catch (_) {
		const html = parseUrlFormHTML('Failed to parse content');
		return c.html(html);
	}
});

app.get('/article/:id', async (c) => {
	let article: SelectArticles;
	try {
		const id = c.req.param('id');
		z.string().cuid2().parse(id);
		const rows = await db.select().from(articles).where(eq(articles.id, id));
		article = rows[0];
		if (!article) throw new Error('Article not found');
	} catch (_) {
		return c.notFound();
	}

	c.header('HX-Push-URL', c.req.path);
	let html;
	try {
		if (c.req.header('HX-Request')) html = articleHTML(article);
		else html = rootHTML(articleHTML(article), mainMenuHTML());
		return c.html(html);
	} catch (_) {
		if (c.req.header('HX-Request')) html = errorHTML('Failed to display content');
		else html = rootHTML(errorHTML('Failed to display content'), mainMenuHTML());
		return c.html(html);
	}
});

app.delete('/article/:id', async (c) => {
	try {
		const id = c.req.param('id');
		z.string().cuid2().parse(id);
		await db.delete(articles).where(eq(articles.id, id));
		return c.redirect('/');
	} catch (_) {
		return c.redirect('/');
	}
});

app.get('/login', (c) => {
	try {
		const html = rootHTML(loginFormHTML());
		return c.html(html);
	} catch (_) {
		const html = rootHTML(errorHTML('Failed to display login form'));
		return c.html(html);
	}
});

app.post('/login', async (c) => {
	try {
		const body = await c.req.parseBody();
		const email = body.email as string;
		const password = body.password as string;

		z.string().email().parse(email);
		z.string().parse(password);

		// identify user
		const rows = await db.select().from(users).where(eq(users.email, email));
		const user = rows[0];
		if (!user) throw new Error('Non-existent user');

		// validate password
		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) throw new Error('Invalid password');

		// generate email token
		const emailToken = await generateEmailToken();
		await db.insert(tokens).values({
			user_id: user.id,
			token_type: 'email',
			token: emailToken.passcodeHash,
			valid: 1,
			expiration: emailToken.expiration.toISOString(),
		});

		// send email with token
		await emailClient.emails.send({
			from: 'jlfreeman@freemanapps.org',
			to: [email],
			subject: 'Here is your one time passcode',
			html: `<p>${emailToken.passcode}</p>`,
		});

		return c.redirect('login/validate?id=' + user.id);
	} catch (e) {
		c.get('sentry').captureException(e);
		const html = loginFormHTML('Invalid user and/or password');
		return c.html(html);
	}
});

app.get('/login/validate', (c) => {
	try {
		const id = c.req.query('id') as string;

		z.string().cuid2().parse(id);

		c.header('HX-Push-URL', '/login/validate?id=' + id);
		let html;
		if (c.req.header('HX-Request')) html = validateLoginFormHTML(id);
		else html = rootHTML(validateLoginFormHTML(id));
		return c.html(html);
	} catch (_) {
		let html;
		if (c.req.header('HX-Request')) html = errorHTML('Failed to load form');
		else html = rootHTML(errorHTML('Failed to load form'), mainMenuHTML());
		return c.html(html);
	}
});

app.post('/login/validate', async (c) => {
	const id = c.req.query('id') as string;
	try {
		const body = await c.req.parseBody();
		const passcode = body.passcode as string;

		z.string().cuid2().parse(id);
		z.string().length(6).parse(passcode);

		// identify valid email tokens for user
		const now = new Date().toISOString();
		const tokenRows = await db
			.select()
			.from(tokens)
			.where(
				and(
					eq(tokens.user_id, id),
					eq(tokens.token_type, 'email'),
					eq(tokens.valid, 1),
					gte(tokens.expiration, now),
				),
			);

		// validate passcode
		const token = tokenRows.filter((t) => compare(t.token as string, passcode))[0];
		if (!token) throw new Error('Non-existent passcode');

		// invalidate email token
		await db.update(tokens).set({ valid: 0 }).where(eq(tokens.id, token.id));

		// generate access token
		const expiration = generateAccessJWTExpiration();
		const tokenIds = await db
			.insert(tokens)
			.values({
				user_id: id,
				token_type: 'access',
				valid: 1,
				expiration: expiration.toISOString(),
			})
			.returning({ id: tokens.id });
		const accessToken = await generateAccessJWT(tokenIds[0].id, expiration);

		setCookie(c, 'access_token', accessToken);
		c.header('HX-Redirect', '/');
		return c.redirect('/');
	} catch (e) {
		c.get('sentry').captureException(e);
		const html = rootHTML(validateLoginFormHTML(id, 'Invalid passcode'));
		return c.html(html);
	}
});

// app deploy
serve({ fetch: app.fetch, port: Number(process.env.PORT) }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
