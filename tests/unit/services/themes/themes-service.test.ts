import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the festive module before any import of the theme service.
// This prevents the real module from loading (it depends on tsParticles globals).
vi.mock("$lib/services/themes/events/festive.svelte", () => ({
  makeItSnow: vi.fn(),
  makeItStopSnowing: vi.fn()
}));

import { themeService } from "$lib/services/themes";

beforeEach(() => {
  localStorage.clear();
  // The source writes via direct property access; clear those too
  delete (localStorage as any).theme;
  delete (localStorage as any).modeCurrent;
  delete (localStorage as any).layout;
  delete (localStorage as any).cardStyle;
  // Reset to defaults
  themeService.currentTheme.value = "tutors";
  themeService.lightMode.value = "light";
  themeService.layout.value = "expanded";
  themeService.cardStyle.value = "portrait";
  themeService.isSnowing = false;
  document.documentElement.classList.remove("dark");
  document.documentElement.removeAttribute("data-theme");
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// setTheme
// ---------------------------------------------------------------------------
describe("setTheme", () => {
  it("sets the data-theme attribute on the document element", () => {
    themeService.setTheme("classic");
    expect(document.documentElement.getAttribute("data-theme")).toBe("classic");
  });

  it("persists the theme name to localStorage", () => {
    themeService.setTheme("rose");
    expect((localStorage as any).theme).toBe("rose");
  });

  it("updates currentTheme rune value", () => {
    themeService.setTheme("cerberus");
    expect(themeService.currentTheme.value).toBe("cerberus");
  });

  it("defaults to 'tutors' when called with an empty string", () => {
    themeService.setTheme("");
    expect(themeService.currentTheme.value).toBe("tutors");
    expect((localStorage as any).theme).toBe("tutors");
  });

  it("triggers snow animation state when switching to festive theme", () => {
    // Ensure festive is in the themes list
    const hasFestive = themeService.themes.some((t) => t.name === "festive");
    if (!hasFestive) {
      themeService.themes.push({ name: "festive", icons: {} as any });
    }
    themeService.setTheme("festive");
    // eventTrigger sets isSnowing=true when currentTheme is "festive"
    expect(themeService.isSnowing).toBe(true);
  });

  it("stops snow animation state when switching away from festive", () => {
    const hasFestive = themeService.themes.some((t) => t.name === "festive");
    if (!hasFestive) {
      themeService.themes.push({ name: "festive", icons: {} as any });
    }
    themeService.setTheme("festive");
    expect(themeService.isSnowing).toBe(true);

    themeService.setTheme("tutors");
    expect(themeService.isSnowing).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// setDisplayMode
// ---------------------------------------------------------------------------
describe("setDisplayMode", () => {
  it("adds 'dark' class to documentElement when mode is dark", () => {
    themeService.setDisplayMode("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes 'dark' class from documentElement when mode is light", () => {
    themeService.setDisplayMode("dark");
    themeService.setDisplayMode("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists mode to localStorage as modeCurrent", () => {
    themeService.setDisplayMode("dark");
    expect((localStorage as any).modeCurrent).toBe("dark");
  });

  it("updates lightMode rune value", () => {
    themeService.setDisplayMode("dark");
    expect(themeService.lightMode.value).toBe("dark");
  });

  it("defaults to 'light' when called with a falsy value", () => {
    themeService.setDisplayMode("");
    expect(themeService.lightMode.value).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// toggleDisplayMode
// ---------------------------------------------------------------------------
describe("toggleDisplayMode", () => {
  it("switches from light to dark", () => {
    themeService.setDisplayMode("light");
    themeService.toggleDisplayMode();
    expect(themeService.lightMode.value).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("switches from dark to light", () => {
    themeService.setDisplayMode("dark");
    themeService.toggleDisplayMode();
    expect(themeService.lightMode.value).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("round-trips back to original mode after two toggles", () => {
    themeService.setDisplayMode("light");
    themeService.toggleDisplayMode();
    themeService.toggleDisplayMode();
    expect(themeService.lightMode.value).toBe("light");
  });
});

// ---------------------------------------------------------------------------
// setLayout / toggleLayout
// ---------------------------------------------------------------------------
describe("setLayout", () => {
  it("sets the layout rune value", () => {
    themeService.setLayout("compacted");
    expect(themeService.layout.value).toBe("compacted");
  });

  it("persists layout to localStorage", () => {
    themeService.setLayout("compacted");
    expect((localStorage as any).layout).toBe("compacted");
  });

  it("defaults to 'expanded' when called with a falsy value", () => {
    themeService.setLayout("");
    expect(themeService.layout.value).toBe("expanded");
    expect((localStorage as any).layout).toBe("expanded");
  });
});

describe("toggleLayout", () => {
  it("switches from expanded to compacted", () => {
    themeService.setLayout("expanded");
    themeService.toggleLayout();
    expect(themeService.layout.value).toBe("compacted");
  });

  it("switches from compacted to expanded", () => {
    themeService.setLayout("compacted");
    themeService.toggleLayout();
    expect(themeService.layout.value).toBe("expanded");
  });

  it("persists toggled layout to localStorage", () => {
    themeService.setLayout("expanded");
    themeService.toggleLayout();
    expect((localStorage as any).layout).toBe("compacted");
  });
});

// ---------------------------------------------------------------------------
// getIcon
// ---------------------------------------------------------------------------
describe("getIcon", () => {
  it("returns an icon object with type and color properties", () => {
    themeService.setTheme("tutors");
    const icon = themeService.getIcon("course");
    expect(icon).toHaveProperty("type");
    expect(icon).toHaveProperty("color");
  });

  it("returns the correct icon for a known type", () => {
    themeService.setTheme("tutors");
    const icon = themeService.getIcon("course");
    expect(icon.type).toBe("fluent:notebook-24-filled");
    expect(icon.color).toBe("primary");
  });

  it("returns the fallback tutors icon for an unknown type", () => {
    themeService.setTheme("tutors");
    const icon = themeService.getIcon("nonexistent-icon-type");
    expect(icon.type).toBe("fa-solid:chalkboard-teacher");
    expect(icon.color).toBe("bg-base-content");
  });

  it("returns icons from the current theme icon library", () => {
    themeService.setTheme("tutors");
    const labIcon = themeService.getIcon("lab");
    expect(labIcon.type).toBe("fluent:beaker-24-filled");
    expect(labIcon.color).toBe("error");
  });
});
