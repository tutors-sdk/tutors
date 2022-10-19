<script lang="ts">
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { CourseService } from "../../../reader-lib/services/course-service";
  import CourseNavigator from "../CourseNavigator.svelte";
  import { tocDrawer } from "../../../stores";

  let course: Course = null;
  const cache: CourseService = getContext("cache");

  let display = false;
  beforeUpdate(() => {
    course = cache.course;
    if (course) {
      display = true;
    }
  });
  const drawerClose: any = () => { tocDrawer.set(false) };
</script>

<div class="text-right mt-4 mr-4">
<button class="btn btn-square bg-primary-500" on:click={drawerClose}>X</button>
</div>
<div class="px-12 py-4">
  <CourseNavigator {course} />
</div>
