<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Video from "$lib/ui/learning-objects/content/Video.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Video lo={data.lo} />
</Context>
