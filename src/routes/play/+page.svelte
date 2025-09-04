<script lang="ts">
  import GamePage from '$lib/components/game-page/game-page.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Steamry - Daily</title>
</svelte:head>

<GamePage rounds={data.rounds} date={data.date} />
