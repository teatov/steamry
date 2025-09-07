import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { MAX_ERROR_LENGTH } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, data, id } = (await request.json()) as {
    key?: string;
    id?: number;
    data?: Partial<schema.Daily>;
  };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }
  if (!id || !data) {
    throw error(400, "Fields 'id' or 'data' are missing");
  }
  const keys = Object.keys(data) as (keyof schema.Daily)[];
  if (keys.includes('id') || keys.includes('date')) {
    throw error(400, "Cannot modify 'dailyId' or 'date'");
  }

  try {
    return json(
      await db.update(schema.dailies).set(data).where(eq(schema.dailies.id, id)).returning(),
    );
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }
};
