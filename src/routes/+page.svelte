<script lang="ts">
  import { MIN_REVIEWS } from '$lib';
  import logoImage from '$lib/assets/logo.png';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import Link from '$lib/components/ui/link.svelte';
</script>

<svelte:head>
  <title>Steamry - A daily Steam review ratio guessing game</title>
</svelte:head>

<Container>
  <Card>
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
      <Link href="https://partner.steamgames.com/doc/store/reviews#ReviewBombing">"off-topic"</Link
      >.
    </p>
    <div class="mt-6 text-center">
      <Button href="/play" variant="accent" size="lg">Play</Button>
    </div>
    <div class="mt-4 text-center">
      <Button href="/replay" size="sm">Play previous dailies</Button>
    </div>
    <p class="mt-6">
      Inspired by <Link href="https://scrandle.com/">Scrandle</Link>. Not affiliated with Valve
      Corporation.
    </p>
    <p>
      Made by <Link href="https://bsky.app/profile/teatov.xyz">Teatov</Link>. Source code is
      available on
      <Link href="https://github.com/teatov/steamry">GitHub</Link>. Thanks.
    </p>
  </Card>
</Container>
