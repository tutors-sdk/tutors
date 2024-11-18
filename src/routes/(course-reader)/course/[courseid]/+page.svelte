<script lang="ts">
  import Composite from "$lib/ui/learning-objects/structure/Composite.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
</script>

<Composite composite={data.course} />
