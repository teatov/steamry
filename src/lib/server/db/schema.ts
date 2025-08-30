import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  json,
  date,
  primaryKey,
} from 'drizzle-orm/pg-core';
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
  trailers: json().$type<{ thumbnail: string; webm?: string; mp4?: string }[]>().notNull(),
  contentDescriptors: json().$type<ContentDescriptor[]>().notNull(),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export const dailies = pgTable('dailies', {
  id: serial().primaryKey(),
  date: date({ mode: 'date' }).notNull().unique(),
});

export const dailiesRelations = relations(dailies, ({ many }) => ({
  gamesToDailies: many(gamesToDailies),
}));

export type Daily = typeof dailies.$inferSelect;
export type NewDaily = typeof dailies.$inferInsert;

export const gamesToDailies = pgTable(
  'games_to_dailies',
  {
    dailyId: integer()
      .notNull()
      .references(() => dailies.id, { onDelete: 'cascade' }),
    round: integer().notNull(),
    gameAppid: integer()
      .notNull()
      .references(() => games.appid, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.dailyId, t.gameAppid] })],
);

export const gamesToDailiesRelations = relations(gamesToDailies, ({ one }) => ({
  game: one(games, {
    fields: [gamesToDailies.gameAppid],
    references: [games.appid],
  }),
  daily: one(dailies, {
    fields: [gamesToDailies.dailyId],
    references: [dailies.id],
  }),
}));

export type GameToDaily = typeof gamesToDailies.$inferSelect;
export type NewGameToDaily = typeof gamesToDailies.$inferInsert;
