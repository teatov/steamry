import { error, json } from '@sveltejs/kit';
import { gte, lte, eq } from 'drizzle-orm';
import HumanHasher from 'humanhash';
import { env } from '$env/dynamic/private';
import { MAX_ERROR_LENGTH } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, from, to, date } = (await request.json()) as {
    key?: string;
    from?: string;
    to?: string;
    date?: string;
  };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  const query = db
    .select({
      date: schema.dailies.date,
      createdAt: schema.results.createdAt,
      ipHashed: schema.results.ipHashed,
      correctGuesses: schema.results.correctGuesses,
      guesses: schema.results.guesses,
    })
    .from(schema.results)
    .leftJoin(schema.dailies, eq(schema.results.dailyId, schema.dailies.id))
    .$dynamic();
  if (from) {
    query.where(gte(schema.results.createdAt, new Date(from)));
  }
  if (to) {
    query.where(lte(schema.results.createdAt, new Date(to)));
  }
  if (date) {
    query.where(eq(schema.dailies.date, new Date(date)));
  }

  const humanhash = new HumanHasher();

  try {
    return json(
      (await query).map((result) => ({
        ...result,
        guesses: result.guesses.map((value) => (value ? '1' : '0')).join(''),
        ipHashed: humanhash.humanize(result.ipHashed),
      })),
    );
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }
};
