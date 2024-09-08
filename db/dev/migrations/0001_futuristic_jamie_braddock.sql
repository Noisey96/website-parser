CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`token_type` text NOT NULL,
	`token` text,
	`valid` integer DEFAULT 1,
	`expiration` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
