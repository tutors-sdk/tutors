<script lang="ts">
  import { CardDeck } from "$lib/ui/legacy";
  import PanelDeck from "./PanelDeck.svelte";
  import UnitDeck from "./UnitDeck.svelte";
  import type { Composite } from "$lib/services/models/lo-types";

  export let composite: Composite;
</script>

<PanelDeck panels={composite.panels} />
<UnitDeck units={composite.units.units} />
<CardDeck los={composite.units.standardLos} border />
