CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`course_language` text NOT NULL,
	`title` text NOT NULL,
	`level` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
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
	`gallery` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `preinscripciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`telefono` text,
	`curso` text NOT NULL,
	`estado` text DEFAULT 'pendiente',
	`fecha_creacion` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `reservas_salones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`email` text NOT NULL,
	`telefono` text,
	`tipo_evento` text NOT NULL,
	`salon` text NOT NULL,
	`fecha_estimada` text NOT NULL,
	`mensaje` text,
	`estado` text DEFAULT 'pendiente',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`language` text DEFAULT 'es' NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
	`category` text NOT NULL,
	`cta_text` text,
	`link` text NOT NULL,
	`is_external` integer DEFAULT false,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `solicitudes_asociacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`dni` text NOT NULL,
	`fecha_nacimiento` text NOT NULL,
	`nacionalidad` text NOT NULL,
	`email` text NOT NULL,
	`telefono` text NOT NULL,
	`domicilio` text NOT NULL,
	`ciudad` text NOT NULL,
	`codigo_postal` text,
	`profesion` text,
	`estado_civil` text,
	`tiene_ascendencia_italiana` integer DEFAULT false,
	`socio_presentante_1` text,
	`socio_presentante_2` text,
	`motivo_asociacion` text,
	`estado` text DEFAULT 'pendiente',
	`fecha_solicitud` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `solicitudes_asociacion_dni_unique` ON `solicitudes_asociacion` (`dni`);--> statement-breakpoint
CREATE UNIQUE INDEX `solicitudes_asociacion_email_unique` ON `solicitudes_asociacion` (`email`);--> statement-breakpoint
CREATE INDEX `idx_solicitudes_fecha` ON `solicitudes_asociacion` (`fecha_solicitud`);--> statement-breakpoint
CREATE INDEX `idx_solicitudes_estado` ON `solicitudes_asociacion` (`estado`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`last_login` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);