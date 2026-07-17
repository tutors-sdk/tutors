<script lang="ts">
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#if currentCourse?.value?.authLevel! > 0 && tutorsId?.value?.share === "true"}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon link="https://time.tutors.dev/{currentCourse?.value?.courseId}" type="tutorsTime" tip={t("nav.time.tip")} />
  </div>
{/if}
