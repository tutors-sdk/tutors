<script lang="ts">
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if currentCourse?.value?.authLevel! > 0 && tutorsId?.value?.share === "true"}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon link="https://time.tutors.dev/{currentCourse?.value?.courseId}" type="tutorsTime" tip={"This course is Tutors Time enabled"} />
  </div>
{/if}
