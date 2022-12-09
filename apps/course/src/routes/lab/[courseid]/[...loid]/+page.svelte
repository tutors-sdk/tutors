<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  export let data: PageData;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", keypressInput);
  });

  async function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      let step = data.lab.nextStep();
      goto(`${data.lab.url}/${step}`);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      let step = data.lab.prevStep();
      goto(`${data.lab.url}/${step}`);
    }
  }
</script>

<svelte:head>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.18/katex.min.js"
    integrity="sha512-DAZH0Wu7q9Hnm0Fw8tRZsTeQBzIugiUy6k2r7E0KKMlC2nBvvrNSH/LVnGueCXRfDs5epP+Ieoh3L+VzSKi0Aw=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  ></script>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.13.18/katex.min.css"
    integrity="sha512-nii0D5CrWiLjtPcfU3pQJifaRLxKKVut/hbsazsodCcIOERZbwLH7dQxzOKy3Ey/Fv8fXCA9+Rf+wQzqklbEJQ=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

<div class="flex w-full lg:w-10/12 2xl:w-3/4 mx-auto">
  <div class="hidden lg:block w-1/3">
    <ul class="card bg-surface-100-800-token py-4 m-2 rounded-xl sticky top-6">
      {@html data.lab.navbarHtml}
    </ul>
  </div>
  <div id="lab-panel" class="w-full">
    <header class="block lg:hidden">
      <nav class="flex flex-wrap justify-between card mx-2 p-2">
        {@html data.lab.horizontalNavbarHtml}
      </nav>
    </header>
    <div class="card bg-surface-100-800-token p-8 lg:px-4 py-8 m-2 rounded-xl">
      <article class="mx-auto prose dark:prose-invert max-w-full lg:max-w-[85%]">
        {@html data.lab.content}
      </article>
    </div>
  </div>
</div>
