<script lang="ts">
  import { onMount } from 'svelte';
  import { makeSaveDataKey, SAVE_DATA, type SaveData } from '$lib';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import type { NewDaily } from '$lib/server/db/schema';
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

  const months = $derived(
    data.dailies.reduce(
      (prev, curr) => {
        const year = curr.date.getFullYear();
        const month = curr.date.getMonth();
        const key = `${year}-${month}`;

        if (!prev[key]) {
          prev[key] = [];
          for (let i = 0; i < curr.date.getDay(); i++) {
            prev[key].push(null);
          }
        } else {
          const gap = curr.date.getDate() - prev[key].at(-1)!.date.getDate() - 1;
          for (let i = 0; i < gap; i++) {
            prev[key].push(null);
          }
        }

        prev[key].push(curr);

        return prev;
      },
      {} as Record<string, (NewDaily | null)[]>,
    ),
  );

  function formatMonth(key: string) {
    const [year, month] = key.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
      new Date(year, month, 1),
    );
  }
</script>

<svelte:head>
  <title>Steamry - Previous dailies</title>
</svelte:head>

<Container>
  <Card size="lg">
    <div class="mb-4 flex items-start justify-between">
      <h1 class="text-xl text-card-foreground md:text-3xl">Previous dailies</h1>
      <Button href="/">Back to home page</Button>
    </div>
    <div class="space-y-4">
      {#each Object.keys(months) as monthKey}
        {@const month = months[monthKey]}
        <div>
          <h2 class="text-xl md:text-2xl">{formatMonth(monthKey)}</h2>
          <div class="grid grid-cols-7 gap-1">
            {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as weekday}
              <div class="text-center text-sm text-mute-foreground">{weekday}</div>
            {/each}

            {#each month as daily}
              <div>
                {#if daily}
                  {@const saveDataKey = makeSaveDataKey(daily.date)}
                  <a
                    href="/replay/{saveDataKey}"
                    class="group block bg-primary-background px-1 py-1 visited:bg-mute-background hover:bg-primary-foreground/50 lg:px-2"
                  >
                    <div class="flex flex-col items-center justify-between lg:flex-row">
                      <div class="text-primary-foreground/100 group-hover:text-white">
                        {daily.date.getDate()}
                      </div>
                      {#if saveData[saveDataKey]}
                        <div
                          class="text-sm font-semibold text-card-foreground group-hover:text-white lg:text-base"
                        >
                          {saveData[saveDataKey].filter((value) => value).length}/{saveData[
                            saveDataKey
                          ].length}
                        </div>
                      {:else}
                        <div class="hidden text-card-foreground/50 lg:block">Not played</div>
                        <div class="block text-sm text-card-foreground/50 lg:hidden">N/A</div>
                      {/if}
                    </div>
                    {#if daily.description}
                      <div
                        class="text-xs break-words group-hover:text-white lg:text-sm"
                        title={daily.description}
                      >
                        {daily.description}
                      </div>
                    {/if}
                  </a>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </Card>
</Container>
