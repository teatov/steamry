<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { cn } from '$lib/components/ui/utils';

  let { class: className, children, href, ...restProps }: HTMLAnchorAttributes = $props();
</script>

<a
  {href}
  target={href?.startsWith('/') ? undefined : '_blank'}
  rel={href?.startsWith('/') ? undefined : 'noopener noreferrer'}
  {...restProps}
  class={cn('text-card-foreground underline hover:text-white', className)}>{@render children?.()}</a
>
