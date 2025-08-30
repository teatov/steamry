import getRandomGames from '../src/lib/server/steam/get-random-games';

const games = await getRandomGames();
console.log(games, games?.length);
process.exit(0);
