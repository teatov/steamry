import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import fetchGameInfo from '$lib/server/steam/fetch-game-info';

export async function refetchDailyInfo(games: schema.Game[]) {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < games.length; i++) {
        console.log(`\nhttps://store.steampowered.com/app/${games[i].appid}`);
        const gameInfo = await fetchGameInfo(games[i].appid.toString());
        if (!gameInfo) {
          throw new Error(`Could not fetch ${games[i].appid}`);
        }

        await tx
          .update(schema.games)
          .set(gameInfo)
          .where(
            and(eq(schema.games.appid, games[i].appid), eq(schema.games.dailyId, games[i].dailyId)),
          );
      }
    });
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}
