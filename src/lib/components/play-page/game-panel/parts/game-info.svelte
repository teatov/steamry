<script lang="ts">
  import type { Game } from '$lib/server/db/schema';

  let { game, numberFormat }: { game: Game; numberFormat: Intl.NumberFormat } = $props();
</script>

{#key game.appid}
  <img src={game.headerImage} alt={game.name} width="460" height="215" class="w-full" />
{/key}
<div class="mt-2 space-y-2 pr-4 text-xs">
  {#if game.isHandPicked}
    <p
      class="text-sm font-semibold text-danger-foreground underline decoration-dashed cursor-help"
      title="This game wasn't picked randomly, and instead was added manually"
    >
      Hand-picked
    </p>
  {/if}
  <p class="text-card-foreground md:text-sm">{@html game.description}</p>
  <div class="flex flex-col gap-x-2 md:flex-row">
    <p class="text-mute-foreground uppercase">Total reviews:</p>
    <p>{numberFormat.format(game.reviewsNegative + game.reviewsPositive)}</p>
  </div>
  <div class="flex flex-col gap-x-2 md:flex-row">
    <p class="text-mute-foreground uppercase">Release date:</p>
    <p>{game.releaseDate}</p>
  </div>
  <div>
    <div class="mt-2 flex flex-col gap-x-2 md:flex-row">
      <p class="text-mute-foreground uppercase">Developer:</p>
      <p>
        {#each game.developers as developer, i}
          <span class="text-primary-foreground">{developer}</span
          >{#if i < game.developers.length - 1}
            ,&nbsp;
          {/if}
        {/each}
      </p>
    </div>
    <div class="flex flex-col gap-x-2 md:flex-row">
      <p class="text-mute-foreground uppercase">Publisher:</p>
      <p>
        {#each game.publishers as publisher, i}
          <span class="text-primary-foreground">{publisher}</span
          >{#if i < game.publishers.length - 1}
            ,&nbsp;
          {/if}
        {/each}
      </p>
    </div>
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
  <div class="flex flex-col gap-x-2 md:flex-row">
    <p class="text-mute-foreground uppercase">Genre:</p>
    <p>
      {#each game.genres as genre, i}
        <span class="text-primary-foreground">{genre}</span>{#if i < game.genres.length - 1}
          ,&nbsp;
        {/if}
      {/each}
    </p>
  </div>
  <ul class="space-y-1 text-[0.7rem]">
    {#each game.categories as category}
      <li class="bg-primary-background/50 px-1.5 py-0.5 text-primary-foreground">
        {category}
      </li>
    {/each}
  </ul>
</div>
