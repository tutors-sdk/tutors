<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getKeys } from "../../../environment";
  import { page } from "$app/stores";
  import { Buffer } from 'buffer';

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

  const manifest = {"name":"Tutors Course Reader","short_name":"Tutors","id":"tutors","icons":[{"src":"https://reader.tutors.dev/icons/icon.png","sizes":"512x512","type":"image/png","purpose":"any"},{"src":"https://reader.tutors.dev/icons/icon.png","sizes":"512x512","type":"image/png","purpose":"maskable"}],"theme_color":"#37919b","background_color":"#121317","display":"standalone","start_url":$page.url};
const manifestString = Buffer.from(JSON.stringify(manifest), 'utf8').toString('base64');
</script>

<svelte:head>
  {#if manifestString}
    <link rel="manifest" href='data:application/manifest+json;base64,{manifestString}' />
    <meta name="theme-color" content="#37919b">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
  {/if}
</svelte:head>

{#each data.course.units as unit}
  <UnitCard unit="{unit}" />
{/each}
{#if standardDeck}
  <CardDeck los="{data.course.standardLos}" border />
{:else}
  <CardDeck los="{data.course.allLos}" border />
{/if}
