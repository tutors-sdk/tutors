<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import { t } from "$lib/services/i18n";
  import { sanitizeHtml } from "$lib/utils/sanitize";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="info" tip={t("nav.info.tip")} height="25" />
  </div>
{/snippet}

{#snippet sidebarContent()}
  <header class="flex justify-between">
    <h2 class="h2">{t("nav.info.title")}</h2>
  </header>
  <article>
    <div class="prose dark:prose-invert">
      {@html sanitizeHtml(currentCourse?.value?.contentHtml ?? "")}
    </div>
  </article>
{/snippet}

<div data-tour="info">
  <Sidebar {menuSelector} {sidebarContent} />
</div>
