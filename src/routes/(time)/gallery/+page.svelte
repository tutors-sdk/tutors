<script lang="ts">
  import "../../../app.postcss";
  import { onMount } from "svelte";
  import { getCourseSummary, type CourseSummary } from "$lib/services/utils/all-course-access";
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import GalleryCard from "$lib/ui/learning-objects/layout/GalleryCard.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let los: CourseSummary[] = [];
  let modules = 0;
  let subTitle = "";

  onMount(async () => {
    if (data.allCourses) {
      data.allCourses.forEach(async (courseId: string) => {
        try {
          const courseSummary = await getCourseSummary(courseId);
          if (!courseSummary.isPrivate) {
            modules++;
            subTitle = `Showcasing ${modules} modules`;
            los.push(courseSummary);
            if (modules === data.allCourses.length) {
              los.sort((lo1: CourseSummary, lo2: CourseSummary) => lo1.title.localeCompare(lo2.title));
            }
            los = [...los];
          }
        } catch (error: any) {
          modules--;
          console.log(`invalid course ${courseId} : ${error.message}`);
        }
      });
    }
  });
</script>

<TutorsShell {session} {supabase} title={"Tutors Module Gallery"} {subTitle}>
  {#if modules < data.allCourses.length}
    <ProgressBar label="Progress Bar" value={modules} max={data.allCourses.length} />
  {/if}
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <GalleryCard {lo} />
      {/each}
    </div>
  </div>
</TutorsShell>
