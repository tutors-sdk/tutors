<script lang="ts">
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import * as pdfjs from "pdfjs-dist";
  // @ts-ignore
  import FileSaver from "file-saver";
  import { onDestroy, tick, onMount } from "svelte";
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import { PDFWorker, getDocument } from "pdfjs-dist";
  import type { Talk } from "$lib/services/models/lo-types";
  import { setupWorker } from "./support/pdf-utils";

  pdfjs.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();

  let pageNum = $state(1);
  let url = "";
  let canvas: any = $state();
  let pageCount = 0;
  let pdfDoc: any = $state(null);
  let pageRendering = false;
  let pageNumPending = false;
  let rotation = 0;
  let totalPage = 0;
  let pages: any = [];
  let loading = $state(true);
  let worker: PDFWorker | undefined;

  $effect(() => {
    loading = true;
    url = lo.pdf;
    pageNum = 1;
    loadDoc();
  });

  async function initialLoad() {
    await setupWorker();
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      return;
    }
    window.addEventListener("keydown", keypressInput);
  }

  function keypressInput(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNextPage();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrevPage();
    }
  }

  onMount(() => {
    initialLoad();
  });

  onDestroy(() => {
    window.removeEventListener("keydown", keypressInput);
    if (worker) {
      worker.destroy();
      worker = undefined;
    }
  });

  async function loadDoc() {
    try {
      const loadingTask = getDocument({ url, worker });
      pdfDoc = await loadingTask.promise;
      await tick();
      pageCount = pdfDoc.numPages;
      totalPage = pageCount;
      loading = false;
      await renderPage(pageNum);
    } catch (error) {
      console.error("Error loading document:", error);
    }
  }

  async function renderPage(num: number) {
    pageRendering = true;
    try {
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: 1.8, rotation: rotation });
      const canvasContext = canvas?.getContext("2d");

      if (canvas && viewport) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext,
          viewport
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        pageRendering = false;
        if (!pageNumPending) {
          if (pageNum < pdfDoc.totalPage) {
            pages[pageNum] = canvas;
            pageNum++;
            await renderPage(pageNum);
          } else {
            for (let i = 1; i < pages.length; i++) {
              canvas.appendChild(pages[i]);
            }
          }
          pageNumPending = false;
        }
      }
    } catch (error) {
      console.error(`Error rendering or getting page ${num}`, error);
    }
  }

  function queueRenderPage(num: number) {
    if (pageRendering) {
      pageNumPending = true;
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
</script>

<div class="card mr-2 rounded-lg p-2">
  <div class="mx-2 mb-2 flex items-center justify-between">
    <div class="text-sm">
      {pageNum} of {pdfDoc?.numPages}
    </div>
    <div>
      <button class="btn btn-sm" onclick={onPrevPage}>
        <Icon type="left" tip={"Back 1 slide"} />
      </button>
      <button class="btn btn-sm" onclick={onNextPage}>
        <Icon type="right" tip={"Forward 1 slide"} />
      </button>
      <button class="btn btn-sm" onclick={clockwiseRotate}>
        <Icon type="rotate" tip={"Rotate Slide 90 degrees"} />
      </button>
      <button class="btn btn-sm" onclick={downloadPdf}>
        <Icon type="download" tip={"Download"} />
      </button>
      <button class="btn btn-sm">
        <Icon link={lo.pdf} type="fullScreen" target="_blank" tip={"View Full Screen"} />
      </button>
    </div>
  </div>
  {#if !loading}
    <canvas class="mx-auto w-full 2xl:w-4/5" bind:this={canvas}></canvas>
  {:else}
    <div class="mb-72 mt-72 flex flex-col items-center justify-center">
      <Progress value={null} />
    </div>
  {/if}
</div>
