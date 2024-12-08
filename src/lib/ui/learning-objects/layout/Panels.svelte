<script lang="ts">
  import type { Panels } from "$lib/services/models/lo-types";
  import Note from "../content/Note.svelte";
  import Talk from "../content/Talk.svelte";
  import TalkAdobe from "../content/TalkAdobe.svelte";
  import Video from "../content/Video.svelte";

  interface Props {
    panels: Panels;
  }
  let { panels }: Props = $props();
</script>

{#each panels?.panelVideos as lo}
  <Video {lo} />
{/each}
{#each panels?.panelTalks as lo}
  <Talk {lo} />
{/each}
{#each panels?.panelNotes as lo}
  <Note {lo} />
{/each}
