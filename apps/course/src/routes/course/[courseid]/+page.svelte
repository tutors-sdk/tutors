<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { getKeys } from "../../../environment";
  import { page } from "$app/stores";

  export let data: PageData;

  let standardDeck = true;
  let pinBuffer = "";
  let ignorePin = "";

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      data.course.showAllLos();
      data.course.standardLos = data.course.allLos;
      standardDeck = false;
    }
  }

  onMount(async () => {
    if (getKeys().firebase.apiKey !== "XXX") {
      initFirebase(getKeys().firebase);
      authService.setCredentials(getKeys().auth0);
      authService.checkAuth(data.course);
      if (data.course.lo.properties.ignorepin) {
        ignorePin = data.course.lo.properties.ignorepin.toString();
        window.addEventListener("keydown", keypressInput);
      }
    }
  });
</script>

{#if data.course.sideBar.length > 0}
  <div class="block md:flex w-11/12 mx-auto">
    <div class="w-full">
      {#each data.course.units as unit}
        <UnitCard unit="{unit}" />
      {/each}
    </div>
    <div class="block w-full md:w-[30rem] md:ml-2">
      {#each data.course.sideBar as unit}
        <UnitCard unit="{unit}" />
      {/each}
    </div>
  </div>
{:else}
  <div class="w-11/12 mx-auto">
    {#each data.course.units as unit}
      <UnitCard unit="{unit}" />
    {/each}
    {#if standardDeck}
      <CardDeck los="{data.course.standardLos}" border />
    {:else}
      <CardDeck los="{data.course.allLos}" border />
    {/if}
  </div>
{/if}
