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
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import Link from '$lib/components/ui/link.svelte';
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

<Container>
  <Card>
    <ResultsIndicator {rounds} {guesses} />
    <div class="mt-2 text-center text-4xl font-semibold text-card-foreground">
      {correctGuesses}/{rounds.length}
      <Button title="Copy results" aria-label="Copy results" size="icon" onclick={copyResults}>
        <IconCopy />
      </Button>
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
              <Link
                href={`${STORE_PAGE_URL}/${game.appid}`}
                class="truncate"
                title="Open Steam store page"
              >
                {game.name}
              </Link>
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
      <Button href="/replay" size="sm">
        {#if !isReplay}Play previous dailies{:else}Back to previous dailies{/if}
      </Button>
    </div>
    <div class="mt-6 text-right">
      <Button href="/">Back to home page</Button>
    </div>
  </Card>
</Container>
