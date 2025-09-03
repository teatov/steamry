import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import makeNewDaily from '$lib/server/daily/make-new-daily';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, date } = (await request.json()) as { key?: string; date?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  if (!date || isNaN(new Date(date).getTime())) {
    throw error(400, "Field 'date' is missing");
  }

  makeNewDaily(new Date(date));

  return json({ message: `Started generating daily for ${new Date(date).toISOString()}...` });
};
