<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import CourseContext from "../../learning-objects/CourseContext.svelte";
  const drawerStore = getDrawerStore();
  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <CourseContext course={$currentCourse} />
</div>
