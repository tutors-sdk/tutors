<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const calendarDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "calendar", position: "left" };
    drawerStore.open(settings);
  };
</script>

{#if currentCourse?.value?.courseCalendar?.currentWeek}
  <div class="hidden w-full lg:flex">
    <button class="mx-auto inline-flex rounded-lg variant-soft-primary p-2" onclick={calendarDrawerOpen}>
      <span class="my-auto pl-2 pr-4">
        <Icon tip={"View Calendar for this course"} type="calendar" />
      </span>
      <span class="divider-vertical h-12 hidden lg:flex my-auto"></span>
      <span class="px-2">
        <span class="pt-1 text-sm">Current Week</span><br />
        <span class="text-lg pb-1 font-bold">{currentCourse.value?.courseCalendar.currentWeek.title}</span>
      </span>
    </button>
  </div>
{/if}
