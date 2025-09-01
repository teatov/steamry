import { error, json } from '@sveltejs/kit';
import { gte, lte, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, from, to } = (await request.json()) as { key?: string; from?: string; to?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  const query = db
    .select({
      date: schema.dailies.date,
      createdAt: schema.results.createdAt,
      correctGuesses: schema.results.correctGuesses,
      guesses: schema.results.guesses,
    })
    .from(schema.results)
    .leftJoin(schema.dailies, eq(schema.results.dailyId, schema.dailies.id))
    .$dynamic();
  if (from) {
    query.where(gte(schema.eventLogs.createdAt, new Date(from)));
  }
  if (to) {
    query.where(lte(schema.eventLogs.createdAt, new Date(to)));
  }

  try {
    return json(await query);
  } catch (err) {
    throw error(500, String(err));
  }
};
