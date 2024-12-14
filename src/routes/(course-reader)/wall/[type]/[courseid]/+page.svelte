<script lang="ts">
  import type { PageData } from "./$types";
  import Wall from "$lib/ui/learning-objects/layout/Wall.svelte";
  import { onDestroy } from "svelte";
  import { currentWallType } from "$lib/runes";

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  onDestroy(() => {
    currentWallType.value = "";
  });
</script>

<Wall los={data.los} type={data.type} />
