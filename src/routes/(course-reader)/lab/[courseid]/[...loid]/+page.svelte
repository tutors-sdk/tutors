<script lang="ts">
  import type { PageData } from "./$types";
  import Lab from "$lib/ui/learning-objects/content/Lab.svelte";
  import Context from "$lib/ui/learning-objects/structure/Context.svelte";
  import Talk from "$lib/ui/learning-objects/content/Talk.svelte";
  export let data: PageData;
</script>

{#if data.lab.lab.pdf}
  <Context lo={data.lab.lab}>
    <Talk lo={data.lab.lab} />
  </Context>
{:else}
  <Context lo={data.lab.lab}>
    <Lab lab={data.lab} />
  </Context>
{/if}
