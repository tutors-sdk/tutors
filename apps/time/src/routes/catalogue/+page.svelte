<script lang="ts">
  import { onMount } from "svelte";
  import { CourseCardDeck } from "tutors-ui";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import { getCourseSummary, type CourseSummary } from "tutors-reader-lib/src/utils/course-utils";
  import type { PageData } from "./$types";
  import { readVisits } from "tutors-reader-lib/src/utils/firebase-utils";
  export let data: PageData;

  let los: CourseSummary[] = [];
  let tickerTape = "";
  let modules = 0;
  let totalVisits = 0;

  onMount(async () => {
    if (data.allCourses) {
      data.allCourses.forEach(async (courseId) => {
        try {
          const visits = await readVisits(courseId);
          if (visits) {
            totalVisits += visits;
            const courseSummary = await getCourseSummary(courseId);
            if (!courseSummary.isPrivate) {
              modules++;
              tickerTape = `${courseSummary.title}`;
              los.push(courseSummary);
              los = [...los];
              los.sort((lo1: CourseSummary, lo2: CourseSummary) => lo1.title.localeCompare(lo2.title));
            }
          }
        } catch (error: any) {
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
  <NavBar title="Tutors Module Ecosystem" subTitle="{tickerTape}" modules="{modules}" visits="{totalVisits}" />
</div>
<CourseCardDeck los="{los}" />
