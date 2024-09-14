import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
	id: text('id').primaryKey().$default(createId),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
});

export const articles = sqliteTable('articles', {
	id: text('id').primaryKey().$default(createId),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	author: text('author'),
	content: text('content'),
	date_published: text('date_published'),
	dek: text('dek'),
	direction: text('direction'),
	domain: text('domain'),
	excerpt: text('excerpt'),
	lead_image_url: text('lead_image_url'),
	next_page_url: text('next_page_url'),
	rendered_pages: integer('rendered_pages'),
	title: text('title'),
	total_pages: integer('total_pages'),
	url: text('url'),
	word_count: integer('word_count'),
});

export const tokens = sqliteTable('tokens', {
	id: text('id').primaryKey().$default(createId),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	token_type: text('token_type').notNull(),
	token: text('token'),
	valid: integer('valid').default(1),
	expiration: text('expiration').notNull(),
});

export type SelectUsers = InferSelectModel<typeof users>;
export type InsertUsers = InferInsertModel<typeof users>;

export type SelectArticles = InferSelectModel<typeof articles>;
export type InsertArticles = InferInsertModel<typeof articles>;
