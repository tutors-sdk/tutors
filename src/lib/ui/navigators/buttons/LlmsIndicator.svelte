<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
</script>

{#if currentCourse?.value?.llm === 2}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon link="/llm/{currentCourse?.value?.courseId}" type="llm" tip={"A version of this course for LLMs"} />
  </div>
{/if}
