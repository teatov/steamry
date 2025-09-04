import { eq } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';

export default async function saveDaily(date: Date, rounds: schema.NewGameInfoOnly[][]) {
  let daily: schema.Daily | undefined = undefined;
  const games: schema.NewGame[] = [];

  await db.transaction(async (tx) => {
    await tx.delete(schema.dailies).where(eq(schema.dailies.date, date));
    daily = (await tx.insert(schema.dailies).values({ date }).returning())[0];

    for (let i = 0; i < rounds.length; i++) {
      for (let j = 0; j < rounds[i].length; j++) {
        games.push({ ...rounds[i][j], dailyId: daily.id, round: i });
      }
    }

    await tx.insert(schema.games).values(games);
  });

  return daily;
}
