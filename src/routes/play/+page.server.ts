import { eq } from 'drizzle-orm';
import { getTodayDate, type Round } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const date = getTodayDate();
  const rounds = await getRounds(date);

  return { rounds, date };
};

async function getRounds(date: Date): Promise<Round[]> {
  const daily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, date),
    with: { games: true },
  });

  if (!daily || !daily.games || daily.games.length === 0) {
    return [];
  }

  const rounds: Record<number, Round> = {};
  for (let i = 0; i < daily.games.length; i++) {
    const game = daily.games[i];
    if (!rounds[game.round]) {
      rounds[game.round] = { round: game.round, games: [] };
    }
    rounds[game.round].games.push(game);
  }

  return Object.values(rounds).toSorted((a, b) => a.round - b.round);
}
