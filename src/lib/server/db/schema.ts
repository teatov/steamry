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
  timestamp,
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

export const games = pgTable(
  'games',
  {
    dailyId: integer()
      .notNull()
      .references(() => dailies.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    round: integer().notNull(),
    appid: integer().notNull(),
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
    screenshots: json().$type<{ thumbnail: string; src: string }[]>().notNull(),
    trailers: json().$type<{ thumbnail: string; webm?: string; mp4?: string }[]>().notNull(),
    contentDescriptors: json().$type<ContentDescriptor[]>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.dailyId, t.appid] })],
);

export const gamesRelations = relations(games, ({ one }) => ({
  daily: one(dailies, {
    fields: [games.dailyId],
    references: [dailies.id],
  }),
}));

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type NewGameInfoOnly = Omit<NewGame, 'dailyId' | 'round'>;

export const dailies = pgTable('dailies', {
  id: serial().primaryKey(),
  date: date({ mode: 'date' }).notNull().unique(),
});

export const dailiesRelations = relations(dailies, ({ many }) => ({
  games: many(games),
}));

export type Daily = typeof dailies.$inferSelect;
export type NewDaily = typeof dailies.$inferInsert;

export const eventLogs = pgTable('event_logs', {
  id: serial().primaryKey(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  type: varchar({ length: VARCHAR_LENGTH }).notNull(),
  data: json(),
});

export type EventLog = typeof eventLogs.$inferSelect;
export type NewEventLog = typeof eventLogs.$inferInsert;
