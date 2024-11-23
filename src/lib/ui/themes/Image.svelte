<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import Iconify from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { layout } from "$lib/runes";

  interface Props {
    lo: Lo;
    miniImage?: boolean;
  }

  let { lo, miniImage = false }: Props = $props();
  let imageHeight = $state("");
  let iconHeight = $state("");

  if (miniImage) {
    imageHeight = "h-10";
    iconHeight = "48";
  }

  $effect(() => {
   if (!miniImage) {
      if (layout.value === "compacted") {
        iconHeight = "90";
        imageHeight = "h-20";
      } else {
        iconHeight = "180";
        imageHeight = "h-48";
      }
    }
  });
</script>

{#if lo?.icon}
  <Iconify icon={lo?.icon.type} color={lo.icon.color} height={iconHeight} />
{:else}
  <Avatar src={lo?.img} alt={lo?.title} width={imageHeight} rounded="rounded-xl" background="none" />
{/if}
