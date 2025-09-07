import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  integer,
  text,
  json,
  date,
  primaryKey,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import type { ContentDescriptor } from '$lib';

export const steamApps = pgTable('steam_apps', {
  id: serial().primaryKey(),
  appid: integer().unique().notNull(),
  name: text().notNull(),
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
    tags: json().$type<string[]>(),
    categories: json().$type<string[]>().notNull(),
    genres: json().$type<string[]>().notNull(),
    screenshots: json().$type<{ thumbnail: string; src: string }[]>().notNull(),
    trailers: json().$type<{ thumbnail: string; webm?: string; mp4?: string }[]>().notNull(),
    contentDescriptors: json().$type<ContentDescriptor[]>().notNull(),
    requiredAge: integer().notNull().default(0),
    markedAsNsfw: boolean().notNull().default(false),
    isHandPicked: boolean().notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.dailyId, t.round, t.appid] })],
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
  description: text(),
});

export const dailiesRelations = relations(dailies, ({ many }) => ({
  games: many(games),
}));

export type Daily = typeof dailies.$inferSelect;
export type NewDaily = typeof dailies.$inferInsert;

export const results = pgTable(
  'results',
  {
    dailyId: integer()
      .notNull()
      .references(() => dailies.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
    ipHashed: text().notNull(),
    correctGuesses: integer().notNull(),
    guesses: json().$type<boolean[]>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.dailyId, t.ipHashed] })],
);

export type Result = typeof results.$inferSelect;
export type NewResult = typeof results.$inferInsert;

export const eventLogs = pgTable('event_logs', {
  id: serial().primaryKey(),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  type: text().notNull(),
  data: json().notNull(),
});

export type EventLog = typeof eventLogs.$inferSelect;
export type NewEventLog = typeof eventLogs.$inferInsert;
