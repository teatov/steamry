<script lang="ts">
  import PlayPage from '$lib/components/play-page/play-page.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Steamry - Daily</title>
</svelte:head>

<PlayPage rounds={data.rounds} date={data.date} />
