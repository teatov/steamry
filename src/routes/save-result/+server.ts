import { error } from '@sveltejs/kit';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getTodayDate, getTomorrowDate, type ResultBody } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (request.headers.get('origin') !== env.ORIGIN) {
    throw error(403);
  }

  const data = await request.json();
  if (!isResult(data)) {
    throw error(400);
  }

  const date = new Date(data.date);
  const todayDate = getTodayDate();

  if (
    !(
      date.getTime() === todayDate.getTime() ||
      date.getTime() === getTomorrowDate(todayDate).getTime() ||
      date.getTime() === getTomorrowDate(todayDate, -1).getTime()
    )
  ) {
    throw error(400);
  }

  const daily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, date),
    with: { games: true },
  });

  if (!daily || !daily.games || daily.games.length === 0) {
    throw error(500);
  }

  const rounds = Object.keys(
    daily.games.reduce(
      (acc, curr) => {
        acc[curr.round] = true;
        return acc;
      },
      {} as Record<number, true>,
    ),
  ).length;

  if (data.guesses.length !== rounds) {
    throw error(400);
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', env.SECRET_KEY, env.SECRET_IV);
  const cipherUpdated = cipher.update(getClientAddress(), 'utf8', 'base64');
  const ipHashed = cipherUpdated + cipher.final('base64');

  await db
    .insert(schema.results)
    .values({
      dailyId: daily.id,
      ipHashed,
      correctGuesses: data.guesses.filter((value) => value).length,
      guesses: data.guesses,
    })
    .onConflictDoNothing();

  return new Response(undefined, { status: 201 });
};

function isResult(data: unknown): data is ResultBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'date' in data &&
    typeof data.date === 'string' &&
    'guesses' in data &&
    typeof data.guesses === 'object' &&
    data.guesses !== null &&
    Array.isArray(data.guesses) &&
    data.guesses.every((value) => typeof value === 'boolean')
  );
}
