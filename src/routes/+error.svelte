<script lang="ts">
  import { page } from '$app/state';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
</script>

<Container>
  <Card class="text-center" size="auto">
    <h1 class="text-6xl font-bold text-danger-foreground">{page.status}</h1>
    <p class="mt-2">{page.error?.message}</p>
    <p class="mt-4">
      <Button href="/">Go back home...</Button>
    </p>
  </Card>
</Container>
