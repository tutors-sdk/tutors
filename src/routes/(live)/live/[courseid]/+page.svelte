<script lang="ts">
  import { presenceService } from "$lib/services/community";
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

<CourseGroup los={presenceService.studentsOnline.value} />
