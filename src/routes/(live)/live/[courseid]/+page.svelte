<script lang="ts">
  import { presenceService } from "$lib/services/community";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  if (presenceService.listeningTo !== data.courseid) {
    presenceService.startPresenceListener(data.courseid);
  }
</script>

  <div class="flex flex-wrap justify-center">
    <CourseGroupHeader course={presenceService.studentsOnline.value[0]!} />
    {#each presenceService.studentsOnline.value as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <StudentCard
          {lo}
          cardLayout={{
            layout: "expanded",
            style: "landscape",
          }}
        />
      {/if}
    {/each}
    </div>

