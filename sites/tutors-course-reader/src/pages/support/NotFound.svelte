<script lang="ts">
  import { onMount } from "svelte";

  export let params: any = {};

  onMount(async () => {
    console.log(params);
  });
</script>

<h1>Not Found</h1>
