<script lang="ts">
  import { getScore } from '$lib';
  import iconVideoImage from '$lib/assets/icon-video.png';
  import reviewNegativeImage from '$lib/assets/review-negative.png';
  import reviewPositiveImage from '$lib/assets/review-positive.png';
  import type { Game } from '$lib/server/db/schema';

  let {
    game,
    isCorrect,
    reveal,
    onguess,
  }: { game: Game; isCorrect: boolean; reveal: boolean; onguess: (game: Game) => void } = $props();

  let modalElement = $state<HTMLElement>();
  let currentMediaType = $state<'trailer' | 'screenshot' | null>(null);
  let currentMediaIndex = $state<number>(0);
  let currentModalScreenshot = $state<number>(0);
  let showModal = $state<boolean>(false);

  $effect(() => {
    if (game.appid) {
      currentMediaType =
        game.trailers.length > 0 ? 'trailer' : game.screenshots.length > 0 ? 'screenshot' : null;
      currentMediaIndex = 0;
      showModal = false;
      currentModalScreenshot = 0;
    }
  });

  const numberFormat = new Intl.NumberFormat('en-US');

  function hideModal(e: KeyboardEvent) {
    if (showModal && e.key === 'Escape') {
      e.preventDefault();
      showModal = false;
    }
  }

  function changeModalScreenshot(offset: number) {
    currentModalScreenshot =
      (currentModalScreenshot + game.screenshots.length + offset) % game.screenshots.length;
  }
</script>

<div class="relative h-0 w-full grow break-words">
  <div
    class="flex h-full w-full grow gap-3 bg-linear-to-r from-card-background-1 to-card-background-2"
  >
    <div class="flex w-0 grow flex-col space-y-2 pb-2">
      {#key game.appid}
        {#if currentMediaType === 'screenshot' && game.screenshots.length > 0}
          <button
            class="block h-0 grow bg-black"
            onclick={() => {
              currentModalScreenshot = currentMediaIndex;
              showModal = true;
            }}
            >{#key currentMediaIndex}
              <img
                src={currentMediaIndex < game.screenshots.length
                  ? game.screenshots[currentMediaIndex].src
                  : ''}
                alt="Screenshot"
                width="1920"
                height="1080"
                class="h-full w-full object-contain"
              />
            {/key}
          </button>
        {/if}
        {#if currentMediaType === 'trailer' && game.trailers.length > 0}
          {@const currentTrailer = game.trailers[currentMediaIndex]}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video
            width="1920"
            height="1080"
            controls
            class=" block h-0 w-full grow bg-black object-contain"
          >
            {#if currentTrailer.webm}
              <source src={currentTrailer.webm.replace('http://', 'https://')} type="video/webm" />
            {/if}
            {#if currentTrailer.mp4}
              <source src={currentTrailer.mp4.replace('http://', 'https://')} type="video/mp4" />
            {/if}
          </video>
        {/if}
        <div class="flex overflow-x-auto">
          {#each game.trailers as trailer, i}
            <button
              class="relative shrink-0 border-2 border-foreground/0 {currentMediaType ===
                'trailer' && currentMediaIndex === i
                ? 'border-foreground/100'
                : ''}"
              onclick={() => {
                currentMediaType = 'trailer';
                currentMediaIndex = i;
              }}
            >
              <img
                src={trailer.thumbnail}
                alt="Trailer {i + 1}"
                width="1920"
                height="1080"
                class="block h-12 w-auto object-contain"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <img src={iconVideoImage} alt="" width="32" height="32" />
              </div>
            </button>
          {/each}
          {#each game.screenshots as screenshot, i}
            <button
              class="shrink-0 border-2 border-foreground/0 {currentMediaType === 'screenshot' &&
              currentMediaIndex === i
                ? 'border-foreground/100'
                : ''}"
              onclick={() => {
                currentMediaType = 'screenshot';
                currentMediaIndex = i;
              }}
            >
              <img
                src={screenshot.thumbnail}
                alt="Screenshot {i + 1}"
                width="1920"
                height="1080"
                class="block h-12 w-auto object-contain"
              />
            </button>
          {/each}
        </div>
      {/key}
      <div class="flex flex-col items-end justify-between gap-2 md:flex-row md:items-center">
        <h2 class="w-full truncate px-4 text-white md:text-xl" title={game.name}>{game.name}</h2>
        <div class="flex shrink-0 items-center gap-2 bg-black p-1">
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
    <div class="w-5/12 shrink-0 overflow-y-auto pb-2">
      {#key game.appid}
        <img src={game.headerImage} alt={game.name} width="460" height="215" class="w-full" />
      {/key}
      <div class="mt-2 space-y-2 pr-4 text-xs">
        <p class="text-card-foreground md:text-sm">{@html game.description}</p>
        <div class="flex flex-col gap-x-2 md:flex-row">
          <p class="text-mute-foreground uppercase">Total reviews:</p>
          <p>{numberFormat.format(game.reviewsNegative + game.reviewsPositive)}</p>
        </div>
        <div class="flex flex-col gap-x-2 md:flex-row">
          <p class="text-mute-foreground uppercase">Release date:</p>
          <p>{game.releaseDate}</p>
        </div>
        <div>
          <div class="mt-2 flex flex-col gap-x-2 md:flex-row">
            <p class="text-mute-foreground uppercase">Developer:</p>
            <p>
              {#each game.developers as developer, i}
                <span class="text-primary-foreground">{developer}</span
                >{#if i < game.developers.length - 1}
                  ,&nbsp;
                {/if}
              {/each}
            </p>
          </div>
          <div class="flex flex-col gap-x-2 md:flex-row">
            <p class="text-mute-foreground uppercase">Publisher:</p>
            <p>
              {#each game.publishers as publisher, i}
                <span class="text-primary-foreground">{publisher}</span
                >{#if i < game.publishers.length - 1}
                  ,&nbsp;
                {/if}
              {/each}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-x-2 md:flex-row">
          <p class="text-mute-foreground uppercase">Genre:</p>
          <p>
            {#each game.genres as genre, i}
              <span class="text-primary-foreground">{genre}</span
              >{#if i < game.genres.length - 1}
                ,&nbsp;
              {/if}
            {/each}
          </p>
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

{#if showModal}
  <div
    bind:this={modalElement}
    class="fixed inset-0 z-50 flex items-center justify-center overflow-auto overscroll-contain bg-black/75"
    onclick={(e) => {
      if (e.target === modalElement) {
        e.preventDefault();
        showModal = false;
      }
    }}
    onkeydown={hideModal}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="rounded-xs bg-linear-to-r from-modal-background-1 to-modal-background-2 p-2">
      {#key currentModalScreenshot}
        <img
          src={currentModalScreenshot < game.screenshots.length
            ? game.screenshots[currentModalScreenshot].src
            : ''}
          alt="Screenshot"
          width="1920"
          height="1080"
          class="aspect-video h-[calc(100vh-10rem)] w-full max-w-[calc(100vw-2rem)] bg-black object-contain"
        />
      {/key}
      <div class="mt-2 flex items-center justify-between">
        <button
          class="rounded-xs bg-modal-foreground px-4 py-1 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
          onclick={() => changeModalScreenshot(-1)}>Prev</button
        >
        <div class="text-sm text-card-foreground">
          {currentModalScreenshot + 1}/{game.screenshots.length}
        </div>
        <button
          class="rounded-xs bg-modal-foreground px-4 py-1 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
          onclick={() => changeModalScreenshot(1)}>Next</button
        >
      </div>
    </div>
  </div>
{/if}

<svelte:window onkeydown={hideModal} />
