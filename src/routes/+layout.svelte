<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { setDisplayMode } from "$lib/ui/themes/styles/icon-lib.svelte";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  onMount(() => {
    if (browser) {
      setDisplayMode(localStorage.modeCurrent);
    }
  });
</script>

{@render children()}
