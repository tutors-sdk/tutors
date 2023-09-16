<script lang="ts">
  import type { Panels } from "$lib/services/models/lo-types";
  import Note from "./Note.svelte";
  import Talk from "./Talk.svelte";
  import Video from "./Video.svelte";
  export let panels: Panels;
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
