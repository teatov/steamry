<script lang="ts">
  import { env } from '$env/dynamic/public';
  import {
    formatDate,
    getMaxScore,
    getScore,
    getTomorrowDate,
    makeSaveDataKey,
    STORE_PAGE_URL,
    type Round,
    type SaveData,
  } from '$lib';
  import DailyList from '$lib/components/daily-list.svelte';
  import IconCheck from '$lib/components/icons/icon-check.svelte';
  import IconCopy from '$lib/components/icons/icon-copy.svelte';
  import IconX from '$lib/components/icons/icon-x.svelte';
  import ResultsIndicator from './results-indicator.svelte';

  let {
    rounds,
    guesses,
    correctGuesses,
    date,
    isReplay,
    nextDailyExists,
    previousDailyExists,
    saveData,
  }: {
    rounds: Round[];
    guesses: boolean[];
    correctGuesses: number;
    date: Date;
    isReplay: boolean;
    nextDailyExists: boolean;
    previousDailyExists: boolean;
    saveData: SaveData;
  } = $props();

  async function copyResults() {
    const guessEmojis = guesses.map((value) => (value ? '🟩' : '🟥')).join('');
    const guessesTotal = `${correctGuesses}/${rounds.length}`;
    const dateIso = date.toISOString().split('T')[0];
    const resulstsText = `${guessEmojis} ${guessesTotal} | ${dateIso} | ${env.PUBLIC_ORIGIN}`;
    try {
      await navigator.clipboard.writeText(resulstsText);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<main class="flex h-full items-center justify-center">
  <div class="w-full max-w-3xl bg-linear-to-r from-card-background-1 to-card-background-2 p-4">
    <ResultsIndicator {rounds} {guesses} />
    <div class="mt-2 text-center text-4xl font-semibold text-card-foreground">
      {correctGuesses}/{rounds.length}
      <button
        title="Copy results"
        aria-label="Copy results"
        class="inline-block rounded-xs bg-primary-background p-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white active:bg-primary-background active:text-primary-foreground"
        onclick={copyResults}
      >
        <IconCopy />
      </button>
    </div>
    <ul class="mt-6 space-y-1 text-card-foreground">
      {#each rounds as round, i}
        {@const roundMaxScore = getMaxScore(round.games)}
        <li
          aria-label={guesses[i] ? 'Correct' : 'Incorrect'}
          class="flex gap-8 px-2 {guesses[i]
            ? 'bg-accent-background-1/25'
            : 'bg-danger-foreground/25'}"
        >
          {#if guesses[i]}
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
                class="truncate underline hover:text-white"
                target="_blank"
                title="Open Steam store page"
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
    {#if !isReplay}
      <div class="mt-4 text-center text-card-foreground">Next game tomorrow!</div>
    {:else}
      {@const nextDate = getTomorrowDate(date)}
      {@const previousDate = getTomorrowDate(date, -1)}
      <div class="mt-4 flex flex-col flex-wrap justify-center gap-2 md:flex-row">
        {#if previousDailyExists}
          <div class="max-w-xl md:w-0 md:grow">
            <div>Previous daily</div>
            <DailyList dailies={[{ date: previousDate }]} {saveData} />
          </div>
        {/if}
        {#if nextDailyExists}
          <div class="max-w-xl md:w-0 md:grow">
            <div>Next daily</div>
            <DailyList dailies={[{ date: nextDate }]} {saveData} />
          </div>
        {/if}
      </div>
    {/if}
    <div class="mt-4 text-center">
      <a
        href="/replay"
        class="inline-block rounded-xs bg-primary-background px-4 py-1 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
      >
        {#if !isReplay}Play previous dailies{:else}Go to previous dailies{/if}
      </a>
    </div>
    <div class="mt-6 text-right">
      <a
        href="/"
        class="inline-block rounded-xs bg-primary-background px-4 py-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
      >
        Back to home page
      </a>
    </div>
  </div>
</main>
