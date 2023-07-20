<script lang="ts">
  import { onMount } from "svelte";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { CardDeck } from "tutors-ui";
  import PanelDeck from "./PanelDeck.svelte";
  import UnitDeck from "./UnitDeck.svelte";
  import { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let lo: Lo;

  const units = lo.los.filter((lo) => lo.type == "unit");
  const sideBar = lo.los.filter((lo) => lo.type === "side");
  const standardLos = lo.los.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk" && lo.type !== "panelnote" && lo.type !== "side");

  let standardDeck = true;
  let pinBuffer = "";
  let ignorePin = "";

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      $currentCourse.showAllLos();
      $currentCourse.standardLos = $currentCourse.allLos;
      standardDeck = !standardDeck;
    }
  }

  onMount(async () => {
    if ($currentCourse.lo.properties.ignorepin) {
      ignorePin = $currentCourse.lo.properties.ignorepin.toString();
      window.addEventListener("keydown", keypressInput);
    }
  });
</script>

{#if sideBar.length > 0}
  <div class="block md:flex w-11/12 mx-auto">
    <div class="w-full">
      <PanelDeck lo="{lo}" />
      <UnitDeck units="{units}" />
      {#if standardDeck}
        <CardDeck los="{standardLos}" border />
      {:else}
        <CardDeck los="{$currentCourse.allLos}" border />
      {/if}
    </div>
    <div class="block w-full md:w-[30rem] md:ml-2">
      <UnitDeck units="{sideBar}" />
    </div>
  </div>
{:else}
  <div class="w-11/12 mx-auto">
    <PanelDeck lo="{lo}" />
    <UnitDeck units="{units}" />
    {#if standardDeck}
      <CardDeck los="{standardLos}" border />
    {:else}
      <CardDeck los="{$currentCourse.allLos}" border />
    {/if}
  </div>
{/if}
