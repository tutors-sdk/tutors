<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    params: Record<string, string> | null;
  }
  let { params }: Props = $props();

  onMount(() => {
    console.log(params);
  });
</script>

<h1>Not Found</h1>
