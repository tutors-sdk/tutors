<script lang="ts">
  import { onMount } from "svelte";
  import { CourseCardDeck } from "tutors-ui";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import { getCourseSummary, type CourseSummary } from "tutors-reader-lib/src/utils/course-utils";
  import type { PageData } from "./$types";
  import { deleteObj } from "tutors-reader-lib/src/utils/firebase-utils";
  export let data: PageData;

  let los: CourseSummary[] = [];
  let tickerTape = "";
  let modules = 0;
  let visits = 0;

  onMount(async () => {
    if (data.allCourses) {
      data.allCourses.forEach(async (course) => {
        let courseId = "";
        try {
          courseId = course.courseId;
          const courseSummary = await getCourseSummary(courseId);
          courseSummary.visits = course.visits;
          courseSummary.count = course.count;
          visits += courseSummary.visits;
          if (!courseSummary.isPrivate) {
            modules++;
            tickerTape = `${courseSummary.title}`;
            los.push(courseSummary);
            los = [...los];
            los.sort((lo1: CourseSummary, lo2: CourseSummary) => lo1.title.localeCompare(lo2.title));
          }
        } catch (error: any) {
          deleteObj("all-course-access", courseId);
          console.log(`invalid course ${courseId} : ${error.message}`);
        }
      });
    }
  });
</script>

<svelte:head>
  <title>Tutors Modules</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar title="Tutors Module Ecosystem" subTitle="{tickerTape}" modules="{modules}" visits="{visits}" />
</div>
<CourseCardDeck los="{los}" />
