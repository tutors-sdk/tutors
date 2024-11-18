<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import type { Snippet } from "svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();

  const drawerStore = getDrawerStore();
  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" onclick={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  {@render children()}
</div>
