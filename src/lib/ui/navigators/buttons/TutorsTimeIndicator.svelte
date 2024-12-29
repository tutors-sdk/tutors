<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { courseService } from "$lib/services/course.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if courseService.currentCourse?.value?.authLevel! > 0 && tutorsConnectService?.tutorsId?.value?.share === "true"}
  <Icon
    link="https://time.tutors.dev/{courseService.currentCourse?.value?.courseId}"
    type="tutorsTime"
    tip={"This course is Tutors Time enabled"}
  />
{/if}
