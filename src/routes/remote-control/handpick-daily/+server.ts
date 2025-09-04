import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { floorDate } from '$lib';
import handpickDaily from '$lib/server/daily/handpick-daily';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, date, appids } = (await request.json()) as {
    key?: string;
    date?: string;
    appids?: number[];
  };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }
  if (!date || !appids) {
    throw error(400, "Field 'date' or 'data' are missing");
  }

  handpickDaily(floorDate(new Date(date)), appids, 2);

  return json({ message: 'Started...' });
};
