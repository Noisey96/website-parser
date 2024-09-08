import { text, blob, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
});

export const articles = sqliteTable('articles', {
	id: text('id').primaryKey(),
	user_id: text('user_id').references(() => users.id),
	author: text('author'),
	content: blob('content'),
	date_published: text('date_published'),
	dek: text('dek'),
	direction: text('direction'),
	domain: text('domain'),
	excerpt: blob('excerpt'),
	lead_image_url: text('lead_image_url'),
	next_page_url: text('next_page_url'),
	rendered_pages: integer('rendered_pages'),
	title: text('title'),
	total_pages: integer('total_pages'),
	url: text('url'),
	word_count: integer('word_count'),
});

/*
export const tokens = pgTable('tokens', {
	id: uuid('id').defaultRandom().primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),

	tokenType: text('token_type').notNull(),
	emailToken: char('email_token', { length: 6 }),

	valid: boolean('valid').default(true),
	expiration: timestamp('expiration').notNull(),

	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
});

export const tokensRelations = relations(tokens, ({ one }) => ({
	user: one(users, {
		fields: [tokens.userId],
		references: [users.id],
	}),
}));
*/
