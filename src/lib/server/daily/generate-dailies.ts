import { eq } from 'drizzle-orm';
import { getTodayDate } from '../..';
import { db } from '../db';
import * as schema from '../db/schema';
import makeNewDaily from './make-new-daily';

export default async function generateDailies() {
  const today = getTodayDate();
  const todayDaily = await db.query.dailies.findFirst({ where: eq(schema.dailies.date, today) });
  if (!todayDaily) {
    await makeNewDaily(today);
  } else {
    console.log(`
    \nDaily for ${today.toISOString().split('T')[0]} already exists`);
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDaily = await db.query.dailies.findFirst({
    where: eq(schema.dailies.date, tomorrow),
  });
  if (!tomorrowDaily) {
    await makeNewDaily(tomorrow);
  } else {
    console.log(`\nDaily for ${tomorrow.toISOString().split('T')[0]} already exists`);
  }
}
