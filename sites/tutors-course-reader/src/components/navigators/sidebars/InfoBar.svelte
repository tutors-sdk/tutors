<script lang="ts">
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { CourseService } from "../../../reader-lib/services/course-service";
  import { infoDrawer } from "../../../stores";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";

  let course: Course = null;
  const cache: CourseService = getContext("cache");
  let courseInfo = "";
  let display = false;
  beforeUpdate(() => {
    course = cache.course;
    if (course) {
      display = true;
      courseInfo = convertMd(course.lo.contentMd, null);
    }
  });

  const drawerClose: any = () => { infoDrawer.set(false) };
</script>

<div class="text-right mt-4 mr-4">
<button class="btn btn-square bg-primary-500" on:click={drawerClose}>X</button>
</div>
<div class="px-12 py-4">
<prose class="prose dark:prose-invert">
{@html courseInfo}
</prose>
</div>