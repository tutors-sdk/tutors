<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import "../app.css";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { initializeStores, storePopup } from "@skeletonlabs/skeleton";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
    children: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  if (data?.user) {
    tutorsConnectService.reconnect(data.user);
  }
</script>

{@render children()}
