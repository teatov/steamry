<script lang="ts">
  import type { Game } from '$lib/server/db/schema';

  let { game }: { game: Game } = $props();

  let currentScreenshot: string = $state<string>(
    game.screenshots.length > 0 ? game.screenshots[0] : '',
  );
</script>

<div class="grow h-0 break-words">
  <div
    class="mx-auto max-w-5xl bg-linear-to-r from-card-background-1 to-card-background-2 h-full flex grow gap-4"
  >
    <div class="w-8/12 flex flex-col space-y-2">
      <h2 class="text-3xl text-white px-4 pt-2">{game.name}</h2>
      <div class="grow h-0 bg-black">
        <img src={currentScreenshot} alt="" class="h-full w-full object-contain" />
      </div>
      <div class="flex overflow-x-auto">
        {#each game.screenshots as screenshot}
          <button
            class="shrink-0 border-2 border-foreground/0 {currentScreenshot === screenshot
              ? 'border-foreground/100'
              : ''}"
            onclick={() => (currentScreenshot = screenshot)}
          >
            <img src={screenshot} alt="" class="block h-12 w-fit" />
          </button>
        {/each}
      </div>
      <div class="flex justify-end pb-2">
        <div class="bg-black p-1 flex items-center gap-2">
          <div class="px-3 text-sm text-card-foreground">
            {game.price || 'Free'}
          </div>
          <button
            class="bg-linear-to-r from-accent-background-1 to-accent-background-2 px-4 py-1 text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:text-white hover:from-accent-background-hover-1 hover:to-accent-background-hover-2"
            >Guess!</button
          >
        </div>
      </div>
    </div>
    <div class="w-5/12 space-y-2 overflow-y-auto pb-2">
      <img src={game.headerImage} alt={game.name} />
      <p class="text-card-foreground text-sm pr-4">{@html game.description}</p>
      <div class="flex gap-4 text-xs pr-4">
        <p class="uppercase text-mute-foreground">Release date:</p>
        <p>{game.releaseDate}</p>
      </div>
      <div class="flex gap-4 mt-2 text-xs pr-4">
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
      <div class="flex gap-4 text-xs pr-4">
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
      <p class="mt-2 text-mute-foreground text-xs pr-4">Genres:</p>
      <ul class="flex flex-wrap gap-1 text-xs pr-4">
        {#each game.genres as genre}
          <li class="bg-primary-background text-primary-foreground px-1.5 py-0.5 rounded">
            {genre}
          </li>
        {/each}
      </ul>
      <ul class="text-xs pr-4 space-y-1">
        {#each game.categories as category}
          <li class="bg-primary-background/50 text-primary-foreground px-1.5 py-0.5">
            {category}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
