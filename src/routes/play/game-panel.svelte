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

<div class="grow h-0 break-words relative">
  <div class="bg-linear-to-r from-card-background-1 to-card-background-2 h-full flex grow gap-4">
    <div class="w-8/12 flex flex-col space-y-2 pb-2">
      <h2 class="text-3xl text-white px-4 pt-2">{game.name}</h2>
      {#key game.screenshots}
        <div class="grow h-0 bg-black">
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
        <div class="bg-black p-1 flex items-center gap-2">
          <div class="px-3 text-sm text-card-foreground">
            {game.price || 'Free'}
          </div>
          <button
            class="bg-linear-to-r from-accent-background-1 to-accent-background-2 px-4 py-1 text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:text-white hover:from-accent-background-hover-1 hover:to-accent-background-hover-2 rounded-xs"
            onclick={() => onguess(game)}>Guess!</button
          >
        </div>
      </div>
    </div>
    <div class="w-5/12 overflow-y-auto pb-2">
      {#key game.headerImage}
        <img src={game.headerImage} alt={game.name} width="460" height="215" class="w-full" />
      {/key}
      <div class="pr-4 space-y-2 mt-2">
        <p class="text-card-foreground text-sm">{@html game.description}</p>
        <div class="flex gap-4 text-xs">
          <p class="uppercase text-mute-foreground">Total reviews:</p>
          <p>{numberFormat.format(game.reviewsNegative + game.reviewsPositive)}</p>
        </div>
        <div class="flex gap-4 text-xs">
          <p class="uppercase text-mute-foreground">Release date:</p>
          <p>{game.releaseDate}</p>
        </div>
        <div>
          <div class="flex gap-4 mt-2 text-xs">
            <p class="uppercase text-mute-foreground">Developer:</p>
            <p>
              {#each game.developers as developer, i}
                <span class="text-primary-foreground">{developer}</span
                >{#if i < game.developers.length - 1}
                  ,
                {/if}
              {/each}
            </p>
          </div>
          <div class="flex gap-4 text-xs">
            <p class="uppercase text-mute-foreground">Publisher:</p>
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
          <p class="uppercase mt-2 text-mute-foreground text-xs">Genres:</p>
          <ul class="flex flex-wrap gap-1 text-xs">
            {#each game.genres as genre}
              <li class="bg-primary-background text-primary-foreground px-1.5 py-0.5 rounded-xs">
                {genre}
              </li>
            {/each}
          </ul>
        </div>
        <ul class="text-xs space-y-1">
          {#each game.categories as category}
            <li class="bg-primary-background/50 text-primary-foreground px-1.5 py-0.5">
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
        class="flex gap-6 flex-col items-center bg-linear-to-r from-card-background-1 to-card-background-2 p-8"
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
