import type { Lo } from "@tutors/tutors-model-lib";

export function isMarpContent(lo: Lo): boolean {
  if (lo.frontMatter?.marp === "true") {
    return true;
  }
  if (lo.contentMd && /^---\s*\nmarp:\s*true/m.test(lo.contentMd)) {
    return true;
  }
  return false;
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
