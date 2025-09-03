import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { MAX_ERROR_LENGTH } from '$lib';

export const POST: RequestHandler = async ({ request }) => {
  const { key } = (await request.json()) as { key?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  try {
    await db.delete(schema.eventLogs);
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }

  return json({ message: `Deleted!` });
};
