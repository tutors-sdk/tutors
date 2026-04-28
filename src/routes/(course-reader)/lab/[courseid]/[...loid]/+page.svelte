<script lang="ts">
  import type { PageData } from "./$types";
  import Lab from "$lib/ui/learning-objects/content/Lab.svelte";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import TalkClient from "$lib/ui/learning-objects/content/TalkClient.svelte";
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

{#if data.lab.lab.pdf}
  <Context lo={data.lab.lab}>
    <TalkClient lo={data.lab.lab} />
  </Context>
{:else}
  <Context lo={data.lab.lab}>
    <Lab lab={data.lab} />
  </Context>
{/if}
