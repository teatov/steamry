<script lang="ts">
  import { onMount } from 'svelte';
  import { formatDate, makeSaveDataKey, SAVE_DATA, type SaveData } from '$lib';
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
    <div class="flex justify-between">
      <h1 class="text-center text-xl text-card-foreground md:text-3xl">Previous dailies</h1>
      <a
        href="/"
        class="inline-block rounded-xs bg-primary-background px-4 py-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
      >
        Back to home page
      </a>
    </div>
    <ul class="mt-4 space-y-1">
      {#each data.dailies as daily}
        {@const saveDataKey = makeSaveDataKey(daily.date)}
        <li>
          <a
            href="/replay/{saveDataKey}"
            class="group flex justify-between bg-primary-background px-4 py-1 visited:bg-mute-background hover:bg-primary-foreground/50"
          >
            <div class="text-primary-foreground/100 group-hover:text-white">
              {formatDate(daily.date)}
            </div>
            {#if saveData[saveDataKey] && saveData[saveDataKey].length === daily.roundsTotal}
              <div class="text-card-foreground group-hover:text-white">
                {saveData[saveDataKey].filter((value) => value).length}/{daily.roundsTotal}
              </div>
            {:else}
              <div class="text-card-foreground/50">Not played</div>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</main>
