<script lang="ts">
  import type { PageData } from "./$types";
  import Composite from "$lib/ui/learning-objects/structure/Composite.svelte";
  export let data: PageData;
</script>

<Composite composite={data.topic} />
