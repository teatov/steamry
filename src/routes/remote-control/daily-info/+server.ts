import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

// /remote-control/daily-info

export const POST: RequestHandler = async ({ request }) => {
  const { key, date } = (await request.json()) as { key?: string; date?: string };
  if (!key || key !== env.SECRET_KEY) {
    throw error(401);
  }

  if (!date) {
    throw error(402, "Field 'date' is missing");
  }

  let daily: (schema.Daily & { games: schema.Game[] }) | undefined;
  try {
    daily = await db.query.dailies.findFirst({
      where: eq(schema.dailies.date, new Date(date)),
      with: { games: true },
    });
  } catch (err) {
    throw error(500, String(err));
  }

  if (!daily) {
    throw error(404, `Daily for ${new Date(date).toISOString()} not found`);
  }

  daily.games = daily.games.toSorted((a, b) => a.round - b.round);

  return json(daily);
};
