<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learninng-objects/Context.svelte";
  import Note from "$lib/ui/learninng-objects/Note.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Note lo={data.lo} />
</Context>
