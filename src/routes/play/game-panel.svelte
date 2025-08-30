<script lang="ts">
  import { getScore } from '$lib';
  import reviewNegativeImage from '$lib/assets/review-negative.png';
  import reviewPositiveImage from '$lib/assets/review-positive.png';
  import type { Game } from '$lib/server/db/schema';

  let {
    game,
    isCorrect,
    reveal,
    onguess,
  }: { game: Game; isCorrect: boolean; reveal: boolean; onguess: (game: Game) => void } = $props();

  let currentScreenshot: string = $derived<string>(
    game.screenshots.length > 0 ? game.screenshots[0] : '',
  );

  const numberFormat = new Intl.NumberFormat('en-US');
</script>

<div class="relative h-0 grow break-words">
  <div class="flex h-full grow gap-4 bg-linear-to-r from-card-background-1 to-card-background-2">
    <div class="flex w-8/12 flex-col space-y-2 pb-2">
      <h2 class="truncate px-4 pt-2 text-white md:text-3xl" title={game.name}>{game.name}</h2>
      {#key game.screenshots}
        <div class="h-0 grow bg-black">
          <img
            src={currentScreenshot}
            alt="Screenshot"
            width="1920"
            height="1080"
            class="h-full w-full object-contain"
          />
        </div>
        <div class="flex overflow-x-auto">
          {#each game.screenshots as screenshot, i}
            <button
              class="shrink-0 border-2 border-foreground/0 {currentScreenshot === screenshot
                ? 'border-foreground/100'
                : ''}"
              onclick={() => (currentScreenshot = screenshot)}
            >
              <img
                src={screenshot}
                alt="Screenshot {i + 1}"
                width="1920"
                height="1080"
                class="block h-12 w-auto object-contain"
              />
            </button>
          {/each}
        </div>
      {/key}
      <div class="flex justify-end">
        <div class="flex items-center gap-2 bg-black p-1">
          <div class="px-3 text-sm text-card-foreground">
            {game.price || 'Free'}
          </div>
          <button
            class="rounded-xs bg-linear-to-r from-accent-background-1 to-accent-background-2 px-4 py-1 text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:from-accent-background-hover-1 hover:to-accent-background-hover-2 hover:text-white"
            onclick={() => onguess(game)}>Guess!</button
          >
        </div>
      </div>
    </div>
    <div class="w-5/12 overflow-y-auto pb-2">
      {#key game.headerImage}
        <img src={game.headerImage} alt={game.name} width="460" height="215" class="w-full" />
      {/key}
      <div class="mt-2 space-y-2 pr-4 text-xs">
        <p class="md:text-sm text-card-foreground">{@html game.description}</p>
        <div class="flex flex-col gap-x-4 md:flex-row">
          <p class="text-mute-foreground uppercase">Total reviews:</p>
          <p>{numberFormat.format(game.reviewsNegative + game.reviewsPositive)}</p>
        </div>
        <div class="flex flex-col gap-x-4 md:flex-row">
          <p class="text-mute-foreground uppercase">Release date:</p>
          <p>{game.releaseDate}</p>
        </div>
        <div>
          <div class="mt-2 flex flex-col gap-x-4 md:flex-row">
            <p class="text-mute-foreground uppercase">Developer:</p>
            <p>
              {#each game.developers as developer, i}
                <span class="text-primary-foreground">{developer}</span
                >{#if i < game.developers.length - 1}
                  ,
                {/if}
              {/each}
            </p>
          </div>
          <div class="flex flex-col gap-x-4 md:flex-row">
            <p class="text-mute-foreground uppercase">Publisher:</p>
            <p>
              {#each game.publishers as publisher, i}
                <span class="text-primary-foreground">{publisher}</span
                >{#if i < game.publishers.length - 1}
                  ,
                {/if}
              {/each}
            </p>
          </div>
        </div>
        <div>
          <p class="mt-2 text-mute-foreground uppercase">Genres:</p>
          <ul class="flex flex-wrap gap-1">
            {#each game.genres as genre}
              <li class="rounded-xs bg-primary-background px-1.5 py-0.5 text-primary-foreground">
                {genre}
              </li>
            {/each}
          </ul>
        </div>
        <ul class="space-y-1">
          {#each game.categories as category}
            <li class="bg-primary-background/50 px-1.5 py-0.5 text-primary-foreground">
              {category}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  {#if reveal}
    <div class="absolute inset-0 flex items-center justify-center bg-card-background-2/50">
      <div
        class="flex flex-col items-center gap-6 bg-linear-to-r from-card-background-1 to-card-background-2 p-8"
      >
        <h3
          class="text-6xl font-semibold {isCorrect
            ? 'text-accent-background-1'
            : 'text-danger-foreground'}"
        >
          {getScore(game)}%
        </h3>
        <div class="flex gap-6 text-2xl text-white">
          <div class="flex items-center gap-2">
            <img src={reviewPositiveImage} alt="Positive" width="40" height="40" class="size-8" />
            {numberFormat.format(game.reviewsPositive)}
          </div>
          <div class="flex items-center gap-2">
            <img src={reviewNegativeImage} alt="Negative" width="40" height="40" class="size-8" />
            {numberFormat.format(game.reviewsNegative)}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
