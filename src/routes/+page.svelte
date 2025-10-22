<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { MIN_REVIEWS } from '$lib';
  import logoImage from '$lib/assets/logo.png';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import Container from '$lib/components/ui/container.svelte';
  import Link from '$lib/components/ui/link.svelte';

  const DESCRIPTION = 'A daily Steam review ratio guessing game';
  const OG_IMAGE = `${env.PUBLIC_ORIGIN}/og-image.png`;
</script>

<svelte:head>
  <title>Steamry - {DESCRIPTION}</title>

  <meta property="og:type" content="website" />
  <meta property="og:url" content="{env.PUBLIC_ORIGIN}/" />
  <meta property="og:title" content="Steamry" />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:logo" content="{env.PUBLIC_ORIGIN}/logo.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="{env.PUBLIC_ORIGIN}/" />
  <meta name="twitter:title" content="Steamry" />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<Container>
  <Card>
    <h1 class="flex items-center justify-center gap-4 text-6xl font-bold text-white uppercase">
      <img src={logoImage} alt="Steamry logo" width="56" height="56" />Steamry
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
      Any game can appear, <span class="font-semibold">with the exception of:</span>
    </p>
    <ul class="list-inside list-disc">
      <li>Games with less than {MIN_REVIEWS} reviews</li>
      <li>Games marked as having "Frequent Nudity or Sexual Content"</li>
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
