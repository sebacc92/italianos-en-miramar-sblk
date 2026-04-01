ALTER TABLE `courses` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `services` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `services` ADD `category` text NOT NULL;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `icon`;