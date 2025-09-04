<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/components/ui/utils';

  let { class: className, children, ...restProps }: HTMLAttributes<HTMLElement> = $props();
</script>

<main {...restProps} class={cn('flex h-full items-center justify-center flex-col', className)}>
  {@render children?.()}
</main>
