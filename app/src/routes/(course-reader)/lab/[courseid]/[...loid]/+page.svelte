<script lang="ts">
  import type { PageData } from "./$types";
  import Lab from "$lib/ui/learning-objects/content/Lab.svelte";
  export let data: PageData;
</script>

<Lab lab={data.lab} />
