<script lang="ts">
  import Icon from "$lib/ui/icons/Icon.svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const infoDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "info", position: "left" };
    drawerStore.open(settings);
  };
</script>

<button class="btn btn-sm" on:click={infoDrawerOpen} title="View course info">
  <span class="text-sm font-bold inline-flex gap-2">
    <Icon icon="fluent:info-28-regular" color="rgba(var(--color-primary-500))" height="20" />
  </span>
</button>
