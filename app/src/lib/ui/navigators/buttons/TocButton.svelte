<script lang="ts">
  import { NavigationPrimaryButton } from "$lib/components";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
</script>

<span class="divider-vertical h-10 hidden lg:block" />
<button class="btn btn-sm" on:click={tocDrawerOpen}>
  <NavigationPrimaryButton icon="fluent:line-horizontal-3-20-filled" iconColour="rgba(var(--color-primary-500))" />
</button>
