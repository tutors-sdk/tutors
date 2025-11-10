<script lang="ts">
  import type { Panels } from "@tutors/tutors-model-lib";
  import Note from "../content/Note.svelte";
  import Talk from "../content/Talk.svelte";
  import TalkAdobe from "../content/TalkAdobe.svelte";
  import Video from "../content/Video.svelte";
  import Podcast from "../content/Podcast.svelte";

  interface Props {
    panels: Panels;
  }
  let { panels }: Props = $props();
</script>

{#each panels?.panelPodcasts as lo}
  <Podcast {lo} />
{/each}

{#each panels?.panelVideos as lo}
  <Video {lo} />
{/each}
{#each panels?.panelTalks as lo}
  <TalkAdobe {lo} />
{/each}
{#each panels?.panelNotes as lo}
  <Note {lo} />
{/each}
