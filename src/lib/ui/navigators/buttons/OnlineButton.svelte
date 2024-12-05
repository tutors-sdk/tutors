<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import Sidebar from "$lib/ui/components/Sidebar.svelte";
  import Card from "$lib/ui/themes/card/Card.svelte";
</script>

{#snippet menuSelector()}
  <div class="ml-2">
    View <span class="badge bg-error-500 text-white">{presenceService.studentsOnline.value.length}</span> Online
  </div>
{/snippet}
{#snippet sidebarContent()}
  <div class="flex flex-wrap justify-center">
    {#each presenceService.studentsOnline.value as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <Card
          cardDetails={{
            route: lo?.loRoute,
            student: lo?.user,
            type: lo?.type,
            subtitle1: lo?.courseTitle,
            title: lo?.courseTitle,
            subtitle2: lo?.title + " (" + lo?.type + ")",
            img: lo?.img,
            icon: lo?.icon
          }}
        />
      {/if}
    {/each}
  </div>
{/snippet}

<Sidebar position="right" {menuSelector} {sidebarContent} />
