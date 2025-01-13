<script lang="ts">
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if currentCourse?.value?.llms}
  <Icon link="/llms/{currentCourse?.value?.courseId}" type="llms" tip={"A version of this course for LLMs"} />
{/if}
