import { eq, max, min } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';
import fetchGameInfo from './fetch-game-info';

const MAX_ATTEMPTS = 200;

export default async function getRandomGames(amount: number): Promise<schema.NewGame[] | null> {
  try {
    const minMaxIdResult = await db
      .select({
        minId: min(schema.steamApps.id),
        maxId: max(schema.steamApps.id),
      })
      .from(schema.steamApps);
    if (minMaxIdResult.length === 0) {
      throw new Error('minMaxIdResult.length is 0');
    }

    const { minId, maxId } = minMaxIdResult[0];
    if (minId === null || maxId === null) {
      throw new Error('minId or maxId is null');
    }

    const games: schema.NewGame[] = [];
    let attempts = 0;
    const usedIds: number[] = [];

    while (games.length < amount && attempts < MAX_ATTEMPTS) {
      attempts += 1;
      const id = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

      if (usedIds.includes(id)) {
        continue;
      }

      const steamApp = await db.query.steamApps.findFirst({ where: eq(schema.steamApps.id, id) });
      if (!steamApp) {
        continue;
      }

      console.log(`\nhttps://store.steampowered.com/app/${steamApp.appid}`);

      const game = await fetchGameInfo(steamApp.appid.toString());
      if (!game) {
        continue;
      }

      games.push(game);
      usedIds.push(id);
    }

    return games;
  } catch (error) {
    console.error(error);
    return null;
  }
}
