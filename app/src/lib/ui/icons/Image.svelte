<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import { layout } from "$lib/stores";
  import { onDestroy } from "svelte";
  import Iconify from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton";

  export let lo: Lo;
  export let miniImage = false;
  let imageHeight = "";
  let iconHeight = "";

  if (miniImage) {
    imageHeight = "h-10";
    iconHeight = "48";
  }
  const unsubscribe = layout.subscribe((layout) => {
    if (!miniImage) {
      if (layout === "compacted") {
        iconHeight = "90";
        imageHeight = "h-20";
      } else {
        iconHeight = "180";
        imageHeight = "h-48";
      }
    }
  });
  onDestroy(unsubscribe);
</script>

{#if lo?.icon}
  <Iconify icon={lo?.icon.type} color={lo.icon.color} height={iconHeight} />
{:else}
  <Avatar src={lo?.img} alt={lo?.title} width={imageHeight} rounded="rounded-xl" background="none" />
{/if}
