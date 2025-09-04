import type { NewGameInfoOnly } from '../db/schema';
import fetchGameInfo from '../steam/fetch-game-info';
import saveDaily from './save-daily';

export default async function handpickDaily(date: Date, appids: number[], gamesPerRound: number) {
  try {
    console.log(`\nHand picking daily for ${date.toISOString()}`);

    const gameInfos: NewGameInfoOnly[] = [];

    for (let i = 0; i < appids.length; i++) {
      const gameInfo = await fetchGameInfo(appids[i].toString());
      if (!gameInfo) {
        throw new Error(`Could not fetch game info for ${appids[i]}!`);
      }
      gameInfos.push(gameInfo);
    }

    await saveDaily(date, gameInfos, gamesPerRound);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}
