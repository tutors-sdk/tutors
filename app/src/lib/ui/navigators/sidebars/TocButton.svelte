<script lang="ts">
  import Icon from "@iconify/svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
</script>

<button class="btn btn-sm" on:click={tocDrawerOpen}>
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon icon="fluent:line-horizontal-3-20-filled" color="rgba(var(--color-primary-500))" height="20" />
  </span>
</button>
