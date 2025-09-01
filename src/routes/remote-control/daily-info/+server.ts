import { error, json } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
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

  let daily: (schema.Daily & { games: Partial<schema.Game>[] }) | undefined;
  try {
    daily = await db.query.dailies.findFirst({
      where: eq(schema.dailies.date, new Date(date)),
      with: { games: { orderBy: asc(schema.games.round) } },
    });
  } catch (err) {
    throw error(500, String(err));
  }

  if (!daily) {
    throw error(404, `Daily for ${new Date(date).toISOString()} not found`);
  }

  return json(daily);
};
