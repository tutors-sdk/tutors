<script lang="ts">
  import type { Lo } from "$lib/types/lo";
  import { TalkCard, NoteCard, VideoCard } from "$lib/ui/legacy";
  export let lo: Lo;

  const panelVideos = lo.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = lo.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes = lo.los.filter((lo) => lo.type == "panelnote");
</script>

{#each panelVideos as lo}
  <VideoCard {lo} />
{/each}
{#each panelTalks as lo}
  <TalkCard {lo} />
{/each}
{#each panelNotes as lo}
  <NoteCard {lo} />
{/each}
