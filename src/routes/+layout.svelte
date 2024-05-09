<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { getKeys } from "$lib/environment";
  import { initFirebase } from "$lib/services/utils/firebase-utils";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { initializeStores, storePopup } from "@skeletonlabs/skeleton";

  initializeStores();
  const themes: any = ["tutors", "dyslexia", "halloween", "valentines"];
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  if ($page.url.hash.startsWith("#/course")) {
    goto($page.url.hash.slice(2));
  }
</script>

<slot />
