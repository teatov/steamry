import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { type ResultBody } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  if (request.headers.get('origin') !== env.ORIGIN) {
    throw error(403);
  }

  const data = await request.json();
  if (!isResult(data)) {
    throw error(400);
  }

  const date = new Date(data.date);
  const results = await db
    .select({ correctGuesses: schema.results.correctGuesses, guesses: schema.results.guesses })
    .from(schema.results)
    .leftJoin(schema.dailies, eq(schema.results.dailyId, schema.dailies.id))
    .where(eq(schema.dailies.date, date));

  if (results.length === 0) {
    return json(null);
  }

  let guessesSum = 0;
  const roundsSum: number[] = [];
  for (let i = 0; i < results.length; i++) {
    guessesSum += results[i].correctGuesses;
    for (let j = 0; j < results[i].guesses.length; j++) {
      if (!roundsSum[j]) {
        roundsSum[j] = 0;
      }
      roundsSum[j] += results[i].guesses[j] ? 1 : 0;
    }
  }

  return json({
    average: guessesSum / results.length,
    rounds: roundsSum.map((value) => value / results.length),
  });
};

function isResult(data: unknown): data is ResultBody {
  return (
    typeof data === 'object' && data !== null && 'date' in data && typeof data.date === 'string'
  );
}
