import type { Course } from "@tutors/tutors-model-lib";
import type { NotebookService } from "../types";
import type { NotebookCell, NotebookLo } from "$lib/types/notebook-types";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export class LiveNotebook implements NotebookService {
  course: Course;
  notebook: NotebookLo;
  url: string;
  cells: NotebookCell[];
  cellCount: number;
  activeCellIndex: number;
  navbarHtml: string;
  horizontalNavbarHtml: string;

  constructor(course: Course, notebook: NotebookLo, notebookId: string) {
    this.course = course;
    this.notebook = notebook;
    this.url = notebookId;
    this.cells = notebook.cells ?? [];
    this.cellCount = this.cells.length;
    this.activeCellIndex = 0;
    this.navbarHtml = "";
    this.horizontalNavbarHtml = "";
    this.refreshNav();
  }

  setActiveCell(index: number): void {
    if (index >= 0 && index < this.cellCount) {
      this.activeCellIndex = index;
      this.refreshNav();
    }
  }

  nextCell(): number {
    return this.activeCellIndex < this.cellCount - 1 ? this.activeCellIndex + 1 : this.activeCellIndex;
  }

  prevCell(): number {
    return this.activeCellIndex > 0 ? this.activeCellIndex - 1 : this.activeCellIndex;
  }

  isSolutionCell(cell: NotebookCell): boolean {
    const tags = cell.metadata?.tags;
    return Array.isArray(tags) && tags.includes("solution");
  }

  isExerciseCell(cell: NotebookCell): boolean {
    const tags = cell.metadata?.tags;
    return Array.isArray(tags) && tags.includes("exercise");
  }

  getCellLabel(cell: NotebookCell, index: number): string {
    if (cell.cellType === "code") {
      return `[${cell.executionCount ?? " "}]`;
    }
    if (cell.cellType === "markdown") {
      const firstLine = cell.source.split("\n")[0].replace(/^#+\s*/, "").trim();
      return firstLine.length > 30 ? firstLine.slice(0, 30) + "..." : firstLine || `Cell ${index + 1}`;
    }
    return `Cell ${index + 1}`;
  }

  getCellTypeIcon(cellType: string): string {
    switch (cellType) {
      case "code":
        return "terminal";
      case "markdown":
        return "document";
      default:
        return "text";
    }
  }

  refreshNav(): void {
    // Generate sidebar navigation HTML
    this.navbarHtml = this.cells
      .map((cell, i) => {
        const active = this.activeCellIndex === i ? "bg-primary-100 dark:bg-primary-900 font-semibold" : "";

        let icon = "";
        if (this.isSolutionCell(cell)) {
          icon = '<span class="text-tertiary-500">&#128274;</span>';
        } else if (this.isExerciseCell(cell)) {
          icon = '<span class="text-primary-500">&#9998;</span>';
        } else if (cell.cellType === "code") {
          icon = '<span class="text-warning-500">&#9654;</span>';
        } else if (cell.cellType === "markdown") {
          icon = '<span class="text-success-500">&#182;</span>';
        } else {
          icon = '<span class="text-surface-500">&#9644;</span>';
        }

        const label = this.isSolutionCell(cell) ? "Solution" : this.getCellLabel(cell, i);

        return `
          <li>
            <button
              class="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors ${active}"
              data-cell-index="${i}"
            >
              <span class="flex items-center gap-2">
                <span class="text-xs opacity-60 font-mono">${icon}</span>
                <span class="truncate">${escapeHtml(label)}</span>
              </span>
            </button>
          </li>
        `.trim();
      })
      .join("");

    // Generate mobile navigation HTML
    const hasPrev = this.activeCellIndex > 0;
    const hasNext = this.activeCellIndex < this.cellCount - 1;

    const prevButton = hasPrev
      ? '<button class="px-4 py-2 text-sm font-medium" data-nav="prev">&#9664; Prev</button>'
      : '<button class="px-4 py-2 text-sm font-medium disabled:opacity-30" disabled>&#9664; Prev</button>';

    const nextButton = hasNext
      ? '<button class="px-4 py-2 text-sm font-medium" data-nav="next">Next &#9654;</button>'
      : '<button class="px-4 py-2 text-sm font-medium disabled:opacity-30" disabled>Next &#9654;</button>';

    const counter = `<span class="text-sm text-surface-500">${this.activeCellIndex + 1} / ${this.cellCount}</span>`;

    this.horizontalNavbarHtml = `${prevButton}${counter}${nextButton}`;
  }
}
