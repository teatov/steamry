import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import fetchApps from '$lib/server/steam/fetch-apps';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key } = (await request.json()) as { key?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  fetchApps();

  return json({ message: `Started fetching steam apps...` });
};
