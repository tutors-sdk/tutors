<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Note from "$lib/ui/learning-objects/content/Note.svelte";
  import TalkClient from "$lib/ui/learning-objects/content/TalkClient.svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<Context lo={data.lo}>
  <Note lo={data.lo} />

  {#if data.lo.pdf}
    <TalkClient lo={data.lo} orientation="portrait" />
  {/if}
</Context>
