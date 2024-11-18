<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import type { CourseVisit } from "$lib/services/types.svelte";
  import Iconify from "@iconify/svelte";
  import { onMount } from "svelte";

  let courseVisits: CourseVisit[] = $state([]);
  onMount(async () => {
    courseVisits = await tutorsConnectService.getCourseVisits();
  });

  function deleteCourse(id: string) {
    tutorsConnectService.deleteCourseVisit(id);
    courseVisits = courseVisits.filter((c) => c.id !== id);
  }
</script>

<div class="card container mx-auto my-4 p-8">
  <p class="pb-4 text-2xl">Your previously accessed courses</p>
  <div class="mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    {#each courseVisits as courseVisit}
      <div class="card card-hover m-2 !bg-surface-50 dark:!bg-surface-700">
        <div class="flex justify-between">
          <section class="p-4">
            <p class="line-clamp-1 font-bold">{courseVisit.title}</p>
            <p class="line-clamp-1">{courseVisit.credits}</p>
            <p class="line-clamp-1">
              Last Accessed: {courseVisit.lastVisit?.slice(0, 10)}
              {courseVisit.lastVisit.slice(11, 19)}
            </p>
            <p>Visits: {courseVisit.visits}</p>
          </section>
          <section class="content-center">
            {#if courseVisit.icon}
              <Iconify icon={courseVisit.icon.type} color={courseVisit.icon.color} height="96" />
            {:else}
              <img class="h-20" src={courseVisit.image} alt={courseVisit.title} />
            {/if}
          </section>
        </div>
        <footer class="card-footer p-0">
          <div class="flex w-full">
            <a
              class="variant-filled-primary btn m-0 w-2/3 rounded-t-none rounded-br-none"
              href={"/course/" + courseVisit.id}>Visit Course</a
            >
            <button
              class="variant-filled-error btn m-0 w-1/3 rounded-t-none rounded-bl-none"
              onclick={() => deleteCourse(courseVisit.id)}>Delete</button
            >
          </div>
        </footer>
      </div>
    {/each}
  </div>
</div>
