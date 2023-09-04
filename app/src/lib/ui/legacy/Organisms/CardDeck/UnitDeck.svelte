<script lang="ts">
  import { UnitCard } from "$lib/ui/legacy";
  import type {Unit} from "$lib/services/models-ng/lo-types"
  export let units: Unit[];
</script>

{#each units as unit}
  <UnitCard lo={unit} />
{/each}
