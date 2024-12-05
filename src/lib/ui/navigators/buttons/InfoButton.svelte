<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Icon from "$lib/ui/components/Icon.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
</script>

{#snippet menuSelector()}
  <Icon type="info" tip="Open course info" />
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
