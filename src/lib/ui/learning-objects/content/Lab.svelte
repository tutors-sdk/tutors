<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import type { LiveLab } from "$lib/services/course";
  import { currentCodeTheme } from "$lib/services/markdown";

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

  afterNavigate(() => {
    const elemPage = document.querySelector("#lab-panel");
    if (elemPage && window.innerWidth >= 600) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
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

<div class="lab-content w-full pb-14">
  <div class="max-w-l flex">
    <div class="mr-2 hidden h-auto w-72 lg:block">
      <div
        class="card bg-surface-100 border-primary-100 dark:border-primary-500 dark:bg-surface-950 sticky top-14 m-2 h-auto rounded-xl border-[1px]
          py-4"
      >
        <nav class="nav-list">
          <ul>
            {@html lab.navbarHtml}
          </ul>
        </nav>
      </div>
    </div>
    <div class="min-h-screen flex-1">
      <article class="prose dark:prose-invert prose-pre:overflow-x-auto 2xl:prose-pre:max-w-[120ch] max-w-[65ch] sm:mx-1 md:mx-4 2xl:max-w-[120ch]">
        {#key currentCodeTheme.value}
          <span id="lab-panel" class="mt-[-60px] block pt-[60px]">
            {@html lab.content}
          </span>
        {/key}
      </article>
    </div>
  </div>

  <div class="bg-primary-50 dark:bg-primary-900 fixed bottom-0 left-0 z-50 block w-full rounded-sm border lg:hidden">
    <nav class="flex flex-wrap justify-between p-2">
      {@html lab.horizontalNavbarHtml}
    </nav>
  </div>
</div>
