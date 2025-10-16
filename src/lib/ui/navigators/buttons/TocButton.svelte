<script lang="ts">
  import CourseContext from "$lib/ui/learning-objects/structure/CourseContext.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="coursetree" tip="Open course tree" height="40" />
  </div>
{/snippet}

{#snippet sidebarContent()}
  <header class="text-center">
    <h3 class="text-surface-500 text-lg">{currentCourse?.value?.title} Course Tree</h3>
  </header>
  <article>
    <CourseContext />
  </article>
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
