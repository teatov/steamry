<script lang="ts">
  import { onMount } from 'svelte';
  import { SAVE_DATA, type SaveData } from '$lib';
  import DailyList from '$lib/components/daily-list.svelte';
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

<main class="flex h-full items-center justify-center">
  <div class="w-full max-w-xl bg-linear-to-r from-card-background-1 to-card-background-2 p-4">
    <div class="mb-4 flex justify-between">
      <h1 class="text-center text-xl text-card-foreground md:text-3xl">Previous dailies</h1>
      <a
        href="/"
        class="inline-block rounded-xs bg-primary-background px-4 py-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
      >
        Back to home page
      </a>
    </div>
    <DailyList dailies={data.dailies} {saveData} />
  </div>
</main>
