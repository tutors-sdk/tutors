<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/Context.svelte";
  import Video from "$lib/ui/learning-objects/Video.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Video lo={data.lo} />
</Context>
