<script lang="ts">
  import { formatDate, makeSaveDataKey, type Round, type SaveData } from '$lib';
  import type { NewDaily } from '$lib/server/db/schema';

  let { dailies, saveData }: { dailies: NewDaily[]; saveData: SaveData } = $props();
</script>

<ul class="space-y-1">
  {#each dailies as daily}
    {@const saveDataKey = makeSaveDataKey(daily.date)}
    <li>
      <a
        href="/replay/{saveDataKey}"
        class="group flex justify-between gap-3 bg-primary-background px-4 py-1 visited:bg-mute-background hover:bg-primary-foreground/50"
      >
        <div class="shrink-0 text-primary-foreground/100 group-hover:text-white">
          {formatDate(daily.date)}
        </div>
        {#if daily.description}
          <div class="grow truncate group-hover:text-white" title={daily.description}>
            {daily.description}
          </div>
        {/if}
        {#if saveData[saveDataKey]}
          <div class="shrink-0 font-semibold text-card-foreground group-hover:text-white">
            {saveData[saveDataKey].filter((value) => value).length}/{saveData[saveDataKey].length}
          </div>
        {:else}
          <div class="text-card-foreground/50">Not played</div>
        {/if}
      </a>
    </li>
  {/each}
</ul>
