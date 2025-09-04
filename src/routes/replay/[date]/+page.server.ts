import { error } from '@sveltejs/kit';
import { eq, and, lt } from 'drizzle-orm';
import { formatDate, getTomorrowDate } from '$lib';
import getClientDate from '$lib/server/daily/get-client-date';
import getRounds from '$lib/server/daily/get-rounds';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const date = new Date(params.date);

  if (isNaN(date.getTime())) {
    throw error(400, 'Invalid date');
  }

  const clientDate = getClientDate(cookies);

  const daily = await db.query.dailies.findFirst({
    where: and(eq(schema.dailies.date, date), lt(schema.dailies.date, clientDate)),
    with: { games: true },
  });

  const rounds = await getRounds(daily);

  if (rounds.length === 0) {
    throw error(404, `Daily for ${formatDate(date)} not found`);
  }

  const nextDaily = await db.query.dailies.findFirst({
    where: and(eq(schema.dailies.date, getTomorrowDate(date)), lt(schema.dailies.date, clientDate)),
  });
  const previousDaily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, getTomorrowDate(date, -1)),
  });

  return { rounds, date, nextDailyExists: !!nextDaily, previousDailyExists: !!previousDaily };
};
