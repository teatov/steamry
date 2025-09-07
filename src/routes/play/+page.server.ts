import { eq } from 'drizzle-orm';
import getClientDate from '$lib/server/daily/get-client-date';
import getRounds from '$lib/server/daily/get-rounds';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const date = getClientDate(cookies);
  const daily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, date),
    with: { games: true },
  });

  const rounds = getRounds(daily);

  return { rounds, date };
};
