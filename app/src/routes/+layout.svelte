<script lang="ts">
  import { getKeys } from "$lib/environment";
  import { initFirebase } from "$lib/services/utils/firebase";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { initializeStores, storePopup } from "@skeletonlabs/skeleton";
  initializeStores();
  const themes: any = ["tutors", "dyslexia", "halloween", "valentines"];
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  initFirebase(getKeys().firebase);
</script>

<slot />
