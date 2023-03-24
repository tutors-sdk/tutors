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

<div class="w-11/12 mx-auto">
  {#if browser}
    {#each data.course.units as unit}
      <UnitCard unit="{unit}" />
    {/each}
    {#if standardDeck}
      <CardDeck los="{data.course.standardLos}" border />
    {:else}
      <CardDeck los="{data.course.allLos}" border />
    {/if}
  {:else}
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 flex h-[440px] border-[1px] border-surface-200-700-token">
    <ProgressRadial stroke="{100}" meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20" class="mt-12 mx-auto" />
  </div>
  {/if}
</div>
