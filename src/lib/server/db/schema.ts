import { pgTable, serial, integer, varchar, text, json } from 'drizzle-orm/pg-core';
import type { ContentDescriptor } from '$lib';

export const VARCHAR_LENGTH = 255;

export const steamApps = pgTable('steam_apps', {
  id: serial().primaryKey(),
  appid: integer().unique().notNull(),
  name: varchar({ length: VARCHAR_LENGTH }).notNull(),
});

export type SteamApp = typeof steamApps.$inferSelect;
export type NewSteamApp = typeof steamApps.$inferInsert;

export const games = pgTable('games', {
  appid: integer().primaryKey(),
  name: text().notNull(),
  reviewsPositive: integer().notNull(),
  reviewsNegative: integer().notNull(),
  description: text().notNull(),
  price: text(),
  releaseDate: text().notNull(),
  headerImage: text().notNull(),
  developers: json().$type<string[]>().notNull(),
  publishers: json().$type<string[]>().notNull(),
  categories: json().$type<string[]>().notNull(),
  genres: json().$type<string[]>().notNull(),
  screenshots: json().$type<string[]>().notNull(),
  contentDescriptors: json().$type<ContentDescriptor[]>().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
