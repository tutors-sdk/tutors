<script lang="ts">
  import { presenceService } from "$lib/services/community";
    import Card from "$lib/ui/learning-objects/layout/Card.svelte";
  import Course from "$lib/ui/time/Course.svelte";
  import CourseGroup from "$lib/ui/time/CourseGroup.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  if (presenceService.listeningTo !== data.courseid) {
    
    presenceService.startPresenceListener(data.courseid);
  }
</script>

  <div class="flex flex-wrap justify-center">
    {#each presenceService.studentsOnline.value as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <Card
          cardDetails={{
            route: lo?.loRoute,
            student: lo?.user,
            type: lo?.type,
            summary: lo?.title + " (" + lo?.type + ")",
  
            img: lo?.img,
            icon: lo?.icon,
          }}
          cardLayout={{
            layout: "expanded",
            style: "landscape"
          }}
        />
      {/if}
    {/each}
    </div>
<!-- <CourseGroup los={presenceService.studentsOnline.value} /> -->
