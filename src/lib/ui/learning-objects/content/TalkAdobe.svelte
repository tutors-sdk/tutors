<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_PDF_KEY } from "$env/static/public";
  import type { Talk } from "$lib/services/models/lo-types";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();

  let adobeDCView: any = null;
  let mounted = false;

  function displayPDF() {
    if (!mounted) return;
    adobeDCView = new window.AdobeDC.View({
      clientId: PUBLIC_PDF_KEY,
      divId: "adobe-pdf-viewer"
    });

    adobeDCView.previewFile(
      {
        content: {
          location: {
            url: lo.pdf // Replace with your PDF URL
          }
        },
        metaData: {
          fileName: lo.title
        }
      },
      {
        defaultViewMode: "FIT_WIDTH", // Options are "FIT_WIDTH" or "FIT_PAGE"
        showAnnotationTools: false, // Hide annotation tools
        enableAnnotationAPIs: false, // Disable annotations completely
        showLeftHandPanel: false, // Hide left panel for better focus on the document
        showDownloadPDF: true, // Optionally disable download button
        showPrintPDF: true,
        showFullScreen: true
      }
    );
  }
  page.subscribe((path) => {
    if (path.data.lo && path.data.lo.pdf) {
      displayPDF();
    }
  });

  window.addEventListener("adobe_dc_view_sdk.ready", () => {
    mounted = true;
    displayPDF();
  });
</script>

<div class="card mr-2 mt-2 px-4 py-2">
  <div id="adobe-pdf-viewer" class="h-[80dvh] w-full"></div>
</div>

<svelte:head>
  <script type="text/javascript" src="https://acrobatservices.adobe.com/view-sdk/viewer.js"></script>
</svelte:head>
