CREATE TABLE `correspondence_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`message_kind` text NOT NULL,
	`alias` text NOT NULL,
	`character` text NOT NULL,
	`channel` text NOT NULL,
	`topic` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `learning_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_correspondence_room_created` ON `correspondence_messages` (`room_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_correspondence_room_kind_created` ON `correspondence_messages` (`room_id`,`message_kind`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
