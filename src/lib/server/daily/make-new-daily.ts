import { eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';
import { saveEventLog } from '../event-logs';
import getRandomGames from '../steam/get-random-games';

const ROUNDS = 10;
const GAMES_PER_ROUND = 2;

export default async function makeNewDaily(date: Date) {
  try {
    console.log(`\nMaking daily for ${date.toISOString()}`);

    const gameInfos = await getRandomGames(ROUNDS * GAMES_PER_ROUND);
    if (!gameInfos || gameInfos.length === 0) {
      throw new Error('No games!');
    }

    let daily: schema.Daily | undefined = undefined;
    const games: schema.NewGame[] = [];

    await db.transaction(async (tx) => {
      await tx.delete(schema.dailies).where(eq(schema.dailies.date, date));
      daily = (await tx.insert(schema.dailies).values({ date }).returning())[0];

      for (let i = 0; i < gameInfos.length; i++) {
        const round = Math.floor(i / GAMES_PER_ROUND);
        games.push({ ...gameInfos[i], dailyId: daily.id, round });
      }
      await tx.insert(schema.games).values(games);
    });

    await saveEventLog('make-new-daily-finished', daily);

    console.log('Finished!');
  } catch (err) {
    console.error(err);
    try {
      await saveEventLog('make-new-daily-failed', { message: String(err).substring(0, 10_000) });
    } catch (e) {
      console.error(e);
    }
  }
}
