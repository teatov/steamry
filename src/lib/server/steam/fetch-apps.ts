import { count, sql } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';
import { saveEventLog } from '../event-logs';

const APP_LIST_URL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const CHUNK_SIZE = 20_000;

export default async function fetchApps(onlyIfEmpty: boolean = false) {
  try {
    if (onlyIfEmpty) {
      const { rows } = (await db.select({ rows: count() }).from(schema.steamApps))[0];
      if (rows > 0) {
        console.log('Steam apps already fetched!');
        return;
      }
    }

    const response = await fetch(APP_LIST_URL);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!isAppListResponse(result)) {
      throw new Error('Unexpected response data');
    }

    const steamApps = result.applist.apps;

    await db.transaction(async (tx) => {
      console.log('Truncating table...');
      await tx.execute(sql`TRUNCATE TABLE ${schema.steamApps} RESTART IDENTITY`);

      for (let i = 0; i < steamApps.length; i += CHUNK_SIZE) {
        const end = Math.min(steamApps.length, i + CHUNK_SIZE);
        console.log(`Inserting ${i} - ${end}...`);
        await tx.insert(schema.steamApps).values(steamApps.slice(i, end));
      }
    });

    await saveEventLog('fetch-apps-finished', { appsTotal: steamApps.length });

    console.log('Done!');
  } catch (err) {
    console.error(err);
    try {
      await saveEventLog('fetch-apps-failed', { message: String(err) });
    } catch (e) {
      console.error(e);
    }
  }
}

type AppListResponse = {
  applist: {
    apps: { appid: number; name: string }[];
  };
};

function isAppListResponse(data: unknown): data is AppListResponse {
  return (
    typeof data === 'object' &&
    data != null &&
    'applist' in data &&
    typeof data.applist === 'object' &&
    data.applist != null &&
    'apps' in data.applist &&
    typeof data.applist.apps === 'object' &&
    data.applist.apps != null &&
    Array.isArray(data.applist.apps) &&
    data.applist.apps.length > 0
  );
}
