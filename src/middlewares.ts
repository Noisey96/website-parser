import 'dotenv/config';
import { createMiddleware } from 'hono/factory';
import { sentry } from '@hono/sentry';
import { jwt } from 'hono/jwt';
import { some } from 'hono/combine';

export const logger = () => {
	return createMiddleware(async (c, next) => {
		console.log(`[${c.req.method}] ${c.req.url}`);
		const logging = sentry({ dsn: process.env.SENTRY_DSN, environment: process.env.ENVIRONMENT });
		await logging(c, next);
	});
};

// fix this for article/login
export const authenticator = () => {
	return some(
		(c) => {
			return /\/public\w*/.test(c.req.path) || /\/login\w*/.test(c.req.path);
		},
		jwt({ secret: process.env.JWT_SECRET }),
		async (c, next) => {
			c.res = c.redirect('/login');
			await next();
		},
	);
};
