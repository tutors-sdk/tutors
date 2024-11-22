<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import Iconify from "@iconify/svelte";
  // import { Avatar } from "@skeletonlabs/skeleton";

  interface Props {
    lo: Lo;
    miniImage?: boolean;
  }

  let { lo, miniImage = false }: Props = $props();
  let imageWidth = $state("w-36");
  let iconHeight = $state("180");

  if (miniImage) {
    imageWidth = "w-12";
    iconHeight = "48";
  }
</script>

{#if lo?.icon}
  <Iconify icon={lo?.icon.type} color={lo.icon.color} height={iconHeight} />
{:else}
  <img src={lo?.img} alt={lo?.title} class={imageWidth} />
{/if}
