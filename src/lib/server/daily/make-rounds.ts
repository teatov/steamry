import { getScore } from '$lib';
import type { NewGameInfoOnly } from '../db/schema';

export default function makeRounds(
  gameInfos: NewGameInfoOnly[],
  gamesPerRound: number,
  minPercentageDiff: number,
) {
  const rounds: NewGameInfoOnly[][] = [];
  const used: NewGameInfoOnly[] = [];

  for (let i = 0; i < gameInfos.length; i++) {
    if (used.includes(gameInfos[i])) {
      continue;
    }

    const round: NewGameInfoOnly[] = [gameInfos[i]];
    for (let j = i + 1; j < gameInfos.length; j++) {
      if (used.includes(gameInfos[j])) {
        continue;
      }

      if (Math.abs(getScore(gameInfos[i]) - getScore(gameInfos[j])) >= minPercentageDiff) {
        round.push(gameInfos[j]);
      }

      if (round.length >= gamesPerRound) {
        for (let k = 0; k < round.length; k++) {
          used.push(round[k]);
        }

        rounds.push(round);
        break;
      }
    }
  }

  const unused = gameInfos.filter((value) => !used.includes(value));
  for (let i = 0; i < unused.length; i++) {
    if (used.includes(unused[i])) {
      continue;
    }

    const round: NewGameInfoOnly[] = [unused[i]];
    for (let j = i + 1; j < unused.length; j++) {
      if (used.includes(unused[j])) {
        continue;
      }

      round.push(unused[j]);
      if (round.length >= gamesPerRound) {
        for (let k = 0; k < round.length; k++) {
          used.push(round[k]);
        }

        rounds.push(round);
        break;
      }
    }
  }

  return rounds;
}
