import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { MAX_ERROR_LENGTH, STORE_PAGE_URL } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, date } = (await request.json()) as { key?: string; date?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  if (!date) {
    throw error(400, "Field 'date' is missing");
  }

  let daily: (schema.Daily & { games: schema.Game[] }) | undefined;
  try {
    daily = await db.query.dailies.findFirst({
      where: eq(schema.dailies.date, new Date(date)),
      with: { games: true },
    });
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }

  if (!daily) {
    throw error(404, `Daily for ${new Date(date).toISOString()} not found`);
  }

  daily.games = daily.games.toSorted((a, b) => a.round - b.round);

  const storePages: Record<string, string>[] = [];
  for (let i = 0; i < daily.games.length; i++) {
    const game = daily.games[i];
    if (!storePages[game.round]) {
      storePages[game.round] = {};
    }
    storePages[game.round][game.name] = `${STORE_PAGE_URL}/${game.appid}`;
  }

  return json({ storePages, daily });
};
