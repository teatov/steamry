import { eq } from 'drizzle-orm';
import { getTimezoneDate, getTodayDate, TZ_COOKIE, type Round } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  let date = getTodayDate();

  const timezone =
    cookies.get(TZ_COOKIE) !== undefined && !Number.isNaN(Number(cookies.get(TZ_COOKIE)))
      ? Number(cookies.get(TZ_COOKIE))
      : null;
  if (timezone !== null && timezone >= -14 * 60 && timezone <= 12 * 60) {
    date = getTimezoneDate(Number(cookies.get(TZ_COOKIE)));
  }

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
