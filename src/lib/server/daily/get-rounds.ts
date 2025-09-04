import { type Round } from '$lib';
import * as schema from '$lib/server/db/schema';

export default function getRounds(
  daily: (schema.Daily & { games: schema.Game[] }) | undefined,
): Round[] {
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
