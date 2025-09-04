import { eq, max, min } from 'drizzle-orm';
import { MAX_ERROR_LENGTH } from '$lib';
import { db } from '../db';
import * as schema from '../db/schema';
import { saveEventLog } from '../event-logs';
import fetchGameInfo from './fetch-game-info';

const MAX_ATTEMPTS = 300;

export default async function getRandomGames(
  amount: number,
): Promise<schema.NewGameInfoOnly[] | null> {
  try {
    const minMaxIdResult = (
      await db
        .select({
          minId: min(schema.steamApps.id),
          maxId: max(schema.steamApps.id),
        })
        .from(schema.steamApps)
    )[0];

    const { minId, maxId } = minMaxIdResult;
    if (minId === null || maxId === null) {
      throw new Error('minId or maxId is null');
    }

    const games: schema.NewGameInfoOnly[] = [];
    let attempts = 0;
    const usedIds: number[] = [];

    while (games.length < amount) {
      attempts += 1;
      if (attempts > MAX_ATTEMPTS) {
        throw new Error(`Exceeded ${MAX_ATTEMPTS} attempts`);
      }

      const id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

      if (usedIds.includes(id)) {
        continue;
      }

      const steamApp = await db.query.steamApps.findFirst({ where: eq(schema.steamApps.id, id) });
      if (!steamApp) {
        continue;
      }

      const game = await fetchGameInfo(steamApp.appid.toString());
      if (!game) {
        continue;
      }

      games.push(game);
      usedIds.push(id);
    }

    return games;
  } catch (err) {
    console.error(err);
    try {
      await saveEventLog('get-random-games-failed', {
        message: String(err).substring(0, MAX_ERROR_LENGTH),
      });
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}
