import getRandomGames from '../src/lib/server/steam/get-random-games';

const games = await getRandomGames();
console.log(games);
process.exit(0);
