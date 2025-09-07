<script lang="ts">
  import type { Game } from '$lib/server/db/schema';

  let { game, numberFormat }: { game: Game; numberFormat: Intl.NumberFormat } = $props();
</script>

{#snippet infoItem(label: string, text?: string, items?: string[])}
  <div class="flex flex-col gap-x-2 md:flex-row">
    <p class="text-mute-foreground uppercase">{label}:</p>
    {#if text}
      <p>{text}</p>
    {/if}
    {#if items}
      <p>
        {#each items as item, i}
          <span class="text-primary-foreground">{item}</span>{#if i < items.length - 1}
            ,&nbsp;
          {/if}
        {/each}
      </p>
    {/if}
  </div>
{/snippet}

{#key game.appid}
  <img src={game.headerImage} alt={game.name} width="460" height="215" class="w-full" />
{/key}
<div class="mt-2 space-y-2 pr-4 text-xs">
  {#if game.isHandPicked}
    <p
      class="cursor-help text-sm font-semibold text-danger-foreground underline decoration-dashed decoration-1 underline-offset-2"
      title="This game wasn't picked randomly, and instead was added manually"
    >
      Hand-picked
    </p>
  {/if}
  <p class="text-card-foreground md:text-sm">{@html game.description}</p>
  {@render infoItem(
    'Total reviews',
    numberFormat.format(game.reviewsNegative + game.reviewsPositive),
  )}
  {#if game.releaseDate}
    {@render infoItem('Release date', game.releaseDate)}
  {/if}
  <div>
    {@render infoItem('Developer', undefined, game.developers)}
    {@render infoItem('Publisher', undefined, game.publishers)}
  </div>
  {#if game.tags && game.tags.length > 0}
    <div>
      <p class="text-mute-foreground">Popular user-defined tags for this product:</p>
      <p class="flex flex-wrap gap-0.75 text-[0.7rem]">
        {#each game.tags as tag, i}
          <span class="rounded-xs bg-primary-background px-1 py-0.25 text-primary-foreground"
            >{tag}</span
          >
        {/each}
      </p>
    </div>
  {/if}
  {@render infoItem('Genre', undefined, game.genres)}
  <ul class="flex flex-wrap gap-1 text-[0.7rem]">
    {#each game.categories as category}
      <li class="bg-primary-background/50 px-1.5 py-0.5 text-primary-foreground">
        {category}
      </li>
    {/each}
  </ul>
</div>
