import { eq } from 'drizzle-orm';
import { getTodayDate } from '../src/lib';
import makeNewDaily from '../src/lib/server/daily/make-new-daily';
import { db } from '../src/lib/server/db';
import * as schema from '../src/lib/server/db/schema';

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

process.exit(0);
