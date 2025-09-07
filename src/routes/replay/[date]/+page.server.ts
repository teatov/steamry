import { error } from '@sveltejs/kit';
import { eq, and, lt } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { formatDate, getTomorrowDate } from '$lib';
import getClientDate from '$lib/server/daily/get-client-date';
import getRounds from '$lib/server/daily/get-rounds';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

const RC_COOKIE = 'RC';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const date = new Date(params.date);

  if (isNaN(date.getTime())) {
    throw error(400, 'Invalid date');
  }

  const clientDate = getClientDate(cookies);
  const canLookIntoFuture =
    cookies.get(RC_COOKIE) !== undefined && cookies.get(RC_COOKIE) === env.REMOTE_CONTROL_KEY;

  const daily = await db.query.dailies.findFirst({
    where: and(
      eq(schema.dailies.date, date),
      !canLookIntoFuture ? lt(schema.dailies.date, clientDate) : undefined,
    ),
    with: { games: true },
  });

  const rounds = await getRounds(daily);

  if (rounds.length === 0) {
    throw error(404, `Daily for ${formatDate(date)} not found`);
  }

  const nextDaily = await db.query.dailies.findFirst({
    where: and(eq(schema.dailies.date, getTomorrowDate(date)), lt(schema.dailies.date, clientDate)),
    columns: { date: true, description: true },
  });
  const previousDaily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, getTomorrowDate(date, -1)),
    columns: { date: true, description: true },
  });

  return { rounds, date, nextDaily, previousDaily };
};
