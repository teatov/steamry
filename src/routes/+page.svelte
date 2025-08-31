<script lang="ts">
  import logoImage from '$lib/assets/logo.png';
</script>

<main class="flex h-full items-center justify-center">
  <div class="w-full max-w-3xl bg-linear-to-r from-card-background-1 to-card-background-2 p-4">
    <h1 class="flex items-center justify-center gap-4 text-6xl font-bold text-white">
      <img src={logoImage} alt="Steamry logo" class="inline -mb-2" />STEAMRY
    </h1>
    <h2 class="mt-2 text-center text-card-foreground md:text-3xl">
      The daily Steam review ratio guessing game
    </h2>
    <p class="mt-6">
      Try to guess which game has a <strong>higher percentage of positive reviews</strong>.
    </p>
    <p class="mt-2">Any game can appear, with the exception of:</p>
    <ul class="list-inside list-disc">
      <li>Games with zero reviews</li>
      <li>
        Games marked as having "Frequent Nudity or Sexual Content" (so straight up porn won't
        appear)
      </li>
      <li>And also games that have issues fetching info about them</li>
    </ul>
    <div class="mt-6 text-center">
      <a
        href="/play"
        class="inline-block rounded-xs bg-linear-to-r from-accent-background-1 to-accent-background-2 px-8 py-2 text-xl text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:from-accent-background-hover-1 hover:to-accent-background-hover-2 hover:text-white"
      >
        Play
      </a>
    </div>
    <p class="mt-6">
      Inspired by <a
        href="https://scrandle.com/"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="font-semibold text-card-foreground hover:underline">Scrandle</a
      >. Not affiliated with Valve Corporation.
    </p>
    <p>
      Source code is available on
      <a
        href="https://github.com/teatov/steamry"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="font-semibold text-card-foreground hover:underline">GitHub</a
      >. Thanks.
    </p>
  </div>
</main>
