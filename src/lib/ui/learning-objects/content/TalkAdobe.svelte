<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_PDF_KEY } from "$env/static/public";
  import { adobeLoaded } from "$lib/runes";
  import type { Talk } from "$lib/services/models/lo-types";
  import { onMount } from "svelte";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();

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
  const viewerConfig = {
    defaultViewMode: "FIT_WIDTH", // Options are "FIT_WIDTH" or "FIT_PAGE"
    showAnnotationTools: false, // Hide annotation tools
    enableAnnotationAPIs: false, // Disable annotations completely
    showLeftHandPanel: false, // Hide left panel for better focus on the document
    showDownloadPDF: true, // Optionally disable download button
    showPrintPDF: true,
    showFullScreen: true
  };

  let adobeDCView: any = null;
  let mounted = false;
  // let viewerId = `adobe-pdf-viewer-${Math.random().toString(36).substr(2, 9)}`;
  let viewerId = "adobe-pdf-viewer";

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
    adobeDCView.previewFile(pdfContent, viewerConfig);
  }

  page.subscribe((path) => {
    if (mounted && path.data.lo && path.data.lo.pdf) {
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

<div class="mr-2 mt-2 px-4 py-2">
  <div id={viewerId} class="mx-auto h-[80dvh]"></div>
</div>
