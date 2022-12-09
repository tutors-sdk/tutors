<script lang="js">
  import Icon from "../../Atoms/Icon/Icon.svelte";
  import { BarLoader } from "svelte-loading-spinners";
  import FileSaver from "file-saver";
  import { onDestroy, tick } from "svelte";

  import * as pdfjs from "pdfjs-dist/build/pdf.js";
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  import "pdfjs-dist/build/pdf.worker.entry";

  export let url = "";
  export let scale = 1.8;
  export let pageNum = 1; //must be number
  export let lo = null;

  url = lo.pdf;

  let canvas;
  let pageCount = 0;
  let pdfDoc = null;
  let pageRendering = false;
  let pageNumPending = null;
  let rotation = 0;
  let totalPage = 0;
  let interval;
  let secondInterval;

  let pages = [];

  const renderPage = (num) => {
    pageRendering = true;

    pdfDoc.getPage(num).then(function (page) {
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

  const queueRenderPage = (num) => {
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

  const initialLoad = () => {
    window.addEventListener("keydown", keypressInput);
    let loadingTask = pdfjs.getDocument({ url });
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
</script>

{#if pdfDoc}
  <div class="card mr-2 rounded-lg p-2">
    <div class="mx-2 mb-2 flex items-center justify-between">
      <div class="text-sm">
        {pageNum} of {pdfDoc.numPages}
      </div>
      <div>
        <button class="btn btn-sm" on:click="{onPrevPage}">
          <Icon type="left" />
        </button>
        <button class="btn btn-sm" on:click="{onNextPage}">
          <Icon type="right" />
        </button>
        <button class="btn btn-sm" on:click="{clockwiseRotate}">
          <Icon type="rotate" />
        </button>
        <button class="btn btn-sm" on:click="{downloadPdf}">
          <Icon type="download" />
        </button>
        <button class="btn btn-sm">
          <Icon link="{lo.pdf}" type="fullScreen" target="_blank" />
        </button>
      </div>
    </div>
    <canvas class="mx-auto w-full 2xl:w-4/5" bind:this="{canvas}"></canvas>
  </div>
{:else}
  <div class="mt-28 flex flex-col items-center justify-center">
    <BarLoader size="100" color="#37919B" unit="px" />
    <br />
    <span class="text-lg">Loading...</span>
  </div>
{/if}
