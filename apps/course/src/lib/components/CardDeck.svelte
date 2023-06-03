<script lang="ts">
  import { NewCard, CardHeader, CardImage, CardFooter } from "tutors-ui";
  import { getIcon } from "tutors-ui/lib/Legacy/Atoms/Icon/themes";
  import { layout } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy } from "svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let los: Lo[] = [];
  export let border: boolean = false;
  let orderedLos = los.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = los.filter((lo) => !lo?.frontMatter?.order);
  orderedLos.sort((a, b) => Number(a.frontMatter?.order) - Number(b.frontMatter?.order));
  let bordered = "border-[1px] border-surface-200-700-token";
  let unbordered = "";
  let compact = false;

  for (let lo of orderedLos) {
    if (lo && !lo.icon && lo.frontMatter && lo.frontMatter.icon) {
      lo.icon = {
        type: lo.frontMatter.icon["type"],
        color: lo.frontMatter.icon["color"]
      };
    }
  }
  for (let lo of unOrderedLos) {
    if (lo && !lo.icon && lo.frontMatter && lo.frontMatter.icon) {
      lo.icon = {
        type: lo.frontMatter.icon["type"],
        color: lo.frontMatter.icon["color"]
      };
    }
  }

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      compact = true
    } else {
      compact = false
    }
  });

  onDestroy(unsubscribe);
</script>

{#if los.length}
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 {border ? bordered : unbordered}">
    <div class="flex flex-wrap justify-center">
      {#each orderedLos as lo}
        <NewCard href={lo.route} type={getIcon(lo.type).colour} compact={compact}>
          <CardHeader title={lo.title} type={lo.type} video={lo.video} />
          {#if lo.icon}
            <CardImage icon={lo.icon.type} iconColor={lo.icon.color} />
          {:else}
            <CardImage image="{lo.img}" />
          {/if}
          <CardFooter summary={lo.summary} />
        </NewCard>
      {/each}
      {#each unOrderedLos as lo}
      <NewCard href={lo.route} type={getIcon(lo.type).colour} compact={compact}>
        <CardHeader title={lo.title} type={lo.type} video={lo.video} />
        {#if lo.icon}
          <CardImage icon={lo.icon.type} iconColor={lo.icon.color} />
        {:else}
          <CardImage image="{lo.img}" />
        {/if}
        <CardFooter summary={lo.summary} />
      </NewCard>
      {/each}
    </div>
  </div>
{/if}
