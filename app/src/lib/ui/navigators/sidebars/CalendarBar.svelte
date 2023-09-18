<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import Calendar from "$lib/ui/learning-objects/content/Calendar.svelte";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();

  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <Calendar calendar={$currentCourse.courseCalendar} />
</div>
