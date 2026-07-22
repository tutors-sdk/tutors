<script lang="ts">
  import Calendar from "$lib/ui/learning-objects/content/Calendar.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#if currentCourse?.value?.courseCalendar?.currentWeek}
  {#snippet menuSelector()}
    <div data-tour="calendar" class="hidden w-full lg:flex">
      <button class="hover:preset-tonal mx-auto inline-flex rounded-lg p-2">
        <span class="my-auto pr-4 pl-2">
          <Icon tip={t("nav.calendar.tip")} type="calendar" />
        </span>
        <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
        <span class="px-2">
          <span class="pt-1 text-sm">{t("nav.calendar.label")}</span><br />
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
