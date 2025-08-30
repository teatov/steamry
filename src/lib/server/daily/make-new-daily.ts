import { eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';
import getRandomGames from '../steam/get-random-games';

const ROUNDS = 10;
const GAMES_PER_ROUND = 2;

export default async function makeNewDaily(date: Date) {
  try {
    console.log(`\nMaking daily for ${date}`);

    const gameInfos = await getRandomGames(ROUNDS * GAMES_PER_ROUND);
    if (!gameInfos || gameInfos.length === 0) {
      throw new Error('No games!');
    }

    await db.transaction(async (tx) => {
      await tx.delete(schema.dailies).where(eq(schema.dailies.date, date));
      const daily = (await tx.insert(schema.dailies).values({ date }).returning())[0];

      const games: schema.NewGame[] = [];
      for (let i = 0; i < gameInfos.length; i++) {
        const round = Math.floor(i / GAMES_PER_ROUND);
        games.push({ ...gameInfos[i], dailyId: daily.id, round });
      }
      await tx.insert(schema.games).values(games);
    });

    console.log('Finished!');
  } catch (error) {
    console.error(error);
  }
}
