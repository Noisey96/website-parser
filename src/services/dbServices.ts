import { createClient } from '@libsql/client';
import * as Sentry from '@sentry/node';
import { libsqlIntegration } from 'sentry-integration-libsql-client';
import { drizzle } from 'drizzle-orm/libsql';

export function database(initializeSentry: boolean) {
	const dbClient = createClient({
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});

	if (initializeSentry) {
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			environment: process.env.ENVIRONMENT,
			integrations: [libsqlIntegration(dbClient, Sentry)],
		});
	}

	return drizzle(dbClient);
}
