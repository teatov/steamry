import { getScore, getTimezoneDate } from '../src/lib';
import makeNewDaily from '../src/lib/server/daily/make-new-daily';

const today = getTimezoneDate(new Date().getTimezoneOffset());
const daily = await makeNewDaily(today);
console.log(
  JSON.stringify(
    daily?.rounds.map((games) => games.map((game) => ({ name: game.name, score: getScore(game) }))),
    null,
    2,
  ),
);

process.exit(0);
