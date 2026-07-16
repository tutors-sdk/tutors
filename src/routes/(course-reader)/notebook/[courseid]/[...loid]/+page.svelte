<script lang="ts">
  import type { PageData } from "./$types";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Notebook from "$lib/ui/learning-objects/content/Notebook.svelte";
  import { hideMainNavigator } from "$lib/runes.svelte";
  import { onDestroy, onMount } from "svelte";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  onMount(() => {
    hideMainNavigator.value = true;
  });
  onDestroy(() => {
    hideMainNavigator.value = false;
  });
</script>

<Context lo={data.notebook}>
  <Notebook lo={data.notebook} />
</Context>
