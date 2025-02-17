<script lang="ts">
  import { page } from "$app/state";
  import { PUBLIC_PDF_KEY } from "$env/static/public";
  import { adobeLoaded, currentCourse } from "$lib/runes.svelte";
  import type { Talk } from "$lib/services/base";
  import { onMount } from "svelte";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();

  const embedOption = currentCourse.value?.lightboxpdf ? "" : "SIZED_CONTAINER";
  const viewerConfig = {
    embedMode: embedOption,
    defaultViewMode: "FIT_PAGE", // Options are "FIT_WIDTH" or "FIT_PAGE"
    showThumbnails: true,
    showAnnotationTools: false, // Hide annotation tools
    enableAnnotationAPIs: false, // Disable annotations completely
    showLeftHandPanel: true, // Hide left panel for better focus on the document
    showDownloadPDF: true, // Optionally disable download button
    showPrintPDF: true,
    showFullScreen: true,
    showSinglePage: true,
    showZoomControl: true
  };

  let adobeDCView: any = null;
  let mounted = false;
  let viewerId = `adobe-pdf-viewer-${Math.random().toString(36).substr(2, 9)}`;
  // let viewerId = "adobe-pdf-viewer";

  function loadSDK() {
    if (!adobeLoaded.value) {
      const script = document.createElement("script");
      script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
      document.head.appendChild(script);
      adobeLoaded.value = true;
    }
  }

  function displayPDF() {
    adobeDCView = new window.AdobeDC.View({
      clientId: PUBLIC_PDF_KEY,
      divId: viewerId
    });

    const pdfContent = {
      content: {
        location: {
          url: lo.pdf
        }
      },
      metaData: {
        fileName: lo.title
      }
    };
    adobeDCView.previewFile(pdfContent, viewerConfig);
  }

  $effect(() => {
    console.log(page.data?.lo?.pdf);
    if (mounted && page.data?.lo?.pdf) {
      displayPDF();
    }
  });

  onMount(() => {
    loadSDK();
    if (window.AdobeDC) {
      displayPDF();
      mounted = true;
    } else {
      document.addEventListener("adobe_dc_view_sdk.ready", () => {
        displayPDF();
        mounted = true;
      });
    }
  });
</script>

<div class="relative w-full p-2" style="aspect-ratio: 16/11;">
  <div id={viewerId} class="mx-auto h-full w-full"></div>
</div>
