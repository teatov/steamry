import { sql } from 'drizzle-orm';
import { db } from '../db';
import * as schema from '../db/schema';

const APP_LIST_URL = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
const CHUNK_SIZE = 20_000;

export default async function fetchApps() {
  try {
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

    console.log('Finished!');
  } catch (error) {
    console.error(error);
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
    Array.isArray(data.applist.apps)
  );
}
