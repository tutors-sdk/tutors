import type { Lo } from "@tutors/tutors-model-lib";

export interface NotebookOutput {
  outputType: "stream" | "execute_result" | "display_data" | "error";
  text?: string;
  data?: Record<string, string>;
  traceback?: string[];
  name?: string;
  executionCount?: number | null;
}

export interface NotebookCell {
  cellType: "markdown" | "code" | "raw";
  source: string;
  sourceHtml?: string;
  outputs: NotebookOutput[];
  outputsHtml?: string;
  executionCount: number | null;
  metadata: Record<string, unknown>;
  id: string;
}

export interface NotebookLo extends Lo {
  cells?: NotebookCell[];
  kernelLanguage?: string;
}
