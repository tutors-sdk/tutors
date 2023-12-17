<script lang="ts">
  import { BROWSER } from "esm-env";
  import Icon from "../../icons/Icon.svelte";
  import * as pdfjs from "pdfjs-dist";
  // @ts-ignore
  import FileSaver from "file-saver";
  import { getContext, onDestroy, setContext, tick } from "svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";

  import { PDFWorker, getDocument } from "pdfjs-dist";
  import type { Talk } from "$lib/services/models/lo-types";

  set_pdfjs_context();

  export let url = "";
  export let scale = 1.8;
  export let pageNum = 1; //must be number
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

  const renderPage = (num: any) => {
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
            // renderPage(pageNumPending);
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
        });
      }
    });
  };

  const queueRenderPage = (num: any) => {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  };

  const onPrevPage = () => {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  };

  const onNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  };

  const clockwiseRotate = () => {
    rotation = rotation + 90;
    queueRenderPage(pageNum);
  };

  const downloadPdf = () => {
    let fileName = url.substring(url.lastIndexOf("/") + 1);
    FileSaver.saveAs(url, fileName);
  };

  const worker = getContext<PDFWorker | undefined>("svelte_pdfjs_worker");

  const initialLoad = () => {
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
        console.log(error);
      });
  };
  initialLoad();

  onDestroy(() => {
    clearInterval(interval);
    clearInterval(secondInterval);
    window.removeEventListener("keypress", keypressInput);
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

  export function set_pdfjs_context() {
    if (BROWSER) {
      const worker = new pdfjs.PDFWorker({
        port: new Worker(new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url)) as unknown as null
      });
      setContext("svelte_pdfjs_worker", worker);
      onDestroy(() => worker.destroy());
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
