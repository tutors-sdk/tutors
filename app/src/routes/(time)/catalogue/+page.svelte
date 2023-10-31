<script lang="ts">
  import "../../../app.postcss";
  import { onMount } from "svelte";
  import { getCourseSummary, type CourseSummary } from "$lib/services/utils/all-course-access";
  import { readVisits } from "$lib/services/utils/firebase";
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import GalleryCard from "$lib/ui/learning-objects/layout/GalleryCard.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let los: CourseSummary[] = [];
  let modules = 0;
  let totalVisits = 0;
  let subTitle = "";

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
              subTitle = `${modules} known courses`;
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

<TutorsShell {session} {supabase} title={"Tutors Module Catalogue"} {subTitle}>
  <ProgressBar label="Progress Bar" value={modules} max={230} />
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <GalleryCard {lo} />
      {/each}
    </div>
  </div>
</TutorsShell>
