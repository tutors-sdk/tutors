<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/Context.svelte";
  import Talk from "$lib/ui/learning-objects/Talk.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Talk lo={data.lo} />
</Context>
