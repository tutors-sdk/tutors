<script lang="ts">
  import { courseService } from "$lib/services/course.svelte";
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
      {@html courseService.currentCourse?.value?.contentHtml}
    </prose>
  </article>
{/snippet}

<Sidebar {menuSelector} {sidebarContent} />
