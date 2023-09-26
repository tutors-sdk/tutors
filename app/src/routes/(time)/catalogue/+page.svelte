<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { getCourseSummary, type CourseSummary } from "$lib/services/utils/course";
  import { readVisits } from "$lib/services/utils/firebase";
  import CatalogueCourseCard from "./CatalogueCourseCard.svelte";
  export let data: PageData;

  let los: CourseSummary[] = [];
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

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    {#each los as lo}
      <CatalogueCourseCard {lo} />
    {/each}
  </div>
</div>
