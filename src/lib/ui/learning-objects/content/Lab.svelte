<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import type { LiveLab } from "$lib/services/models/live-lab";

  interface Props {
    lab: LiveLab;
  }
  let { lab }: Props = $props();

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    browser ? window.removeEventListener("keydown", keypressInput) : null;
  });

  page.subscribe((path) => {});
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

<div class="w-full">
  <div class="bg-primary-50 dark:bg-primary-900 sticky top-0 block w-full rounded border lg:hidden">
    <nav class="flex flex-wrap justify-between p-2">
      {@html lab.horizontalNavbarHtml}
    </nav>
  </div>

  <div class="max-w-l flex">
    <div class="mr-2 hidden h-auto w-72 lg:block">
      <div class="card bg-surface-100 dark:bg-surface-950 sticky top-6 m-2 h-auto rounded-xl py-4">
        <nav class="nav-list">
          <ul>
            {@html lab.navbarHtml}
          </ul>
        </nav>
      </div>
    </div>
    <div id="lab-panel" class="min-h-screen flex-1">
      <article class="prose mr-4 max-w-none dark:prose-invert prose-pre:max-w-[70vw]">
        {@html lab.content}
      </article>
    </div>
  </div>
</div>
