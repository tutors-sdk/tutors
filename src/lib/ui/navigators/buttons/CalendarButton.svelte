<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Calendar from "$lib/ui/learning-objects/content/Calendar.svelte";
  import Sidebar from "$lib/ui/utils/Sidebar.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

{#if currentCourse?.value?.courseCalendar?.currentWeek}
  {#snippet menuSelector()}
    <div class="hidden w-full lg:flex">
      <button class="mx-auto inline-flex rounded-lg p-2 hover:preset-tonal">
        <span class="my-auto pl-2 pr-4">
          <Icon tip={"View Calendar for this course"} type="calendar" />
        </span>
        <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
        <span class="px-2">
          <span class="pt-1 text-sm">Current Week</span><br />
          <span class="pb-1 text-lg font-bold">{currentCourse.value?.courseCalendar?.currentWeek.title}</span>
        </span>
      </button>
    </div>
  {/snippet}

  {#snippet sidebarContent()}
    <Calendar calendar={currentCourse.value?.courseCalendar!} />
  {/snippet}

  <Sidebar {menuSelector} {sidebarContent} />
{/if}
