import type { Game } from './server/db/schema';

export const STORE_PAGE_URL = 'https://store.steampowered.com/app';
export const MIN_REVIEWS = 20;

export function getTodayDate() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function getTomorrowDate(date: Date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export function getScore(game: Game) {
  return (
    Math.round((game.reviewsPositive / (game.reviewsNegative + game.reviewsPositive)) * 10000) / 100
  );
}

export function makeSaveDataKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export function ensureHttps(url: string) {
  return url.replace('http://', 'https://');
}

export enum ContentDescriptor {
  SomeNudityOrSexualContent = 1,
  FrequentViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityOrSexualContent = 4,
  GeneralMatureContent = 5,
}

export type Round = { round: number; games: Game[] };
