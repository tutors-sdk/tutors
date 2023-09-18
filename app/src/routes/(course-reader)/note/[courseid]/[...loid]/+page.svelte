<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Note from "$lib/ui/learning-objects/content/Note.svelte";
  export let data: PageData;
</script>

<Context lo={data.lo}>
  <Note lo={data.lo} />
</Context>
