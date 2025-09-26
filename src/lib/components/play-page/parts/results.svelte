<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import {
    formatDate,
    getMaxScore,
    getScore,
    guessesToString,
    makeSaveDataKey,
    STORE_PAGE_URL,
    type Round,
    type SaveData,
  } from '$lib';
  import IconCheck from '$lib/components/icons/icon-check.svelte';
  import IconCopy from '$lib/components/icons/icon-copy.svelte';
  import IconX from '$lib/components/icons/icon-x.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import Link from '$lib/components/ui/link.svelte';
  import type { NewDaily } from '$lib/server/db/schema';
  import ResultsIndicator from './results-indicator.svelte';

  let {
    rounds,
    guesses,
    correctGuesses,
    date,
    isReplay,
    nextDaily,
    previousDaily,
    saveData,
  }: {
    rounds: Round[];
    guesses: boolean[];
    correctGuesses: number;
    date: Date;
    isReplay: boolean;
    nextDaily?: NewDaily;
    previousDaily?: NewDaily;
    saveData: SaveData;
  } = $props();

  let results = $state<null | { average: number; rounds: number[] }>(null);

  onMount(async () => {
    const response = await fetch('/get-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: date.toISOString() }),
    });

    if (response.ok) {
      results = await response.json();
    } else {
      console.error(`Results ${response.status} ${response.statusText}`);
    }
  });

  async function copyResults() {
    const guessEmojis = guessesToString(guesses);
    const guessesTotal = `${correctGuesses}/${rounds.length}`;
    const dateIso = date.toISOString().split('T')[0];
    const resulstsText = `${guessEmojis} ${guessesTotal} | Steamry ${dateIso} | ${env.PUBLIC_ORIGIN}`;
    try {
      await navigator.clipboard.writeText(resulstsText);
    } catch (err) {
      console.error(err);
    }
  }
</script>

{#snippet dailyButton(daily: NewDaily)}
  {@const saveDataKey = makeSaveDataKey(daily.date)}
  <a
    href="/replay/{saveDataKey}"
    class="group flex justify-between gap-3 bg-primary-background px-4 py-1 visited:bg-mute-background hover:bg-primary-foreground/50"
  >
    <div class="shrink-0 text-primary-foreground/100 group-hover:text-white">
      {formatDate(daily.date)}
    </div>
    {#if daily.description}
      <div class="grow break-words group-hover:text-white" title={daily.description}>
        {daily.description}
      </div>
    {/if}
    {#if saveData[saveDataKey]}
      <div class="shrink-0 font-semibold text-card-foreground group-hover:text-white">
        {saveData[saveDataKey].filter((value) => value).length}/{saveData[saveDataKey].length}
      </div>
    {:else}
      <div class="shrink-0 text-card-foreground/50">Not played</div>
    {/if}
  </a>
{/snippet}

<Container>
  <Card>
    <ResultsIndicator {rounds} {guesses} />
    <div class="mt-2 text-center text-card-foreground">{formatDate(date)}</div>
    <div class="text-center text-4xl font-semibold text-card-foreground">
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
          class="flex gap-4 px-2 {guesses[i]
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
            <div class="flex w-0 grow justify-between">
              <Link
                href={`${STORE_PAGE_URL}/${game.appid}`}
                class="truncate"
                title="Open Steam store page"
              >
                {game.name}
              </Link>
              <div
                class="cursor-help font-semibold underline decoration-dashed decoration-1 underline-offset-2 {score ===
                roundMaxScore
                  ? 'text-accent-background-1'
                  : 'text-danger-foreground'}"
                title="Positive: {game.reviewsPositive}; Negative: {game.reviewsNegative}"
              >
                {score}%
              </div>
            </div>
          {/each}
        </li>
      {/each}
    </ul>

    <div class="mt-6">
      <div class="text-center text-xl">
        Today's average: <span class="font-semibold text-card-foreground">
          {#if results}
            {Math.round(results.average * 100) / 100}/{rounds.length}
          {:else}
            N/A
          {/if}
        </span>
      </div>
      <div class="text-center">Average guess distribution:</div>
      <div class="mx-auto flex h-26 max-w-sm items-stretch justify-stretch gap-2">
        {#if results}
          {#each results.rounds as correctRatio, index}
            {@const correctPercentage = Math.round(correctRatio * 100)}
            <div
              class="flex w-full cursor-help flex-col gap-2 text-center text-[0.6rem]"
              title="{index + 1}. Correct: {correctPercentage}%; Incorrect: {100 -
                correctPercentage}%"
            >
              {#if correctPercentage < 100}
                <div
                  class="rounded-xs bg-danger-foreground/75"
                  style="height: {100 - correctPercentage}%;"
                ></div>
              {/if}
              {#if correctPercentage > 0}
                <div
                  class="rounded-xs bg-accent-background-1/75"
                  style="height: {correctPercentage}%;"
                ></div>
              {/if}
              <div>{correctPercentage}%</div>
            </div>
          {/each}
        {:else}
          <div class="w-full text-center">N/A</div>
        {/if}
      </div>
    </div>

    {#if !isReplay}
      <div class="mt-4 text-center text-card-foreground">Next game tomorrow!</div>
    {:else}
      <div class="mt-4 flex flex-col flex-wrap justify-center gap-2 md:flex-row">
        {#if previousDaily}
          <div class="md:w-0 md:grow">
            <div class="text-left">Previous daily</div>
            {@render dailyButton(previousDaily)}
          </div>
        {/if}
        {#if nextDaily}
          <div class="md:w-0 md:grow">
            <div class="text-right">Next daily</div>
            {@render dailyButton(nextDaily)}
          </div>
        {/if}
      </div>
    {/if}

    <div class="mt-2 text-center">
      <Button href="/replay" size="sm">
        {#if !isReplay}Play previous dailies{:else}Back to previous dailies{/if}
      </Button>
    </div>
    <div class="mt-6 text-right">
      <Button href="/">Back to home page</Button>
    </div>
  </Card>
</Container>
