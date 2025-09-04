<script lang="ts">
  import { ensureHttps, filterMildContentDescriptors, getContentDescriptorText } from '$lib';
  import iconVideoImage from '$lib/assets/icon-video.png';
  import IconLeft from '$lib/components/icons/icon-left.svelte';
  import IconRight from '$lib/components/icons/icon-right.svelte';
  import type { Game } from '$lib/server/db/schema';

  type MediaListItem = {
    screenshot?: Game['screenshots'][number];
    trailer?: Game['trailers'][number];
    index: number;
  };

  const TRAILERS_IN_FRONT = 2;

  let { game }: { game: Game } = $props();

  let mediaList = $state<MediaListItem[]>([]);
  let currentMediaIndex = $state<number>(0);

  let currentMedia = $derived<MediaListItem>(mediaList[currentMediaIndex]);

  let modalElement = $state<HTMLElement>();
  let currentModalScreenshot = $state<number>(0);
  let showModal = $state<boolean>(false);
  let showNsfwBlur = $state<boolean>(false);

  $effect(() => {
    if (game.appid) {
      mediaList = [
        ...makeTrailerList(game.trailers.slice(0, TRAILERS_IN_FRONT)),
        ...makeScreenshotList(game.screenshots),
        ...makeTrailerList(game.trailers.slice(TRAILERS_IN_FRONT, game.trailers.length)),
      ];
      currentMediaIndex = 0;
      currentModalScreenshot = 0;
      showModal = false;
      showNsfwBlur =
        game.markedAsNsfw || filterMildContentDescriptors(game.contentDescriptors).length > 0;
    }
  });

  $effect(() => {
    if (currentMedia) {
      document.getElementById(makeMediaButtonIndex(currentMediaIndex))?.scrollIntoView();
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

  function changeCurrentMedia(offset: number) {
    currentMediaIndex = (currentMediaIndex + mediaList.length + offset) % mediaList.length;
  }

  function makeMediaButtonIndex(index: number) {
    return `${game.appid}-${index}`;
  }

  function makeTrailerList(list: Game['trailers']) {
    return list.map((value, index) => ({ trailer: value, index }) as MediaListItem);
  }

  function makeScreenshotList(list: Game['screenshots']) {
    return list.map((value, index) => ({ screenshot: value, index }) as MediaListItem);
  }
</script>

{#key currentMediaIndex}
  {#if currentMedia && currentMedia.screenshot}
    <button
      class="block h-0 grow cursor-zoom-in bg-black"
      onclick={() => {
        currentModalScreenshot = currentMedia.index;
        showModal = true;
      }}
      >{#key currentMediaIndex}
        <img
          src={ensureHttps(currentMedia.screenshot.src)}
          alt=""
          width="1920"
          height="1080"
          class="h-full w-full object-contain"
        />
      {/key}
    </button>
  {/if}
  {#if currentMedia && currentMedia.trailer}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      width="1920"
      height="1080"
      controls
      class=" block h-0 w-full grow bg-black object-contain"
      poster={currentMedia.trailer.thumbnail}
    >
      {#if currentMedia.trailer.webm}
        <source src={ensureHttps(currentMedia.trailer.webm)} type="video/webm" />
      {/if}
      {#if currentMedia.trailer.mp4}
        <source src={ensureHttps(currentMedia.trailer.mp4)} type="video/mp4" />
      {/if}
    </video>
  {/if}
{/key}

<div class="flex">
  <button
    class="rounded-xs bg-primary-background text-primary-foreground hover:bg-primary-foreground/50 hover:text-white active:bg-primary-background active:text-primary-foreground"
    onclick={() => changeCurrentMedia(-1)}><IconLeft /></button
  >
  <div class="flex grow overflow-x-auto">
    {#each mediaList as mediaListItem, i}
      <button
        class="relative shrink-0 border-2 border-foreground/0 focus-visible:border-ring/100 focus-visible:ring-0 {mediaListItem ===
        currentMedia
          ? 'border-foreground/100'
          : ''}"
        onclick={() => {
          currentMediaIndex = i;
        }}
        id={makeMediaButtonIndex(i)}
      >
        <img
          src={ensureHttps(
            mediaListItem.screenshot
              ? mediaListItem.screenshot.thumbnail
              : (mediaListItem.trailer?.thumbnail ?? ''),
          )}
          alt=""
          width="1920"
          height="1080"
          class="block h-12 w-auto object-contain"
        />
        {#if mediaListItem.trailer}
          <div class="absolute inset-0 flex items-center justify-center">
            <img src={iconVideoImage} alt="" width="32" height="32" />
          </div>
        {/if}
      </button>
    {/each}
  </div>
  <button
    class="rounded-xs bg-primary-background text-primary-foreground hover:bg-primary-foreground/50 hover:text-white active:bg-primary-background active:text-primary-foreground"
    onclick={() => changeCurrentMedia(1)}><IconRight /></button
  >
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
          src={game.screenshots[currentModalScreenshot]
            ? ensureHttps(game.screenshots[currentModalScreenshot].src)
            : ''}
          alt=""
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
