<script lang="ts">
  import type { PageProps } from './$types';
  import GamePanel from './game-panel.svelte';

  let { data }: PageProps = $props();

  const round = data.rounds[0];
</script>

<main class="h-full flex flex-col p-4 gap-4">
  {#each round.games as game}
    <GamePanel {game} />
  {/each}
</main>
