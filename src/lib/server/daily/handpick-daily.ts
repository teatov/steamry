import type { NewGameInfoOnly } from '../db/schema';
import fetchGameInfo from '../steam/fetch-game-info';
import saveDaily from './save-daily';

export default async function handpickDaily(date: Date, appids: number[][]) {
  try {
    console.log(`\nHand picking daily for ${date.toISOString()}`);

    const rounds: NewGameInfoOnly[][] = [];

    for (let i = 0; i < appids.length; i++) {
      rounds[i] = [];
      for (let j = 0; j < appids[i].length; j++) {
        const gameInfo = await fetchGameInfo(appids[i][j].toString());
        if (!gameInfo) {
          throw new Error(`Could not fetch game info for ${appids[i][j]}!`);
        }
        rounds[i].push(gameInfo);
      }
    }

    await saveDaily(date, rounds);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}
