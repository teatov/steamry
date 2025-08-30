<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import { getScore, makeSaveDataKey, STORE_PAGE_URL } from '$lib';
  import IconCheck from '$lib/components/icons/icon-check.svelte';
  import IconCopy from '$lib/components/icons/icon-copy.svelte';
  import IconLeft from '$lib/components/icons/icon-left.svelte';
  import IconX from '$lib/components/icons/icon-x.svelte';
  import type { Game } from '$lib/server/db/schema';
  import type { PageProps } from './$types';
  import GamePanel from './game-panel.svelte';

  type Results = boolean[];
  type SaveData = Record<string, Results>;
  const SAVE_DATA = 'save_data';

  let { data }: PageProps = $props();

  let saveData: SaveData = {};
  const saveDataKey = makeSaveDataKey(data.date);

  let results = $state<Results>([]);
  let currentRound = $state<number>(0);
  let reveal = $state<boolean>(false);
  let finished = $state<boolean>(false);

  let round = $derived(data.rounds[currentRound]);
  let maxScore = $derived<number>(getMaxScore(round.games));
  let correctGuesses = $derived<number>(results.filter((value) => value).length);

  onMount(() => {
    const saveDataString = localStorage.getItem(SAVE_DATA);
    try {
      saveData = saveDataString ? (JSON.parse(saveDataString) as SaveData) : {};
    } catch (err) {
      console.error(err);
      return;
    }
    if (saveData && saveData[saveDataKey]) {
      results = saveData[saveDataKey];
      if (results.length < data.rounds.length) {
        currentRound = results.length;
      } else {
        finished = true;
      }
    }
  });

  function isCorrect(game: Game) {
    return getScore(game) === maxScore;
  }

  function getMaxScore(games: Game[]) {
    return getScore(
      games.reduce(function (prev, current) {
        return prev && getScore(prev) > getScore(current) ? prev : current;
      }),
    );
  }

  async function guess(game: Game) {
    if (reveal) {
      return;
    }

    results.push(isCorrect(game));
    reveal = true;

    if (!saveData) {
      saveData = {};
    }
    saveData[saveDataKey] = results;
    localStorage.setItem(SAVE_DATA, JSON.stringify(saveData));

    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));

    reveal = false;
    if (currentRound + 1 < data.rounds.length) {
      currentRound++;
    } else {
      finished = true;
    }
  }

  async function copyResults() {
    try {
      const guesses = results.map((value) => (value ? '🟩' : '🟥')).join('');
      const guessesAmount = `${correctGuesses}/${data.rounds.length}`;
      const date = data.date.toISOString().split('T')[0];
      const resulstsText = `${guesses} ${guessesAmount} | ${date} | ${env.PUBLIC_ORIGIN}`;
      await navigator.clipboard.writeText(resulstsText);
    } catch (err) {
      console.error(err);
    }
  }
</script>

{#snippet resultsIndicator()}
  <ul class="flex justify-stretch gap-2">
    {#each data.rounds as round, i}
      <div
        aria-label={i < results.length ? (results[i] ? 'Correct' : 'Incorrect') : 'No guess'}
        class="flex h-6 w-full items-center justify-center rounded text-white {i < results.length
          ? results[i]
            ? 'bg-accent-background-1'
            : 'bg-danger-foreground'
          : 'bg-card-background-2'}"
      >
        {#if i < results.length}
          {#if results[i]}
            <IconCheck />
          {:else}
            <IconX />
          {/if}
        {/if}
      </div>
    {/each}
  </ul>
{/snippet}

{#if !finished}
  <main class="mx-auto flex h-full max-w-5xl flex-col gap-4 py-4">
    {@render resultsIndicator()}
    {#each round.games as game}
      <GamePanel {game} isCorrect={isCorrect(game)} {reveal} onguess={guess} />
    {/each}
  </main>
{:else}
  <main class="flex h-full items-center justify-center">
    <div class="w-full max-w-3xl bg-linear-to-r from-card-background-1 to-card-background-2 p-4">
      {@render resultsIndicator()}
      <div class="mt-2 text-center text-4xl text-card-foreground">
        {correctGuesses}/{data.rounds.length}
        <button
          title="Copy results"
          aria-label="Copy results"
          class="inline-block rounded bg-primary-background p-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white active:bg-primary-background active:text-primary-foreground"
          onclick={copyResults}
        >
          <IconCopy />
        </button>
      </div>
      <ul class="mt-6 space-y-1 text-card-foreground">
        {#each data.rounds as round, i}
          {@const roundMaxScore = getMaxScore(round.games)}
          <li
            aria-label={results[i] ? 'Correct' : 'Incorrect'}
            class="flex gap-8 px-2 {results[i]
              ? 'bg-accent-background-1/25'
              : 'bg-danger-foreground/25'}"
          >
            {#if results[i]}
              <IconCheck />
            {:else}
              <IconX />
            {/if}
            {#each round.games as game}
              {@const score = getScore(game)}
              <div class="flex w-0 grow justify-between gap-2">
                <a
                  href={`${STORE_PAGE_URL}/${game.appid}`}
                  rel="nofollow, noopener, noreferrer"
                  class="truncate hover:underline"
                  title="Open Steam page"
                >
                  {game.name}
                </a>
                <div
                  class="font-semibold {score === roundMaxScore
                    ? 'text-accent-background-1'
                    : 'text-danger-foreground'}"
                >
                  {score}%
                </div>
              </div>
            {/each}
          </li>
        {/each}
      </ul>
      <div class="mt-6 text-right">
        <a
          href="/"
          class="inline-block rounded-sm bg-primary-background py-2 pr-4 pl-3 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
        >
          <IconLeft />
          Back to home page
        </a>
      </div>
    </div>
  </main>
{/if}
