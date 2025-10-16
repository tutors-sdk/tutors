<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="info" tip="Open course info" height="25" />
  </div>
{/snippet}

{#snippet sidebarContent()}
  <header class="flex justify-between">
    <h2 class="h2">Course Info</h2>
  </header>
  <article>
    <prose class="prose dark:prose-invert">
      {@html currentCourse?.value?.contentHtml}
    </prose>
  </article>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
