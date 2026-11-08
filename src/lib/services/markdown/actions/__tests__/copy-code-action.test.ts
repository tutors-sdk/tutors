import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyCode } from "../copy-code-action";

describe("Feature: Copy code feedback", () => {
  let node: HTMLElement;
  let button: HTMLButtonElement;
  let action: ReturnType<typeof copyCode>;
  const writeText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset();
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    node = document.createElement("div");
    node.innerHTML = '<pre><code></code><button class="copy"><span>Copy</span></button></pre>';
    node.querySelector("code")!.innerText = "console.log('hello');";
    button = node.querySelector("button")!;
    action = copyCode(node);
  });

  afterEach(() => {
    action.destroy();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("WHEN a write is pending the button shall wait for success", async () => {
    let complete!: () => void;
    writeText.mockReturnValue(new Promise<void>((resolve) => (complete = resolve)));
    button.querySelector("span")!.click();
    expect(writeText).toHaveBeenCalledWith("console.log('hello');");
    expect(button.classList.contains("copied")).toBe(false);

    complete();
    await vi.advanceTimersByTimeAsync(0);
    expect(button.classList.contains("copied")).toBe(true);
    await vi.advanceTimersByTimeAsync(2000);
    expect(button.classList.contains("copied")).toBe(false);
  });

  it("IF a write is denied the button shall not display success", async () => {
    writeText.mockRejectedValue(new DOMException("Permission denied", "NotAllowedError"));
    button.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(button.classList.contains("copied")).toBe(false);
  });

  it("IF clipboard access is unavailable the action shall not throw", () => {
    vi.stubGlobal("navigator", {});
    button.click();
    expect(button.classList.contains("copied")).toBe(false);
  });

  it("WHEN destroyed before completion the action shall not display feedback", async () => {
    let complete!: () => void;
    writeText.mockReturnValue(new Promise<void>((resolve) => (complete = resolve)));
    button.click();
    action.destroy();
    complete();
    await vi.advanceTimersByTimeAsync(0);
    expect(button.classList.contains("copied")).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("WHEN destroyed after success the action shall clear its feedback timer", async () => {
    writeText.mockResolvedValue(undefined);
    button.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(vi.getTimerCount()).toBe(1);
    action.destroy();
    expect(vi.getTimerCount()).toBe(0);
    button.click();
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
