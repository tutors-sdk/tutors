<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const infoDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "info", position: "left" };
    drawerStore.open(settings);
  };
</script>

<button class="btn btn-sm" onclick={infoDrawerOpen} title="View course info">
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon type="info" />
  </span>
</button>
