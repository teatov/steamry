import { desc, lt } from 'drizzle-orm';
import getClientDate from '$lib/server/daily/get-client-date';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const date = getClientDate(cookies);
  const dailies = await db.query.dailies.findMany({
    orderBy: desc(schema.dailies.date),
    where: lt(schema.dailies.date, date),
    columns: { date: true, description: true },
  });

  return { dailies };
};
