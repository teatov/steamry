<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getMaxScore,
    getScore,
    makeSaveDataKey,
    SAVE_DATA,
    type ResultBody,
    type Round,
    type SaveData,
  } from '$lib';
  import type { Game } from '$lib/server/db/schema';
  import GamePanel from './game-panel/game-panel.svelte';
  import ErrorMessage from './parts/error-message.svelte';
  import ResultsIndicator from './parts/results-indicator.svelte';
  import Results from './parts/results.svelte';

  let {
    rounds,
    date,
    isReplay = false,
    nextDailyExists = false,
    previousDailyExists = false,
  }: {
    rounds: Round[];
    date: Date;
    isReplay?: boolean;
    nextDailyExists?: boolean;
    previousDailyExists?: boolean;
  } = $props();

  let saveData = $state<SaveData>({});
  const saveDataKey = makeSaveDataKey(date);

  let guesses = $state<boolean[]>([]);
  let currentRound = $state<number | null>(null);
  let reveal = $state<boolean>(false);
  let finished = $state<boolean>(false);

  let round = $derived<Round | null>(currentRound !== null ? rounds[currentRound] : null);
  let maxGameScore = $derived<number>(round ? getMaxScore(round.games) : 0);
  let correctGuesses = $derived<number>(guesses.filter((value) => value).length);

  onMount(() => {
    try {
      const saveDataString = localStorage.getItem(SAVE_DATA);
      saveData = saveDataString ? (JSON.parse(saveDataString) as SaveData) : {};
    } catch (err) {
      console.error(err);
    }

    if (saveData[saveDataKey] && !isReplay) {
      guesses = saveData[saveDataKey];
      if (guesses.length < rounds.length) {
        currentRound = guesses.length;
      } else {
        finished = true;
      }
    } else {
      currentRound = 0;
    }
  });

  function isCorrect(game: Game) {
    return getScore(game) === maxGameScore;
  }

  async function guess(game: Game) {
    if (reveal || currentRound === null) {
      return;
    }

    guesses.push(isCorrect(game));
    reveal = true;

    const canAdvance = currentRound + 1 < rounds.length;

    if (!isReplay || !canAdvance) {
      saveData[saveDataKey] = guesses;
      localStorage.setItem(SAVE_DATA, JSON.stringify(saveData));
    }

    if (!canAdvance && !isReplay) {
      const resultBody: ResultBody = { date: date.toISOString(), guesses };
      fetch('/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultBody),
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));

    reveal = false;
    if (canAdvance) {
      currentRound++;
    } else {
      finished = true;
    }
  }
</script>

{#if rounds.length === 0}
  <ErrorMessage />
{:else if !finished}
  <main class="mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-4 py-4">
    {#if round}
      <div class="flex w-full flex-col items-end gap-2 md:flex-row md:items-center">
        <ResultsIndicator {rounds} {guesses} />
        {#if isReplay}
          <a
            href="/replay"
            class="inline-block shrink-0 rounded-xs bg-primary-background px-4 py-1 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
          >
            Go to previous dailies
          </a>
        {/if}
      </div>
      {#each round.games as game}
        <GamePanel {game} isCorrect={isCorrect(game)} {reveal} onguess={guess} />
      {/each}
    {/if}
  </main>
{:else}
  <Results
    {rounds}
    {guesses}
    {correctGuesses}
    {date}
    {isReplay}
    {nextDailyExists}
    {previousDailyExists}
    {saveData}
  />
{/if}
