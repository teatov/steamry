import { MAX_ERROR_LENGTH } from '$lib';
import { saveEventLog } from '../event-logs';
import getRandomGames from '../steam/get-random-games';
import makeRounds from './make-rounds';
import saveDaily from './save-daily';

const ROUNDS = 10;
const GAMES_PER_ROUND = 2;
const MIN_PERCENTAGE_DIFF = 10;

export default async function makeNewDaily(date: Date) {
  try {
    console.log(`\nMaking daily for ${date.toISOString()}`);

    const gameInfos = await getRandomGames(ROUNDS * GAMES_PER_ROUND);
    if (!gameInfos || gameInfos.length === 0) {
      throw new Error('No games!');
    }

    const rounds = makeRounds(gameInfos, GAMES_PER_ROUND, MIN_PERCENTAGE_DIFF);
    rounds.sort(() => Math.random() - 0.5);

    const daily = await saveDaily(date, rounds);

    await saveEventLog('make-new-daily-finished', daily);

    console.log('Finished!');
    return { daily: daily, rounds: rounds };
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
