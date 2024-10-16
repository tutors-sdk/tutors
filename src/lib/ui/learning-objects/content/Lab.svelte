<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import type { LiveLab } from "$lib/services/models/live-lab";
  export let lab: LiveLab;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    browser ? window.removeEventListener("keydown", keypressInput) : null;
  });

  afterNavigate(() => {
    if (!$page.url.hash) {
      const elemPage = document.querySelector("#page");
      if (elemPage) elemPage.scrollTop = 0;
    }
  });

  async function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      let step = lab.nextStep();
      goto(`${lab.url}/${step}`);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      let step = lab.prevStep();
      goto(`${lab.url}/${step}`);
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="block fixed w-full bottom-0 lg:hidden bg-primary-50-900-token z-30 -ml-10">
  <nav class="flex flex-wrap justify-between p-2">
    {@html lab.horizontalNavbarHtml}
  </nav>
</div>

<div class="w-full">
  <div class="flex max-w-l">
    <div class="hidden lg:block h-auto w-72 mr-2">
      <div class="sticky h-auto card bg-surface-100-800-token py-4 m-2 rounded-xl top-6">
        <nav class="nav-list">
          <ul>
            {@html lab.navbarHtml}
          </ul>
        </nav>
      </div>
    </div>
    <div id="lab-panel" class="flex-1 min-h-screen">
      <article class="prose dark:prose-invert max-w-none mr-4 prose-pre:max-w-[70vw]">
        {@html lab.content}
      </article>
    </div>
  </div>
</div>
