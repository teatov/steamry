import { MAX_ERROR_LENGTH } from '$lib';
import type { NewGameInfoOnly } from '../db/schema';
import { saveEventLog } from '../event-logs';
import getRandomGames from '../steam/get-random-games';
import saveDaily from './save-daily';

const ROUNDS = 10;
const GAMES_PER_ROUND = 2;

export default async function makeNewDaily(date: Date) {
  try {
    console.log(`\nMaking daily for ${date.toISOString()}`);

    const gameInfos = await getRandomGames(ROUNDS * GAMES_PER_ROUND);
    if (!gameInfos || gameInfos.length === 0) {
      throw new Error('No games!');
    }

    const rounds: NewGameInfoOnly[][] = [];

    for (let i = 0; i < gameInfos.length; i++) {
      const round = Math.floor(i / GAMES_PER_ROUND);
      if (!rounds[round]) {
        rounds[round] = [];
      }
      rounds[round].push(gameInfos[i]);
    }

    const daily = await saveDaily(date, rounds);

    await saveEventLog('make-new-daily-finished', daily);

    console.log('Finished!');
  } catch (err) {
    console.error(err);
    try {
      await saveEventLog('make-new-daily-failed', {
        message: String(err).substring(0, MAX_ERROR_LENGTH),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
