<script lang="ts">
  import type { Lo } from "$lib/services/base";
  import Iconify from "@iconify/svelte";

  interface Props {
    lo: Lo;
    miniImage?: boolean;
  }

  let { lo, miniImage = false }: Props = $props();
  let imageHeight = $state("h-32");
  let iconHeight = $state("180");

  if (miniImage) {
    imageHeight = "h-12";
    iconHeight = "48";
  }
</script>

{#if lo?.icon}
  <Iconify icon={lo?.icon.type} color={lo.icon.color} height={iconHeight} />
{:else}
  <img src={lo?.img} alt={lo?.title} class={imageHeight} />
{/if}
