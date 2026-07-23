<script lang="ts">
  import ProgrammeView from "$lib/ui/programme/ProgrammeView.svelte";
  import type { Programme } from "$lib/services/programme";

  interface Props {
    data: { programme: Programme };
  }
  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{data.programme.title}</title>
</svelte:head>

<ProgrammeView programme={data.programme} />
