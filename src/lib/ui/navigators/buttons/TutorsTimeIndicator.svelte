<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if currentCourse?.value?.authLevel! > 0 && tutorsConnectService?.tutorsId?.value?.share === "true"}
  <Icon
    link="https://time.tutors.dev/{currentCourse?.value?.courseId}"
    type="tutorsTime"
    tip={"This course is Tutors Time enabled"}
  />
{/if}
