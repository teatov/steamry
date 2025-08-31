import type { ServerInit } from '@sveltejs/kit';
import { CronJob } from 'cron';
import generateDailies from '$lib/server/daily/generate-dailies';

export const init: ServerInit = async () => {
  if (import.meta.env.PROD) {
    await generateDailies();

    CronJob.from({
      cronTime: '00 12 00 * * *',
      onTick: generateDailies,
      start: true,
      utcOffset: 0,
    });
  }
};
