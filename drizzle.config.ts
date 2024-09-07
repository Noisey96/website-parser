import 'dotenv/config';
import type { Config } from 'drizzle-kit';

let drizzleConfig;
if (process.env.ENVIRONMENT == 'dev') {
	drizzleConfig = {
		schema: './db/dev/schema.ts',
		out: './db/dev/migrations',
		dialect: 'sqlite',
		driver: 'turso',
		dbCredentials: {
			url: 'file:./tests/db/local.db',
		},
	} satisfies Config;
} else if (process.env.ENVIRONMENT == 'prd') {
	drizzleConfig = {
		schema: './db/prd/schema.ts',
		out: './db/prd/migrations',
		dialect: 'sqlite',
		driver: 'turso',
		dbCredentials: {
			url: process.env.DATABASE_URL!,
			authToken: process.env.DATABASE_AUTH_TOKEN,
		},
	} satisfies Config;
}

export default drizzleConfig;
