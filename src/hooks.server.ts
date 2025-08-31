import type { ServerInit } from '@sveltejs/kit';
import { CronJob } from 'cron';
import generateDailies from '$lib/server/daily/generate-dailies';
import fetchApps from '$lib/server/steam/fetch-apps';

export const init: ServerInit = async () => {
  if (import.meta.env.PROD) {
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
};
