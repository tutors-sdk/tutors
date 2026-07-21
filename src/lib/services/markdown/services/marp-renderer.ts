import type { Lo } from "@tutors/tutors-model-lib";
import { Marp } from "@marp-team/marp-core";

const marp = new Marp({
  container: { tag: "div", class: "marp-slides" },
  html: true
});

export function isMarpContent(lo: Lo): boolean {
  const marpValue = lo.frontMatter?.marp;
  if (marpValue != null && String(marpValue).toLowerCase() === "true") {
    return true;
  }
  if (lo.contentMd && /^---\s*\nmarp:\s*true/m.test(lo.contentMd)) {
    return true;
  }
  return false;
}

export function buildMarpMarkdown(lo: Lo): string {
  if (lo.contentMd.trimStart().startsWith("---")) {
    return lo.contentMd;
  }
  const fm = lo.frontMatter ?? {};
  const lines = ["---", "marp: true"];
  if (fm.theme) lines.push(`theme: ${fm.theme}`);
  if (fm.paginate) lines.push(`paginate: ${fm.paginate}`);
  lines.push("---", "");
  return lines.join("\n") + lo.contentMd;
}

export function renderMarpSlides(markdown: string): { html: string; css: string } {
  return marp.render(markdown);
}
