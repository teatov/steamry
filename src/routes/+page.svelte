<script lang="ts">
  import { MIN_REVIEWS } from '$lib';
  import wipImage from '$lib/assets/barraconstruction.gif';
  import logoImage from '$lib/assets/logo.png';
</script>

<svelte:head>
  <title>Steamry - A daily Steam review ratio guessing game</title>
</svelte:head>

<main class="flex h-full items-center justify-center">
  <div class="w-full max-w-3xl bg-linear-to-r from-card-background-1 to-card-background-2 p-4">
    <h1 class="flex items-center justify-center gap-4 text-6xl font-bold text-white">
      <img src={logoImage} alt="" width="56" height="56" />STEAMRY
    </h1>
    <h2 class="mt-2 text-center text-card-foreground md:text-2xl">
      A daily Steam review ratio guessing game
    </h2>
    <p class="mt-6">
      Try to guess which game has a <span class="font-semibold text-primary-foreground"
        >higher percentage of positive reviews</span
      >.
    </p>
    <p class="mt-2">
      Any game can appear, <span class="font-semibold">with the exception of</span>:
    </p>
    <ul class="list-inside list-disc">
      <li>Games with less than {MIN_REVIEWS} reviews</li>
      <li>
        Games marked as having "Frequent Nudity or Sexual Content" (so straight up porn won't
        appear)
      </li>
      <li>And also games that had issues with fetching info about them</li>
    </ul>
    <p class="mt-2">
      <span class="font-semibold">All reviews are considered:</span> all time, all languages,
      including "received for free" and
      <a
        href="https://partner.steamgames.com/doc/store/reviews#ReviewBombing"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="text-card-foreground underline hover:text-white">"off-topic"</a
      >.
    </p>
    <div class="mt-6 text-center">
      <a
        href="/play"
        class="inline-block rounded-xs bg-linear-to-r from-accent-background-1 to-accent-background-2 px-8 py-2 text-xl text-accent-foreground text-shadow-[1px_1px_0px] text-shadow-black/30 hover:from-accent-background-hover-1 hover:to-accent-background-hover-2 hover:text-white"
      >
        Play
      </a>
    </div>
    <div class="mt-4 text-center">
      <a
        href="/replay"
        class="inline-block rounded-xs bg-primary-background px-4 py-1 text-primary-foreground hover:bg-primary-foreground/50 hover:text-white"
      >
        Play previous dailies
      </a>
    </div>
    <p class="mt-6">
      Inspired by <a
        href="https://scrandle.com/"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="text-card-foreground underline hover:text-white">Scrandle</a
      >. Not affiliated with Valve Corporation.
    </p>
    <p>
      Made by <a
        href="https://bsky.app/profile/teatov.xyz"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="text-card-foreground underline hover:text-white">Teatov</a
      >. Source code is available on
      <a
        href="https://github.com/teatov/steamry"
        target="_blank"
        rel="nofollow, noopener, noreferrer"
        class="text-card-foreground underline hover:text-white">GitHub</a
      >. Thanks.
    </p>
  </div>
</main>
