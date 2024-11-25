<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Calendar from "$lib/ui/learning-objects/content/Calendar.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { Modal } from "@skeletonlabs/skeleton-svelte";

  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }
</script>

{#if currentCourse?.value?.courseCalendar?.currentWeek}
  <Modal
    bind:open={openState}
    triggerBase="btn"
    contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
    positionerJustify="justify-start"
    positionerAlign=""
    positionerPadding=""
    transitionsPositionerIn={{ x: -480, duration: 200 }}
    transitionsPositionerOut={{ x: -480, duration: 200 }}
  >
    {#snippet trigger()}
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
    {#snippet content()}
      <div class="relative">
        <button class="btn-icon absolute right-0 top-0 hover:preset-tonal" onclick={popoverClose}>
          <Icon type="close" />
        </button>
        <Calendar calendar={currentCourse.value?.courseCalendar!} />
      </div>
    {/snippet}
  </Modal>
{/if}
