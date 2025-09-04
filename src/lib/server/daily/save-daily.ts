import { eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';

export default async function saveDaily(
  date: Date,
  gameInfos: schema.NewGameInfoOnly[],
  gamesPerRound: number,
) {
  let daily: schema.Daily | undefined = undefined;
  const games: schema.NewGame[] = [];

  await db.transaction(async (tx) => {
    await tx.delete(schema.dailies).where(eq(schema.dailies.date, date));
    daily = (await tx.insert(schema.dailies).values({ date }).returning())[0];

    for (let i = 0; i < gameInfos.length; i++) {
      const round = Math.floor(i / gamesPerRound);
      games.push({ ...gameInfos[i], dailyId: daily.id, round });
    }
    await tx.insert(schema.games).values(games);
  });

  return daily;
}
