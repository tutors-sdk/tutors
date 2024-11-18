<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import { TreeViewItem } from "@skeletonlabs/skeleton";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { currentCourse } from "$lib/runes";

  export let lo: Lo;
  if (lo?.toc) {
    lo?.toc.forEach((lo) => {
      if (lo?.route.endsWith("/")) {
        lo.route = lo?.route.slice(0, -1);
      }
    });
  }
</script>

{#each lo?.toc as lo}
  <TreeViewItem open hideChildren>
    <svelte:fragment slot="lead">
      <div class="flex justify-end">
        <Icon type={lo.type} />
        <a href={lo?.route} class="ml-2">
          {@html lo.title}
        </a>
        {#if lo.video && lo.type != "panelvideo" && !currentCourse?.value?.areVideosHidden}
          <a class="pl-4" href={lo.video}>
            <Icon type="video" />
          </a>
        {/if}
      </div>
    </svelte:fragment>
    <svelte:fragment slot="children">
      {#if lo.toc}
        <svelte:self {lo} />
      {/if}
    </svelte:fragment>
  </TreeViewItem>
{/each}
