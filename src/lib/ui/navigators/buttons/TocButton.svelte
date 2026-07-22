<script lang="ts">
  import CourseContext from "$lib/ui/learning-objects/structure/CourseContext.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import { t } from "$lib/services/i18n";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="coursetree" tip={t("nav.toc.tip")} height="40" />
  </div>
{/snippet}

{#snippet sidebarContent()}
  <header class="text-center">
    <h3 class="text-surface-500 text-lg">{currentCourse?.value?.title} {t("nav.toc.suffix")}</h3>
  </header>
  <article>
    <CourseContext />
  </article>
{/snippet}

<div data-tour="toc">
  <Sidebar position="right" {menuSelector} {sidebarContent} />
</div>
