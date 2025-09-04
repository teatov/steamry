<script lang="ts">
  import { ensureHttps, filterMildContentDescriptors, getContentDescriptorText } from '$lib';
  import iconVideoImage from '$lib/assets/icon-video.png';
  import type { Game } from '$lib/server/db/schema';

  const TRAILERS_IN_FRONT = 2;

  let { game }: { game: Game } = $props();

  let modalElement = $state<HTMLElement>();
  let currentMediaType = $state<'trailer' | 'screenshot' | null>(null);
  let currentMediaIndex = $state<number>(0);
  let currentModalScreenshot = $state<number>(0);
  let showModal = $state<boolean>(false);
  let showNsfwBlur = $state<boolean>(false);

  $effect(() => {
    if (game.appid) {
      currentMediaType =
        game.trailers.length > 0 ? 'trailer' : game.screenshots.length > 0 ? 'screenshot' : null;
      currentMediaIndex = 0;
      showModal = false;
      currentModalScreenshot = 0;
      showNsfwBlur =
        game.markedAsNsfw || filterMildContentDescriptors(game.contentDescriptors).length > 0;
    }
  });

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

  {#key currentMediaIndex}
    {#if currentMediaType === 'screenshot' && game.screenshots.length > 0}
      <button
        class="block h-0 grow cursor-zoom-in bg-black"
        onclick={() => {
          currentModalScreenshot = currentMediaIndex;
          showModal = true;
        }}
        >{#key currentMediaIndex}
          <img
            src={currentMediaIndex < game.screenshots.length
              ? ensureHttps(game.screenshots[currentMediaIndex].src)
              : ''}
            alt="Screenshot {currentMediaIndex + 1}"
            width="1920"
            height="1080"
            class="h-full w-full object-contain"
          />
        {/key}
      </button>
    {/if}
    {#if currentMediaType === 'trailer' && game.trailers.length > 0}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        width="1920"
        height="1080"
        controls
        class=" block h-0 w-full grow bg-black object-contain"
        poster={game.trailers[currentMediaIndex].thumbnail}
      >
        {#if game.trailers[currentMediaIndex].webm}
          <source src={ensureHttps(game.trailers[currentMediaIndex].webm!)} type="video/webm" />
        {/if}
        {#if game.trailers[currentMediaIndex].mp4}
          <source src={ensureHttps(game.trailers[currentMediaIndex].mp4!)} type="video/mp4" />
        {/if}
      </video>
    {/if}
  {/key}
  <div class="flex overflow-x-auto">
    {#each game.trailers.slice(0, TRAILERS_IN_FRONT) as trailer, i}
      <button
        class="relative shrink-0 border-2 border-foreground/0 {currentMediaType === 'trailer' &&
        currentMediaIndex === i
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
          src={ensureHttps(screenshot.thumbnail)}
          alt="Screenshot {i + 1}"
          width="1920"
          height="1080"
          class="block h-12 w-auto object-contain"
        />
      </button>
    {/each}
    {#each game.trailers.slice(TRAILERS_IN_FRONT, game.trailers.length) as trailer, i}
      <button
        class="relative shrink-0 border-2 border-foreground/0 {currentMediaType === 'trailer' &&
        currentMediaIndex === i
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
  </div>
{#if showNsfwBlur}
  <button
    class="absolute inset-0 flex flex-col items-center justify-center bg-card-background-2/50 text-card-foreground backdrop-blur-lg"
    onclick={() => (showNsfwBlur = false)}
  >
    {#if game.contentDescriptors.length > 0}
      <p>This game is marked as having:</p>
      <ul class="list-inside list-disc text-left">
        {#each game.contentDescriptors as descriptor}
          <li>{getContentDescriptorText(descriptor)}</li>
        {/each}
      </ul>
    {:else}
      <p>This game is marked as Not Safe For Work.</p>
    {/if}
    <p class="pt-4 font-semibold">Click to remove blur</p>
  </button>
{/if}

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
            ? ensureHttps(game.screenshots[currentModalScreenshot].src)
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
          {currentModalScreenshot + 1} of {game.screenshots.length} screenshots
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
