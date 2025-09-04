<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { type VariantProps, tv } from 'tailwind-variants';

  export const buttonVariants = tv({
    base: 'inline-block rounded-xs ',
    variants: {
      variant: {
        default:
          'bg-primary-background text-primary-foreground hover:bg-primary-foreground/50 hover:text-white active:bg-primary-background active:text-primary-foreground',
        accent:
          'bg-linear-to-r from-accent-background-1 to-accent-background-2 text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:from-accent-background-hover-1 hover:to-accent-background-hover-2 hover:text-white',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-4 py-1',
        lg: 'px-8 py-2 text-xl',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = HTMLButtonAttributes &
    HTMLAnchorAttributes & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  import { cn } from '$lib/components/ui/utils';

  let {
    class: className,
    variant = 'default',
    size = 'default',
    href = undefined,
    type = 'button',
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a class={cn(buttonVariants({ variant, size }), className)} {href} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button class={cn(buttonVariants({ variant, size }), className)} {type} {...restProps}>
    {@render children?.()}
  </button>
{/if}
