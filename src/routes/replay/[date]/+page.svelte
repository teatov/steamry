<script lang="ts">
  import { formatDate } from '$lib';
  import PlayPage from '$lib/components/play-page/play-page.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Steamry - {formatDate(data.date)}</title>
</svelte:head>

{#key data.date}
  <PlayPage
    rounds={data.rounds}
    date={data.date}
    isReplay={true}
    nextDailyExists={data.nextDailyExists}
    previousDailyExists={data.previousDailyExists}
  />
{/key}
