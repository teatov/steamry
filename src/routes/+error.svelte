<script lang="ts">
  import { page } from '$app/state';
</script>

<main class="flex h-full items-center justify-center">
  <div class="bg-linear-to-r from-card-background-1 to-card-background-2 p-4 text-center">
    <h1 class="text-6xl font-bold text-danger-foreground">{page.status}</h1>
    <p class="mt-2">{page.error?.message}</p>
    <p class="mt-4">
      <a
        href="/"
        class="inline-block rounded-xs bg-primary-background px-4 py-2 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
        >Go back home...</a
      >
    </p>
  </div>
</main>
