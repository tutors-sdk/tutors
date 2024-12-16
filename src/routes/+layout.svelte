<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { themeService } from "$lib/ui/themes/theme-controller.svelte";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  if (browser) {
    themeService.initDisplay();
  }
</script>

{@render children()}
