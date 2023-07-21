<script lang="ts">
  import { UnitCard } from "tutors-ui";
  export let units: lo[];
</script>

{#each units as unit}
  <UnitCard unit="{unit}" />
{/each}
