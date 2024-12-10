<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { themeService } from "$lib/ui/themes/theme-controller.svelte";

  import { initializeHighlighter } from "$lib/services/models/markdown-utils.svelte";

  initializeHighlighter();
  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  onMount(async () => {
    if (browser) {
      themeService.initDisplay("festive", "dark");
    }
  });
</script>

{@render children()}
