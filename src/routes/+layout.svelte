<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { get } from 'svelte/store';
  import { getKeys } from "$lib/environment";
  import { initFirebase } from "$lib/services/utils/firebase-utils";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { initializeStores, storePopup } from "@skeletonlabs/skeleton";
  import { loadTranslations, setLocale } from '$lib/translations';
  import LanguageSwitcher from '$lib/ui/components/LanguageSwitcher.svelte';

  initializeStores();
  const themes: any = ["tutors", "dyslexia", "halloween", "valentines"];
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  // Handle navigation if the URL has a specific hash
  if ($page.url.hash.startsWith("#/course")) {
    goto($page.url.hash.slice(2));
  }

  // Initialize translations when the component mounts
  $: {
    (async () => {
      const url = get(page).url;
      const initLocale = url.searchParams.get('lang') || 'en';
      const pathname = url.pathname;

      console.log('Initializing locale:', initLocale);
      setLocale(initLocale);
      await loadTranslations(initLocale, pathname);
    })();
  }
</script>

<LanguageSwitcher />

<slot />
