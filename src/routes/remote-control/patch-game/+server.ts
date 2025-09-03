import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { MAX_ERROR_LENGTH } from '$lib';

export const POST: RequestHandler = async ({ request }) => {
  const { key, appid, data } = (await request.json()) as {
    key?: string;
    appid?: number;
    data?: Partial<schema.Game>;
  };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }
  if (!appid || !data) {
    throw error(400, "Field 'appid' or 'data' are missing");
  }
  const keys = Object.keys(data) as (keyof schema.Game)[];
  if (keys.includes('appid') || keys.includes('dailyId') || keys.includes('round')) {
    throw error(400, "Cannot modify 'appid', 'dailyId' or 'round'");
  }

  try {
    return json(
      await db.update(schema.games).set(data).where(eq(schema.games.appid, appid)).returning(),
    );
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }
};
