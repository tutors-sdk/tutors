<script lang="ts">
  import CourseContext from "$lib/ui/learning-objects/structure/CourseContext.svelte";
  import Sidebar from "$lib/ui/support/Sidebar.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
</script>

{#snippet menuSelector()}
  <Icon type="toc" tip="Open course Table of Contents" />
{/snippet}

{#snippet sidebarContent()}
  <header class="flex justify-between">
    <h2 class="h2">Table of Contents</h2>
  </header>
  <article>
    <CourseContext />
  </article>
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
