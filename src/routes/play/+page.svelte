<script lang="ts">
  import { getScore } from '$lib';
  import type { Game } from '$lib/server/db/schema';
  import type { PageProps } from './$types';
  import GamePanel from './game-panel.svelte';

  let { data }: PageProps = $props();

  let results = $state<boolean[]>([]);
  let currentRound = $state<number>(0);
  let reveal = $state<boolean>(false);

  let round = $derived(data.rounds[currentRound]);
  let maxScore = $derived<number>(
    getScore(
      round.games.reduce(function (prev, current) {
        return prev && getScore(prev) > getScore(current) ? prev : current;
      }),
    ),
  );

  function isCorrect(game: Game) {
    return getScore(game) === maxScore;
  }

  async function guess(game: Game) {
    if (reveal) {
      return;
    }

    results.push(isCorrect(game));
    reveal = true;

    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
    reveal = false;
    if (currentRound + 1 < data.rounds.length) {
      currentRound++;
    }
  }
</script>

<main class="h-full flex flex-col py-4 gap-4 mx-auto max-w-5xl">
  <ul class="flex justify-stretch gap-4">
    {#each data.rounds as round, i}
      <div
        class="h-6 w-full rounded {i < results.length
          ? results[i]
            ? 'bg-accent-background-1'
            : 'bg-danger-foreground'
          : 'bg-card-background-2'}"
      ></div>
    {/each}
  </ul>
  {#each round.games as game}
    <GamePanel {game} isCorrect={isCorrect(game)} {reveal} onguess={guess} />
  {/each}
</main>
