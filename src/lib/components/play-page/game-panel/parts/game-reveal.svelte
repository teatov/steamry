<script lang="ts">
  import { getScore } from '$lib';
  import reviewNegativeImage from '$lib/assets/review-negative.png';
  import reviewPositiveImage from '$lib/assets/review-positive.png';
  import type { Game } from '$lib/server/db/schema';

  let {
    game,
    numberFormat,
    isCorrect,
  }: { game: Game; numberFormat: Intl.NumberFormat; isCorrect: boolean } = $props();
</script>

<div class="absolute inset-0 flex items-center justify-center bg-card-background-2/50">
  <div
    class="flex flex-col items-center gap-6 bg-linear-to-r from-card-background-1 to-card-background-2 p-8"
  >
    <h3
      class="text-6xl font-semibold {isCorrect
        ? 'text-accent-background-1'
        : 'text-danger-foreground'}"
    >
      {getScore(game)}%
    </h3>
    <div class="flex gap-6 text-2xl text-white">
      <div class="flex items-center gap-2">
        <img src={reviewPositiveImage} alt="" width="40" height="40" class="size-8" />
        {numberFormat.format(game.reviewsPositive)}
      </div>
      <div class="flex items-center gap-2">
        <img src={reviewNegativeImage} alt="" width="40" height="40" class="size-8" />
        {numberFormat.format(game.reviewsNegative)}
      </div>
    </div>
  </div>
</div>
