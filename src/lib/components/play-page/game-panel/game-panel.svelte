<script lang="ts">
  import Button from '$lib/components/ui/button.svelte';
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
          <Button size="sm" variant="accent" onclick={() => onguess(game)}>Guess!</Button>
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
