import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Marp } from "@marp-team/marp-core";

const marp = new Marp({
  container: { tag: "div", class: "marp-slides" },
  html: true
});

export const POST: RequestHandler = async ({ request }) => {
  const { markdown } = await request.json();
  if (!markdown) {
    return json({ error: "No markdown provided" }, { status: 400 });
  }
  const { html, css } = marp.render(markdown);
  return json({ html, css });
};
