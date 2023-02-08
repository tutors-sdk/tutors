<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getKeys } from "../../../environment";
  import { page } from "$app/stores";
  import { Buffer } from 'buffer';
  import { Toast, toastStore } from '@skeletonlabs/skeleton';
  import type { ToastSettings } from '@skeletonlabs/skeleton';

  export let data: PageData;

  let standardDeck = true;
  let pinBuffer = "";
  let ignorePin = "";
  let isRunning: boolean = true;
  let isMobile: boolean = false;
  let deferredPrompt: any;

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      data.course.showAllLos();
      data.course.standardLos = data.course.allLos;
      standardDeck = false;
    }
  }

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if (window.matchMedia('(display-mode: standalone)' || '(display-mode: fullscreen)' || '(display-mode: minimal-ui)').matches) {
    isRunning = true;
  } else {
    isRunning = false;
  }

  if (['iPad Simulator', 'iPhone Simulator','iPod Simulator', 'iPad','iPhone','iPod'].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document || navigator.userAgent.includes("Mobile")) {
   isMobile = true;
  }

  const installPWA = () => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  };

function triggerInstallToast(): void {
	const t: ToastSettings = {
		message: 'Install Tutors to your computer for easy access',
		// Optional: Presets for primary | secondary | tertiary | warning
		preset: 'primary',
		// Optional: The auto-hide settings
		autohide: true,
		timeout: 10000,
		// Optional: Adds a custom action button
		action: {
			label: 'Install Now',
			response: () => installPWA(),
		}
	};
  toastStore.clear();
	toastStore.trigger(t);
}


if (!isMobile && !isRunning && data.course.units.length > 0) {
      triggerInstallToast();
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

  const currentUrl = $page.url.toString().slice(0, $page.url.toString().indexOf("course"))

  const manifest = {"name":"Tutors Course Reader","short_name":"Tutors","id":"tutors","icons":[{"src": "https://reader.tutors.dev/icons/icon-48x48.png","sizes": "48x48","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-72x72.png","sizes": "72x72","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-96x96.png","sizes": "96x96","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-128x128.png","sizes": "128x128","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-144x144.png","sizes": "144x144","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-152x152.png","sizes": "152x152","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-192x192.png","sizes": "192x192","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-384x384.png","sizes": "384x384","type": "image/png","purpose": "maskable any"},{"src": "https://reader.tutors.dev/icons/icon-512x512.png","sizes": "512x512","type": "image/png","purpose": "maskable any"}],"theme_color":"#37919b","background_color":"#121317","display":"standalone","scope":currentUrl,"start_url":$page.url};
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
