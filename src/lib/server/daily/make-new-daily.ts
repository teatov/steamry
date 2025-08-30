import { inArray, eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';
import getRandomGames from '../steam/get-random-games';

const ROUNDS = 10;
const GAMES_PER_ROUND = 2;

export default async function makeNewDaily(date: Date) {
  try {
    console.log(`\nMaking daily for ${date}`);

    const games = await getRandomGames(ROUNDS * GAMES_PER_ROUND);
    if (!games) {
      throw new Error('No games!');
    }

    await db.transaction(async (tx) => {
      await tx.delete(schema.games).where(
        inArray(
          schema.games.appid,
          games.map((value) => value.appid),
        ),
      );
      await tx.insert(schema.games).values(games);

      await tx.delete(schema.dailies).where(eq(schema.dailies.date, date));
      const daily = (await tx.insert(schema.dailies).values({ date }).returning())[0];

      const gamesToDailies: schema.NewGameToDaily[] = [];
      for (let i = 0; i < games.length; i++) {
        const round = Math.floor(i / GAMES_PER_ROUND);
        gamesToDailies.push({ dailyId: daily.id, gameAppid: games[i].appid, round });
      }
      await tx.insert(schema.gamesToDailies).values(gamesToDailies);
    });

    console.log('Finished!');
  } catch (error) {
    console.error(error);
  }
}
