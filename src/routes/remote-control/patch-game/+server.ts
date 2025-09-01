import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, appid, data } = (await request.json()) as {
    key?: string;
    appid?: number;
    data?: Partial<schema.Game>;
  };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }
  if (!appid) {
    throw error(400, "Field 'appid' is missing");
  }
  if (!data) {
    throw error(400, "Field 'data' is missing");
  }

  try {
    return json(
      await db.update(schema.games).set(data).where(eq(schema.games.appid, appid)).returning(),
    );
  } catch (err) {
    throw error(500, String(err));
  }
};
