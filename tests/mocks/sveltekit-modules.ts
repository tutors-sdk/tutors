import { vi } from "vitest";

export const browser = true;
export const dev = false;
export const building = false;

export const goto = vi.fn();
export const afterNavigate = vi.fn();
export const beforeNavigate = vi.fn();
export const invalidate = vi.fn();
export const invalidateAll = vi.fn();

export const page = {
  params: {},
  url: new URL("http://localhost"),
  route: { id: "" }
};
