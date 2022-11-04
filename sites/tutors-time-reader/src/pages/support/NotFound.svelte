<script lang="ts">
  import { onMount } from "svelte";

  export let params: Record<string, string> | null;

  onMount(() => {
    console.log(params);
  });
</script>

<h1>Not Found</h1>
