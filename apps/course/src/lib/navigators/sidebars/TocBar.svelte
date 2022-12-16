<script lang="ts">
  import CourseNavigator from "../CourseNavigator.svelte";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { drawerStore } from "@skeletonlabs/skeleton";

  const drawerClose: any = () => {
    drawerStore.close();
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click="{drawerClose}"><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <CourseNavigator course="{$currentCourse}" />
</div>
