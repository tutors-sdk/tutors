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
  const { Marp } = await import("@marp-team/marp-core");
  const marp = new Marp({
    container: { tag: "div", class: "marp-slides" },
    html: true
  });
  const { html, css } = marp.render(markdown);
  return { html, css };
}
