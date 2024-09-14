CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`author` text,
	`content` text,
	`date_published` text,
	`dek` text,
	`direction` text,
	`domain` text,
	`excerpt` text,
	`lead_image_url` text,
	`next_page_url` text,
	`rendered_pages` integer,
	`title` text,
	`total_pages` integer,
	`url` text,
	`word_count` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_type` text NOT NULL,
	`token` text,
	`valid` integer DEFAULT 1,
	`expiration` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);