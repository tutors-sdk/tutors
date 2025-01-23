<script lang="ts">
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if currentCourse?.value?.llm === 2}
  <Icon link="/llm/{currentCourse?.value?.courseId}" type="llm" tip={"A version of this course for LLMs"} />
{/if}
