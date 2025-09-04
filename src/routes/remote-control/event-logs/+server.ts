import { error, json } from '@sveltejs/kit';
import { gte, lte } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { MAX_ERROR_LENGTH } from '$lib';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { key, from, to } = (await request.json()) as { key?: string; from?: string; to?: string };
  if (!key || key !== env.REMOTE_CONTROL_KEY) {
    throw error(401);
  }

  const query = db.select().from(schema.eventLogs).$dynamic();
  if (from) {
    query.where(gte(schema.eventLogs.createdAt, new Date(from)));
  }
  if (to) {
    query.where(lte(schema.eventLogs.createdAt, new Date(to)));
  }

  try {
    return json(await query);
  } catch (err) {
    throw error(500, String(err).substring(0, MAX_ERROR_LENGTH));
  }
};
