<script lang="ts">
  import { onMount } from 'svelte';
  import { SAVE_DATA, type SaveData } from '$lib';
  import DailyList from '$lib/components/daily-list.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let saveData = $state<SaveData>({});

  onMount(() => {
    try {
      const saveDataString = localStorage.getItem(SAVE_DATA);
      saveData = saveDataString ? (JSON.parse(saveDataString) as SaveData) : {};
    } catch (err) {
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Steamry - Previous dailies</title>
</svelte:head>

<Container>
  <Card size="sm">
    <div class="mb-4 flex items-start justify-between">
      <h1 class="text-xl text-card-foreground md:text-3xl">Previous dailies</h1>
      <Button href="/">Back to home page</Button>
    </div>
    <DailyList dailies={data.dailies} {saveData} />
  </Card>
</Container>
