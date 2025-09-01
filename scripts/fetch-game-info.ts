import fetchGameInfo from '../src/lib/server/steam/fetch-game-info';

if (!process.argv[2]) {
  console.error('appid missing');
  process.exit(0);
}

const gameInfo = await fetchGameInfo(process.argv[2]);
console.log(gameInfo);

process.exit(0);
