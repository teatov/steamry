import { error, json } from '@sveltejs/kit';
import { gte, lte } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

// /remote-control/event-logs

export const POST: RequestHandler = async ({ request }) => {
  const { key, from, to } = (await request.json()) as { key?: string; from?: string; to?: string };
  if (!key || key !== env.SECRET_KEY) {
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
    const eventLogs = await query;
    return json(eventLogs);
  } catch (err) {
    throw error(500, String(err));
  }
};
