CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`author` text,
	`content` blob,
	`date_published` text,
	`dek` text,
	`direction` text,
	`domain` text,
	`excerpt` blob,
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
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);