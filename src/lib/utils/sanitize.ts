import DOMPurify from "dompurify";

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe", "video", "source", "audio", "embed"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "loading", "controls", "poster", "autoplay", "src", "type", "width", "height", "style", "title", "data-testid"]
  });
}
