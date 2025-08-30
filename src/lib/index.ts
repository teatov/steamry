import type { Game } from './server/db/schema';

export function getTodayDate() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function getScore(game: Game) {
  return (
    Math.round((game.reviewsPositive / (game.reviewsNegative + game.reviewsPositive)) * 10000) / 100
  );
}

export function makeSaveDataKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export enum ContentDescriptor {
  SomeNudityOrSexualContent = 1,
  FrequentViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityOrSexualContent = 4,
  GeneralMatureContent = 5,
}

export type Round = { round: number; games: Game[] };
