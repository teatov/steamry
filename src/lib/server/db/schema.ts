import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const VARCHAR_LENGTH = 255;

export const steamApp = pgTable('steam_app', {
  id: serial().primaryKey(),
  appid: integer().unique().notNull(),
  name: varchar({ length: VARCHAR_LENGTH }).notNull(),
});

export type SteamApp = typeof steamApp.$inferSelect;
export type NewSteamApp = typeof steamApp.$inferInsert;
