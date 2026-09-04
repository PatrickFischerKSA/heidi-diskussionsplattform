CREATE TABLE `contributions` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`alias` text NOT NULL,
	`topic` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `learning_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_contributions_room_created` ON `contributions` (`room_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `learning_rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`secret_hash` text NOT NULL,
	`label` text DEFAULT 'Mein Lernraum' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learning_rooms_secret` ON `learning_rooms` (`id`,`secret_hash`);--> statement-breakpoint
CREATE TABLE `learning_states` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`scope` text NOT NULL,
	`payload_json` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `learning_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_learning_states_room_scope` ON `learning_states` (`room_id`,`scope`);--> statement-breakpoint
CREATE INDEX `idx_learning_states_room_updated` ON `learning_states` (`room_id`,`updated_at`);
--> statement-breakpoint
PRAGMA optimize;
