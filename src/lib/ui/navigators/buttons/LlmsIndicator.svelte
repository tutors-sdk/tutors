<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#if currentCourse?.value?.llm === 2}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon link="/llm/{currentCourse?.value?.courseId}" type="llm" tip={t("nav.llms.tip")} />
  </div>
{/if}
