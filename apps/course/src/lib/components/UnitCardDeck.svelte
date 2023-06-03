<script lang="ts">
  import { VideoCard, TalkCard, NoteCard } from "tutors-ui";
  import CardDeck from "./CardDeck.svelte";
  import Iconify from "@iconify/svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy } from "svelte";
  export let unit: Lo;
  const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes = unit.los.filter((lo) => lo.type == "panelnote");
  const standardLos = unit.los.filter((lo) => lo.type != "panelvideo" && lo.type != "paneltalk" && lo.type != "panelnote");

  if ($currentCourse.lo && !$currentCourse.lo.icon && $currentCourse.lo.frontMatter && $currentCourse.lo.frontMatter.icon) {
    $currentCourse.lo.icon = {
        type: $currentCourse.lo.frontMatter.icon["type"],
        color: $currentCourse.lo.frontMatter.icon["color"]
      };
    }

  let compact = false;

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      compact = true
    } else {
      compact = false
    }
  });
  onDestroy(unsubscribe);
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl p-4 border-[1px] border-surface-200-700-token">
  <div class="flex w-full justify-between pb-2">
    <h3 id="{unit.id}" class="p-2">
      {unit.title}
    </h3>
    {#if $currentCourse.lo.icon}
      <Iconify icon={$currentCourse.lo.icon.type} color="{$currentCourse.lo.icon.color}" class="w-8 h-8" />
    {:else}
      <img src={$currentCourse.lo.img} class="max-w-8 max-h-8 rounded-md" />
    {/if}
  </div>
  <div class="flex flex-wrap justify-center">
    {#each panelVideos as lo}
      <VideoCard lo="{lo}" />
    {/each}
    {#each panelTalks as lo}
      <TalkCard lo="{lo}" />
    {/each}
    {#each panelNotes as lo}
      <NoteCard lo="{lo}" />
    {/each}
    <CardDeck los="{standardLos}" />
  </div>
</div>
