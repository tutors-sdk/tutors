<script lang="ts">
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy } from "svelte";
  import Iconify from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton";

  export let lo: Lo;
  export let miniImage = false;
  let imageHeight = "";
  let iconHeight = "";
  let colourPrefix = "";

  function isColour(string: string) {
    return true;
    // var s = new Option().style;
    // s.color = string;
    // return s.color.length > 0;
  }

  if (lo && !lo.icon && lo.frontMatter && lo.frontMatter.icon) {
    lo.icon = {
      type: lo.frontMatter.icon["type"],
      color: lo.frontMatter.icon["color"]
    };
  }

  if (lo.icon) {
    if (!isColour(lo.icon.color)) {
      colourPrefix = "#";
    }
  }

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

{#if lo.icon}
  <Iconify icon="{lo.icon.type}" color="{colourPrefix}{lo.icon.color}" height="{iconHeight}" />
{:else}
  <Avatar src="{lo.img}" alt="{lo.title}" width="{imageHeight}" rounded="rounded-xl" background="none" />
{/if}
