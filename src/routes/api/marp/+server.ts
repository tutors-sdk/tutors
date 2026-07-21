import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Marp } from "@marp-team/marp-core";

const marp = new Marp({
  container: { tag: "div", class: "marp-slides" },
  html: true
});

const MAX_MARKDOWN_SIZE = 100 * 1024; // 100KB

export const POST: RequestHandler = async ({ request }) => {
  const { markdown } = await request.json();
  if (!markdown || typeof markdown !== "string") {
    return json({ error: "No markdown provided" }, { status: 400 });
  }
  if (markdown.length > MAX_MARKDOWN_SIZE) {
    return json({ error: "Markdown content exceeds maximum allowed size" }, { status: 413 });
  }
  const { html, css } = marp.render(markdown);
  return json({ html, css });
};
