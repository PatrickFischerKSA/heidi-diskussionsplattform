import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const learningRooms = sqliteTable('learning_rooms', {
  id: text('id').primaryKey(),
  secretHash: text('secret_hash').notNull(),
  label: text('label').notNull().default('Mein Lernraum'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, table => [uniqueIndex('idx_learning_rooms_secret').on(table.id, table.secretHash)]);

export const learningStates = sqliteTable('learning_states', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(()=>learningRooms.id,{onDelete:'cascade'}),
  scope: text('scope').notNull(),
  payloadJson: text('payload_json').notNull(),
  updatedAt: text('updated_at').notNull(),
}, table => [
  uniqueIndex('idx_learning_states_room_scope').on(table.roomId,table.scope),
  index('idx_learning_states_room_updated').on(table.roomId,table.updatedAt),
]);

export const contributions = sqliteTable('contributions', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(()=>learningRooms.id,{onDelete:'cascade'}),
  alias: text('alias').notNull(),
  topic: text('topic').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull(),
}, table => [index('idx_contributions_room_created').on(table.roomId,table.createdAt)]);

export const correspondenceMessages = sqliteTable('correspondence_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(()=>learningRooms.id,{onDelete:'cascade'}),
  messageKind: text('message_kind').notNull(),
  alias: text('alias').notNull(),
  character: text('character').notNull(),
  channel: text('channel').notNull(),
  topic: text('topic').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull(),
}, table => [
  index('idx_correspondence_room_created').on(table.roomId,table.createdAt),
  index('idx_correspondence_room_kind_created').on(table.roomId,table.messageKind,table.createdAt),
]);
