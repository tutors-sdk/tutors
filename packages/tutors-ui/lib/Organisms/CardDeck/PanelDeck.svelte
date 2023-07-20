<script lang="ts">
  import { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { TalkCard, NoteCard, VideoCard } from "tutors-ui";
  export let lo: Lo;

  const panelVideos = lo.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = lo.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes = lo.los.filter((lo) => lo.type == "panelnote");
</script>

{#each panelVideos as lo}
  <VideoCard lo="{lo}" />
{/each}
{#each panelTalks as lo}
  <TalkCard lo="{lo}" />
{/each}
{#each panelNotes as lo}
  <NoteCard lo="{lo}" />
{/each}
