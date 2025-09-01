import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getTodayDate, getTomorrowDate } from '$lib';
import makeNewDaily from '$lib/server/daily/make-new-daily';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key } = (await request.json()) as { key?: string };
  if (!key || key !== env.SECRET_KEY) {
    throw error(401);
  }

  const tomorrow = getTomorrowDate(getTodayDate());
  makeNewDaily(tomorrow);

  return json({ message: `Started generating daily for ${tomorrow.toISOString()}...` });
};
