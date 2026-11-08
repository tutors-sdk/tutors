/**
 * Svelte action to attach copy functionality to code blocks
 * This works around DOMPurify stripping onclick handlers
 */
export function copyCode(node: HTMLElement) {
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  let destroyed = false;

  async function handleClick(event: MouseEvent) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button.copy");

    if (button) {
      const pre = button.closest("pre");
      if (pre) {
        const code = pre.querySelector("code");
        if (code) {
          if (!navigator.clipboard?.writeText) return;
          try {
            await navigator.clipboard.writeText(code.innerText);
          } catch {
            // Clipboard access can be denied; leave the button available to retry.
            return;
          }
          if (destroyed) return;
          clearTimeout(timers.get(button));
          button.classList.add("copied");
          timers.set(
            button,
            setTimeout(() => {
              button.classList.remove("copied");
              timers.delete(button);
            }, 2000)
          );
        }
      }
    }
  }

  node.addEventListener("click", handleClick);

  return {
    destroy() {
      destroyed = true;
      node.removeEventListener("click", handleClick);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    }
  };
}
