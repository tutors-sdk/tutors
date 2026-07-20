/**
 * Svelte action to attach copy functionality to code blocks
 * This works around DOMPurify stripping onclick handlers
 */
export function copyCode(node: HTMLElement) {
  function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const button = target.closest("button.copy");

    if (button) {
      const pre = button.closest("pre");
      if (pre) {
        const code = pre.querySelector("code");
        if (code) {
          navigator.clipboard.writeText(code.innerText);
          button.classList.add("copied");
          setTimeout(() => button.classList.remove("copied"), 2000);
        }
      }
    }
  }

  node.addEventListener("click", handleClick);

  return {
    destroy() {
      node.removeEventListener("click", handleClick);
    }
  };
}
