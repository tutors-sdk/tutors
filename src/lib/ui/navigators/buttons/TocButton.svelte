<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
</script>

<button class="btn btn-sm" onclick={tocDrawerOpen} title="Open course table of contents">
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon icon="fluent:line-horizontal-3-20-filled" color="rgba(var(--color-primary-500))" height="20" />
  </span>
</button>
