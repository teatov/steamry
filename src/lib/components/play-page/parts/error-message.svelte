<script lang="ts">
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
</script>

<Container>
  <Card>
    <h1 class="text-center text-xl text-danger-foreground md:text-3xl">Something happened...</h1>
    <p class="mt-6">For some strange reason today's daily is missing.</p>
    <p>
      Most likely the cronjob has been stopped and therefore new dailies don't get generated. Or
      game info fetching has failed very badly. Or a secret third thing.
    </p>
    <p class="mt-2">
      If this isn't resolved after a while then the creator has either entered a coma or deleted his
      internet account and is now living in the forest.
    </p>
  </Card>
</Container>
