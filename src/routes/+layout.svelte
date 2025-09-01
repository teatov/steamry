<script lang="ts">
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    Cookies.set('TZ', new Date().getTimezoneOffset().toString(), { expires: 365 });
  });
</script>

{@render children?.()}
