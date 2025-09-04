<script lang="ts">
  import type { Game } from '$lib/server/db/schema';
  import GameInfo from './parts/game-info.svelte';
  import GameMedia from './parts/game-media.svelte';
  import GameReveal from './parts/game-reveal.svelte';

  let {
    game,
    isCorrect,
    reveal,
    onguess,
  }: { game: Game; isCorrect: boolean; reveal: boolean; onguess: (game: Game) => void } = $props();

  const numberFormat = new Intl.NumberFormat('en-US');
</script>

<div class="relative h-0 w-full grow break-words">
  <div
    class="flex h-full w-full grow gap-3 bg-linear-to-r from-card-background-1 to-card-background-2"
  >
    <div class="flex w-0 grow flex-col space-y-2 pb-2">
      <div class="relative flex grow flex-col space-y-2">
        {#key game.appid}
          <GameMedia {game} />
        {/key}
      </div>
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
      <GameInfo {game} {numberFormat} />
    </div>
  </div>
  {#if reveal}
    <GameReveal {game} {numberFormat} {isCorrect} />
  {/if}
</div>
