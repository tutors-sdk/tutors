<script lang="ts">
  import "../app.postcss";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }
</script>

{@render children()}
