<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';
  import { type VariantProps, tv } from 'tailwind-variants';

  export const cardVariants = tv({
    base: 'bg-linear-to-r from-card-background-1 to-card-background-2 p-4',
    variants: {
      size: {
        default: 'max-w-3xl w-full',
        sm: 'max-w-xl w-full',
        auto: 'w-auto',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  });

  export type CardSize = VariantProps<typeof cardVariants>['size'];

  export type CardProps = HTMLAttributes<HTMLDivElement> & {
    size?: CardSize;
  };
</script>

<script lang="ts">
  import { cn } from '$lib/components/ui/utils';

  let { class: className, size = 'default', children, ...restProps }: CardProps = $props();
</script>

<div {...restProps} class={cn(cardVariants({ size }), className)}>
  {@render children?.()}
</div>
