<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import Sidebar from "$lib/ui/support/Sidebar.svelte";
  import CoursePresence from "../time/CoursePresence.svelte";
</script>

{#snippet menuSelector()}
  <div class="ml-2">
    View <span class="badge bg-error-500 text-white">{presenceService.studentsOnline.value.length}</span> Online
  </div>
{/snippet}
{#snippet sidebarContent()}
  <CoursePresence />
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
