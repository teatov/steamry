<script lang="ts">
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import { TZ_COOKIE } from '$lib';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    Cookies.set(TZ_COOKIE, new Date().getTimezoneOffset().toString(), {
      expires: 365,
      sameSite: 'strict',
      secure: true,
    });
  });
</script>

{@render children?.()}
