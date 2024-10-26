<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { initializeStores, storePopup } from "@skeletonlabs/skeleton";

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  if ($page.url.hash.startsWith("#/course")) {
    goto($page.url.hash.slice(2));
  }
</script>

<slot />
