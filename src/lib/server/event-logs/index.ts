import { db } from '../db';
import * as schema from '../db/schema';

export async function saveEventLog(type: string, data: unknown) {
  await db.insert(schema.eventLogs).values({ type, data });
}
