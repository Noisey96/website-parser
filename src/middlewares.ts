import 'dotenv/config';
import { createMiddleware } from 'hono/factory';
import { sentry } from '@hono/sentry';
import { except } from 'hono/combine';
import { getCookie } from 'hono/cookie';
import { decode, verify } from 'hono/jwt';
import { eq } from 'drizzle-orm';

import { database } from './services/dbServices';
import { tokens, users } from '../db/dev/schema';

const db = database(false);

export const logger = () => {
	return createMiddleware(async (c, next) => {
		console.log(`[${c.req.method}] ${c.req.url}`);
		const logging = sentry({ dsn: process.env.SENTRY_DSN, environment: process.env.ENVIRONMENT });
		await logging(c, next);
	});
};

export const authenticator = () => {
	return except(
		(c) => /\/public\w*/.test(c.req.path) || /\/login\w*/.test(c.req.path),
		createMiddleware(async (c, next) => {
			try {
				const authToken = getCookie(c, 'access_token');

				if (!authToken) throw new Error('No token');

				// find token in DB
				let { payload: authTokenPayload } = decode(authToken);
				const tokenRows = await db
					.select()
					.from(tokens)
					.where(eq(tokens.id, authTokenPayload.id as string));
				const token = tokenRows[0];

				// verify token against DB data
				const now = new Date().toISOString();
				if (token.token_type !== 'access' || !token.valid) {
					throw new Error('Invalid token');
				} else if (token.expiration < now) {
					await db.update(tokens).set({ valid: 0 }).where(eq(tokens.id, token.id));
					throw new Error('Expired token');
				}

				// verify token against secret
				authTokenPayload = await verify(authToken, process.env.ACCESS_JWT_SECRET);

				// find user in DB
				const userRows = await db.select().from(users).where(eq(users.id, token.user_id));
				const user = userRows[0];
				if (!user) throw new Error('User not found');
				c.set('user', user);
				c.get('sentry').setUser(user);
				await next();
			} catch (e) {
				c.set('user', null);
				c.get('sentry').setUser(null);
				c.res = c.redirect('/login');
				await next();
			}
		}),
	);
};
