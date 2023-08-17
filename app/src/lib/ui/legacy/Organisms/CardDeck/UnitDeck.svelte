<script lang="ts">
  import { UnitCard } from "$lib/ui/legacy";
  export let units: lo[];
</script>

{#each units as unit}
  <UnitCard {unit} />
{/each}
