<script lang="ts">
  import { BROWSER } from "esm-env";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import * as pdfjs from "pdfjs-dist";
  // @ts-ignore
  import FileSaver from "file-saver";
  import { getContext, onDestroy, setContext, tick, beforeUpdate, afterUpdate, onMount } from "svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { PDFWorker, getDocument } from "pdfjs-dist";
  import type { Talk } from "$lib/services/models/lo-types";

  // Ensure the worker is not instantiated before setting the workerSrc
  pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

  let worker: PDFWorker | undefined;

  // Set the initial context with a placeholder worker
  setContext("svelte_pdfjs_worker", worker);

  async function setupWorker() {
    if (BROWSER) {
      try {
        const workerSrcUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url);
        const response = await fetch(workerSrcUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch worker script: ${response.statusText}`);
        }
        let workerScript = await response.text();

        // Remove any export statements to ensure the script can be executed in the worker context
        workerScript = workerScript.replace(/export\s+.*;/g, '');

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);

        pdfjs.GlobalWorkerOptions.workerSrc = url;

        return new pdfjs.PDFWorker({ port: new Worker(url) });
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("Not in a browser environment.");
    }
  }

  async function initialLoad() {
    await setupWorker();
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      return;
    }
    window.addEventListener("keydown", keypressInput);
    let loadingTask = getDocument({ url, worker });
    loadingTask.promise
      .then(async function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        await tick();
        pageCount = pdfDoc.numPages;
        totalPage = pageCount;
        renderPage(pageNum);
      })
      .catch(function (error) {
        console.error("Error loading document:", error);
      });
  }

  onMount(() => {
    initialLoad();
  });

  export let url = "";
  export let scale = 1.8;
  export let pageNum = 1; // must be number
  export let lo: Talk;

  url = lo.pdf;

  let canvas: any;
  let pageCount = 0;
  let pdfDoc: any = null;
  let pageRendering = false;
  let pageNumPending: any = null;
  let rotation = 0;
  let totalPage = 0;
  let interval: any;
  let secondInterval: any;

  let pages: any = [];

  function renderPage(num: any) {
    pageRendering = true;

    pdfDoc.getPage(num).then(function (page: any) {
      let viewport = page.getViewport({ scale: scale, rotation: rotation });
      const canvasContext = canvas?.getContext("2d");
      if (canvas) {
        canvas.height = viewport?.height;
        canvas.width = viewport?.width;

        let renderContext = {
          canvasContext,
          viewport
        };
        let renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
          pageRendering = false;
          if (pageNumPending !== null) {
            // New page rendering is pending
            if (pageNum < pdfDoc.totalPage) {
              pages[pageNum] = canvas;
              pageNum++;
              pdfDoc.getPage(pageNum).then(renderPage);
            } else {
              for (let i = 1; i < pages.length; i++) {
                canvas.appendChild(pages[i]);
              }
            }
            pageNumPending = null;
          }
        }).catch(function (error) {
          console.error(`Error rendering page ${num}`, error);
        });
      }
    }).catch(function (error) {
      console.error(`Error getting page ${num}`, error);
    });
  }

  function queueRenderPage(num: any) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }

  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }

  function clockwiseRotate() {
    rotation = rotation + 90;
    queueRenderPage(pageNum);
  }

  function downloadPdf() {
    let fileName = url.substring(url.lastIndexOf("/") + 1);
    FileSaver.saveAs(url, fileName);
  }

  onDestroy(() => {
    clearInterval(interval);
    clearInterval(secondInterval);
    window.removeEventListener("keydown", keypressInput);
    if (worker) {
      worker.destroy();
      worker = undefined;
    }
  });

  function keypressInput(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNextPage();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrevPage();
    }
  }
</script>

{#if pdfDoc}
  <div class="card mr-2 rounded-lg p-2">
    <div class="mx-2 mb-2 flex items-center justify-between">
      <div class="text-sm">
        {pageNum} of {pdfDoc.numPages}
      </div>
      <div>
        <button class="btn btn-sm" on:click={onPrevPage}>
          <Icon type="left" tip={"Back 1 slide"} />
        </button>
        <button class="btn btn-sm" on:click={onNextPage}>
          <Icon type="right" tip={"Forward 1 slide"} />
        </button>
        <button class="btn btn-sm" on:click={clockwiseRotate}>
          <Icon type="rotate" tip={"Rotate Slide 90 degrees"} />
        </button>
        <button class="btn btn-sm" on:click={downloadPdf}>
          <Icon type="download" tip={"Download"} />
        </button>
        <button class="btn btn-sm">
          <Icon link={lo.pdf} type="fullScreen" target="_blank" tip={"View Full Screen"} />
        </button>
      </div>
    </div>
    <canvas class="mx-auto w-full 2xl:w-4/5" bind:this={canvas} />
  </div>
{:else}
  <div class="mt-28 flex flex-col items-center justify-center">
    Loading
    <br />
    <ProgressRadial stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20" />
  </div>
{/if}
