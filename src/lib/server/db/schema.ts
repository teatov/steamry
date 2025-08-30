import { pgTable, serial, integer, varchar, text, json } from 'drizzle-orm/pg-core';
import type { ContentDescriptor } from '$lib';

export const VARCHAR_LENGTH = 255;

export const steamApp = pgTable('steam_app', {
  id: serial().primaryKey(),
  appid: integer().unique().notNull(),
  name: varchar({ length: VARCHAR_LENGTH }).notNull(),
});

export type SteamApp = typeof steamApp.$inferSelect;
export type NewSteamApp = typeof steamApp.$inferInsert;

export const game = pgTable('game', {
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

export type Game = typeof game.$inferSelect;
export type NewGame = typeof game.$inferInsert;
