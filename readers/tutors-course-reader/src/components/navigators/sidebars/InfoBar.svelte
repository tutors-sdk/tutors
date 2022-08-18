<script lang="ts">
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { CourseService } from "../../../reader-lib/services/course-service";
  import { revealInfoBar } from "../../../stores";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";
  import SidebarComponent from "./SidebarComponent.svelte";

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
</script>

{#if $revealInfoBar && display}
  <SidebarComponent title="Course Information" show={revealInfoBar} origin="left-0" direction={-1000}>
    <div class="prose">
      {@html courseInfo}
    </div>
  </SidebarComponent>
{/if}
