<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Video from "$lib/ui/learning-objects/content/Video.svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<Context lo={data.lo}>
  <Video lo={data.lo} />
</Context>
