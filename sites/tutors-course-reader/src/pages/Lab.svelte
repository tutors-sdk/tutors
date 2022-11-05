<script lang="ts">
  import { push } from "svelte-spa-router";
  import { afterUpdate, getContext, onDestroy } from "svelte";
  import type { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { revealSidebar } from "tutors-reader-lib/src/stores/stores";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import * as animateScroll from "svelte-scrollto";
  import type { Lab } from "tutors-reader-lib/src/models/lab";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";

  export let params: Record<string, string>;

  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");

  let lab: Lab;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  window.addEventListener("keydown", keypressInput);
  window.addEventListener("mousedown", mouseClick);

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);

  let mostRecentLab = "";

  function removeLastDirectory(the_url: string) {
    var the_arr = the_url.split("/");
    let lastSegment = the_arr.pop();
    if (lastSegment.startsWith("book")) {
      return the_url;
    }
    return the_arr.join("/");
  }

  async function getLab(url: string) {
    revealSidebar.set(false);
    let encoded = encodeURI(url);
    const lastSegment = encoded.substr(params.wild.lastIndexOf("/") + 1);

    if (mostRecentLab === "") {
      mostRecentLab = removeLastDirectory(url);
      lab = await cache.readLab(params.wild);
    } else {
      let thisLab = removeLastDirectory(url);
      if (mostRecentLab !== thisLab) {
        lab = await cache.readLab(url);
      }
    }
    analytics.pageLoad(url, lab.lo);
    if (lastSegment.startsWith("book")) {
      lab.setFirstPageActive();
    } else {
      lab.setActivePage(lastSegment);
    }
    return lab;
  }

  let direction = 0;

  function mouseClick() {
    direction = 0;
  }

  async function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      direction = 400;
      e.preventDefault();
      let step = lab.nextStep();
      if (step) await push(`/lab/${lab.url}/${step}`);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      direction = -150;
      e.preventDefault();
      let step = lab.prevStep();
      if (step) await push(`/lab/${lab.url}/${step}`);
    }
  }

  onDestroy(() => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.removeEventListener("keydown", keypressInput);
    window.removeEventListener("mousedown", mouseClick);
  });

  afterUpdate(() => {
    animateScroll.scrollTo({ delay: 200, element: "#top" });
  });

  const onComplete = () => {
    alert("Lab Complete!!");
  };
</script>

{#await getLab(params.wild)}
  <Loading />
{:then lab}
  {#if !hide}
    <div class="flex w-full lg:w-10/12 2xl:w-3/4 mx-auto">
      <div class="hidden lg:block w-1/3">
        <ul class="card bg-surface-100-800-token py-4 m-2 rounded-xl sticky top-6 max-h-[60vh] overflow-y-scroll">
          {@html lab.navbarHtml}
        </ul>
      </div>
      <div id="lab-panel" class="w-full">
        <header class="block lg:hidden">
          <nav class="flex flex-wrap justify-between card mx-2 p-2">
            {@html lab.horizontalNavbarHtml}
          </nav>
        </header>
        <div class="card bg-surface-100-800-token p-8 lg:px-4 py-8 m-2 rounded-xl">
          <article class="mx-auto prose dark:prose-invert max-w-full lg:max-w-[85%]">
            {@html lab.content}
          </article>
        </div>
      </div>
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}

<style>
  :global(.labcontent pre) {
    color: white;
  }
</style>
