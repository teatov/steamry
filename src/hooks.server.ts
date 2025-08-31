import { CronJob } from 'cron';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { building } from '$app/environment';
import generateDailies from '$lib/server/daily/generate-dailies';
import { db } from '$lib/server/db';
import fetchApps from '$lib/server/steam/fetch-apps';

if (import.meta.env.PROD && !building) {
  console.log('Migrating...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations done!');

  await fetchApps();
  await generateDailies();

  CronJob.from({
    cronTime: '00 12 00 * * *',
    onTick: generateDailies,
    start: true,
    utcOffset: 0,
  });

  CronJob.from({
    cronTime: '00 06 00 * * 1',
    onTick: fetchApps,
    start: true,
    utcOffset: 0,
  });
}
