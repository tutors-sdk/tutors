import type { Lo } from "@tutors/tutors-model-lib";

export function isMarpContent(lo: Lo): boolean {
  const marpValue = lo.frontMatter?.marp;
  if (marpValue === true || marpValue === "true") {
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

export async function renderMarpSlides(markdown: string): Promise<{ html: string; css: string }> {
  const response = await fetch("/api/marp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown })
  });
  if (!response.ok) {
    throw new Error(`Marp render failed: ${response.status}`);
  }
  return response.json();
}
