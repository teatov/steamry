import type { Game } from './server/db/schema';

export function getTodayDate() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export enum ContentDescriptor {
  SomeNudityOrSexualContent = 1,
  FrequentViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityOrSexualContent = 4,
  GeneralMatureContent = 5,
}

export type Round = { round: number; games: Game[] };
