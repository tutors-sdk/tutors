<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learninng-objects/Context.svelte";
  import Talk from "$lib/ui/learninng-objects/Talk.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Talk lo={data.lo} />
</Context>
