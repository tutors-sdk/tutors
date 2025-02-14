<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { themeService } from "$lib/services/themes/services/themes.svelte";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }

  if (browser) {
    themeService.initDisplay("tutors", "light");
  }
</script>

{@render children()}
