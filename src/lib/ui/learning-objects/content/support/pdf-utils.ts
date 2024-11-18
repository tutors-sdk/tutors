import { BROWSER } from "esm-env";
import * as pdfjs from "pdfjs-dist";

export async function setupWorker() {
  if (BROWSER) {
    try {
      const workerSrcUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
      const response = await fetch(workerSrcUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch worker script: ${response.statusText}`);
      }
      let workerScript = await response.text();

      // Remove any export statements to ensure the script can be executed in the worker context
      workerScript = workerScript.replace(/export\s+.*;/g, "");

      const blob = new Blob([workerScript], { type: "application/javascript" });
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
