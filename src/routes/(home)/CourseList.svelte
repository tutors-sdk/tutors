<script lang="ts">
  import { tutorsConnectService, type CourseVisit } from "$lib/services/connect";
  import { onMount } from "svelte";
  import CourseVisitCard from "./CourseVisitCard.svelte";

  let courseVisits: CourseVisit[] = $state([]);
  onMount(async () => {
    courseVisits = await tutorsConnectService.getCourseVisits();
  });

  function deleteCourse(id: string) {
    tutorsConnectService.deleteCourseVisit(id);
    courseVisits = courseVisits.filter((c) => c.id !== id);
  }

  async function starUnstarCourse(id: string) {
    const course = courseVisits.find((c) => c.id === id);
    if (course) {
      if (course.favourite) {
        await tutorsConnectService.unfavouriteCourse(course.id);
      } else {
        await tutorsConnectService.favouriteCourse(course.id);
      }
    }
    courseVisits = await tutorsConnectService.getCourseVisits();
  }
</script>

<div class="container card mx-auto my-1 p-4">
  <p class="p-4 text-2xl">Favourites</p>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#each courseVisits.filter((cv) => cv.favourite) as courseVisit (courseVisit.id)}
      <CourseVisitCard {courseVisit} {deleteCourse} {starUnstarCourse} />
    {/each}
  </div>

  <p class="p-4 text-2xl">Recently accessed</p>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#each courseVisits.filter((cv) => !cv.favourite) as courseVisit (courseVisit.id)}
      <CourseVisitCard {courseVisit} {deleteCourse} {starUnstarCourse} />
    {/each}
  </div>
</div>
