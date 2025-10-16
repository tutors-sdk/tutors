<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Note from "$lib/ui/learning-objects/content/Note.svelte";
  import Talk from "$lib/ui/learning-objects/content/Talk.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import TalkAdobe from "$lib/ui/learning-objects/content/TalkAdobe.svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<Context lo={data.lo}>
  <Note lo={data.lo} />

  {#if data.lo.pdf}
    {#if currentCourse.value?.defaultPdfReader === "mozilla"}
      <Talk lo={data.lo} />
    {:else if currentCourse.value?.defaultPdfReader === "adobe"}
      <TalkAdobe lo={data.lo} orientation="portrait" />
    {:else}
      <TalkAdobe lo={data.lo} orientation="portrait" />
    {/if}
  {/if}
</Context>
