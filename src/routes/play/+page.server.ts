import { eq } from 'drizzle-orm';
import { getTodayDate, type Round } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const rounds = await getRounds();

  return { rounds };
};

async function getRounds(): Promise<Round[] | null> {
  const daily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, getTodayDate()),
    with: { gamesToDailies: { with: { game: true } } },
  });

  if (!daily || !daily?.gamesToDailies) {
    return null;
  }

  const rounds: Record<number, Round> = {};
  for (let i = 0; i < daily?.gamesToDailies.length; i++) {
    const gamesToDailies = daily.gamesToDailies[i];
    if (!rounds[gamesToDailies.round]) {
      rounds[gamesToDailies.round] = { round: gamesToDailies.round, games: [] };
    }
    rounds[gamesToDailies.round].games.push(gamesToDailies.game);
  }

  return Object.values(rounds).toSorted((a, b) => a.round - b.round);
}
