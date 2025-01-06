<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import Course from "$lib/ui/time/Course.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  if (presenceService.listeningTo !== data.courseid) {
    presenceService.startPresenceListener(data.courseid);
  }
</script>

<Course />
