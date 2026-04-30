<script lang="ts">
  import { presenceService } from "$lib/services/community";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import StudentCard from "$lib/ui/time/StudentCard.svelte";
</script>

{#snippet menuSelector()}
  <div class="ml-6">
    View <span class="badge bg-error-500 text-white">{presenceService.studentsOnline.value.length}</span> Online
  </div>
{/snippet}
{#snippet sidebarContent()}
  <div class="flex flex-wrap justify-center">
    {#each presenceService.studentsOnline.value as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <StudentCard 
          cardDetails={{
            route: lo?.loRoute,
            student: lo?.user!,
            type: lo?.type,
            summary: lo?.courseTitle,
            summaryEx: lo?.title + " (" + lo?.type + ")",
            img: lo?.img,
            icon: lo?.icon,
          }}
          cardLayout={{
            layout: "compacted",
            style: "landscape"
          }}
        />
      {/if}
    {/each}
  </div>
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
