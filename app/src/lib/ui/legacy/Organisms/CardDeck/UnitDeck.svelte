<script lang="ts">
  import { UnitCard } from "$lib/ui/legacy";
  import type { Unit, Lo } from "$lib/services/models/lo-types";
  export let units: Unit[];
</script>

{#each units as unit}
  <UnitCard {unit} />
{/each}
