<script lang="ts">
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import LecturerPanel from "$lib/ui/learning-objects/content/LecturerPanel.svelte";
  import { currentCourse } from "$lib/runes.svelte";
</script>

{#snippet menuSelector()}
  <div class="hover:preset-tonal-secondary dark:hover:preset-tonal-tertiary rounded-lg p-2">
    <Icon type="lecturer" tip="Lecturer Panel" height="40" />
  </div>
{/snippet}

{#snippet sidebarContent()}
  <header class="text-center">
    <h3 class="text-surface-500 text-lg">{currentCourse?.value?.title} - Lecturer</h3>
  </header>
  <article>
    <LecturerPanel />
  </article>
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
