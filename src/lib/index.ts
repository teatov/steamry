import type { Game, NewGameInfoOnly } from './server/db/schema';

export const STORE_PAGE_URL = 'https://store.steampowered.com/app';
export const MIN_REVIEWS = 20;
export const TZ_COOKIE = 'TZ';
export const MAX_ERROR_LENGTH = 10_000;
export const SAVE_DATA = 'save_data';

export function floorDate(dateTime: Date) {
  const date = new Date(dateTime);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export function getTodayDate() {
  return floorDate(new Date());
}

export function getTomorrowDate(date: Date, shift: number = 1) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + shift);
  return tomorrow;
}

export function getTimezoneDate(offsetMinutes: number) {
  const date = new Date();
  date.setTime(date.getTime() - offsetMinutes * 60 * 1000);
  return floorDate(date);
}

export function getScore(game: NewGameInfoOnly) {
  return (
    Math.round((game.reviewsPositive / (game.reviewsNegative + game.reviewsPositive)) * 10000) / 100
  );
}

export function getMaxScore(games: NewGameInfoOnly[]) {
  return getScore(
    games.reduce(function (prev, current) {
      return prev && getScore(prev) > getScore(current) ? prev : current;
    }),
  );
}

export function makeSaveDataKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export function ensureHttps(url: string) {
  return url.replace('http://', 'https://');
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { dateStyle: 'medium' });
}

export function getContentDescriptorText(descriptor: number): string {
  switch (descriptor) {
    case ContentDescriptor.SomeNudityOrSexualContent:
      return 'Some Nudity or Sexual Content';
    case ContentDescriptor.FrequentViolenceOrGore:
      return 'Frequent Violence or Gore';
    case ContentDescriptor.AdultOnlySexualContent:
      return 'Adult Only Sexual Content';
    case ContentDescriptor.FrequentNudityOrSexualContent:
      return 'Frequent Nudity or Sexual Content';
    case ContentDescriptor.GeneralMatureContent:
      return 'General Mature Content';
    default:
      return descriptor.toString();
  }
}

export function filterMildContentDescriptors(
  descriptors: ContentDescriptor[],
): ContentDescriptor[] {
  return descriptors.filter((value) =>
    [
      ContentDescriptor.AdultOnlySexualContent,
      ContentDescriptor.FrequentNudityOrSexualContent,
    ].includes(value),
  );
}

export enum ContentDescriptor {
  SomeNudityOrSexualContent = 1,
  FrequentViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityOrSexualContent = 4,
  GeneralMatureContent = 5,
}

export type Round = { round: number; games: Game[] };

export type ResultBody = { guesses: boolean[]; date: string };

export type SaveData = Record<string, boolean[]>;
