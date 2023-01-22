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

  const manifest = {
  name: "Tutors Course Reader",
  short_name: "Tutors",
  id: "tutors",
  "icons": [
       {
        "src": "/icons/icon-48x48.png",
        "sizes": "48x48",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-152x152.png",
        "sizes": "152x152",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png",
        "purpose": "maskable any"
        },
        {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable any"
        }
    ],
  theme_color: "#37919b",
  background_color: "#ffffff",
  display: "standalone",
  start_url: $page.url.pathname
};
const base64 = Buffer.from(JSON.stringify(manifest), 'utf8').toString('base64');
</script>

<svelte:head>
  {#if base64}
    <link rel="manifest" href="data:application/manifest+json,{manifest}" />
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
