<script lang="ts">
  import { type Round } from '$lib';
  import IconCheck from '$lib/components/icons/icon-check.svelte';
  import IconX from '$lib/components/icons/icon-x.svelte';

  let { rounds, guesses }: { rounds: Round[]; guesses: boolean[] } = $props();
</script>

<ul class="flex w-full justify-stretch gap-2">
  {#each rounds as _, i}
    <div
      aria-label={i < guesses.length ? (guesses[i] ? 'Correct' : 'Incorrect') : 'No guess'}
      class="flex h-6 w-full items-center justify-center rounded-xs text-white {i < guesses.length
        ? guesses[i]
          ? 'bg-accent-background-1'
          : 'bg-danger-foreground'
        : 'bg-card-background-2'}"
    >
      {#if i < guesses.length}
        {#if guesses[i]}
          <IconCheck />
        {:else}
          <IconX />
        {/if}
      {/if}
    </div>
  {/each}
</ul>
