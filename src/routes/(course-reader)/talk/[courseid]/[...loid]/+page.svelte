<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Talk from "$lib/ui/learning-objects/content/Talk.svelte";
  import TalkAdobe from "$lib/ui/learning-objects/content/TalkAdobe.svelte";
  import { courseService } from "$lib/services/course/services/course.svelte";
  import { currentCourse } from "$lib/runes.svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<Context lo={data.lo}>
  {#if currentCourse.value?.defaultPdfReader === "mozilla"}
    <Talk lo={data.lo} />
  {:else if currentCourse.value?.defaultPdfReader === "adobe"}
    <TalkAdobe lo={data.lo} />
  {:else}
    <TalkAdobe lo={data.lo} />
  {/if}
</Context>
