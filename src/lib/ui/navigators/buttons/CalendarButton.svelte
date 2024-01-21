<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import Icon from "$lib/ui/icons/Icon.svelte";
  import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const calendarDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "calendar", position: "left" };
    drawerStore.open(settings);
  };
</script>

{#if $currentCourse?.courseCalendar?.currentWeek}
  <div class="hidden w-full lg:flex">
    <button class="mx-auto inline-flex rounded-lg variant-soft-primary p-2" on:click={calendarDrawerOpen}>
      <span class="my-auto pl-2 pr-4">
        <Icon tip={"View Calendar for this course"} icon="fluent:calendar-ltr-12-regular" color="rgba(var(--color-primary-500))" height="20" />
      </span>
      <span class="divider-vertical h-12 hidden lg:flex my-auto" />
      <span class="px-2">
        <span class="pt-1 text-sm">Current Week</span><br />
        <span class="text-lg pb-1 font-bold">{$currentCourse.courseCalendar.currentWeek.title}</span>
      </span>
    </button>
  </div>
{/if}
