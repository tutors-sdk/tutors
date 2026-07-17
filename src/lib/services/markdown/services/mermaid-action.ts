import type { ActionReturn } from "svelte/action";

let mermaidModule: typeof import("mermaid") | null = null;
let idCounter = 0;

function isDarkMode(): boolean {
  return document.documentElement.classList.contains("dark");
}

async function getMermaid() {
  if (!mermaidModule) {
    mermaidModule = await import("mermaid");
    mermaidModule.default.initialize({
      startOnLoad: false,
      theme: isDarkMode() ? "dark" : "default"
    });
  }
  return mermaidModule.default;
}

async function renderMermaidBlocks(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>("div.mermaid");
  if (nodes.length === 0) return;

  const mermaid = await getMermaid();
  mermaid.initialize({
    startOnLoad: false,
    theme: isDarkMode() ? "dark" : "default"
  });

  for (const node of nodes) {
    if (node.dataset.mermaidRendered) continue;
    const source = node.textContent?.trim();
    if (!source) continue;

    const id = `mermaid-${idCounter++}`;
    try {
      const { svg } = await mermaid.render(id, source);
      node.innerHTML = svg;
      node.classList.add("mermaid-diagram");
      node.dataset.mermaidRendered = "true";
    } catch {
      node.innerHTML = `<div class="mermaid-error">Failed to render diagram</div>`;
      node.dataset.mermaidRendered = "true";
    }
  }
}

export function mermaidify(node: HTMLElement, _content?: unknown): ActionReturn<unknown> {
  renderMermaidBlocks(node);

  return {
    update() {
      requestAnimationFrame(() => renderMermaidBlocks(node));
    },
    destroy() {}
  };
}
