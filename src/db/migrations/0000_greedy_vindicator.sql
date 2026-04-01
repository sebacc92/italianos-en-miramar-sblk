CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`course_language` text NOT NULL,
	`title` text NOT NULL,
	`level` text NOT NULL,
	`description` text NOT NULL,
	`features` text,
	`schedule` text,
	`teacher` text,
	`is_highlight` integer DEFAULT false,
	`badge` text,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image_url` text,
	`image_alt` text,
	`event_date` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text,
	`cta_text` text,
	`link` text NOT NULL,
	`is_external` integer DEFAULT false,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`last_login` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);