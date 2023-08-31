<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  import ThemeBuilder from "../../themebuilder/ThemeBuilder.svelte";

  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}
    ><span class="font-bold">X</span></button
  >
</div>
<div class="px-12 py-4">
  <ThemeBuilder />
</div>
