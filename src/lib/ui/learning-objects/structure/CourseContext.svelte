<script lang="ts">
  import { type Course } from "$lib/services/models/lo-types";
  import LoContext from "./LoContext.svelte";
  import { TreeView, TreeViewItem } from "@skeletonlabs/skeleton";

  export let course: Course;
</script>

<TreeView padding="p-1">
  {#each course.los as lo}
    {#if !lo.hide}
      <TreeViewItem>
        {lo.title}
        <svelte:fragment slot="children">
          <LoContext {lo} />
        </svelte:fragment>
      </TreeViewItem>
    {/if}
  {/each}
</TreeView>
