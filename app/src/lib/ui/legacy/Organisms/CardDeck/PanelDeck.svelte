<script lang="ts">
  import type { Panels } from "$lib/services/models-ng/lo-types";
  import { TalkCard, NoteCard, VideoCard } from "$lib/ui/legacy";
  export let panels: Panels
</script>

{#each panels.panelVideos as lo}
  <VideoCard {lo} />
{/each}
{#each panels.panelTalks as lo}
  <TalkCard {lo} />
{/each}
{#each panels.panelNotes as lo}
  <NoteCard {lo} />
{/each}
