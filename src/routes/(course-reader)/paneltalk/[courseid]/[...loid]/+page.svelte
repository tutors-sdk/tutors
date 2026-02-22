<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import TalkClient from "$lib/ui/learning-objects/content/TalkClient.svelte";
  import TalkAdobe from "$lib/ui/learning-objects/content/TalkAdobe.svelte";
  import { currentCourse } from "$lib/runes.svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<Context lo={data.lo}>
  {#if currentCourse.value?.defaultPdfReader === "mozilla"}
    <TalkClient lo={data.lo} />
  {:else if currentCourse.value?.defaultPdfReader === "adobe"}
    <TalkAdobe lo={data.lo} />
  {:else}
    <TalkAdobe lo={data.lo} />
  {/if}
</Context>
