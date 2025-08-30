import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const VARCHAR_LENGTH = 255;

export const steamApp = pgTable('steam_app', {
  id: serial().primaryKey(),
  appid: integer(),
  name: varchar({ length: VARCHAR_LENGTH }),
});
