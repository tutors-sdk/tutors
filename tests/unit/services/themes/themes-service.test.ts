vi.mock("$lib/services/themes/events/festive.svelte", () => ({
  makeItSnow: vi.fn(),
  makeItStopSnowing: vi.fn()
}));

const { themeService } = await import("$lib/services/themes/services/themes.svelte");

describe("themeService", () => {
  beforeEach(() => {
    localStorage.clear();
    themeService.isSnowing = false;
    themeService.currentTheme.value = "tutors";
    themeService.lightMode.value = "light";
    themeService.layout.value = "expanded";
    themeService.cardStyle.value = "portrait";
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");
  });

  describe("setDisplayMode", () => {
    it("sets light mode", () => {
      themeService.setDisplayMode("light");
      expect(themeService.lightMode.value).toBe("light");
      expect(localStorage.modeCurrent).toBe("light");
    });

    it("sets dark mode and adds class", () => {
      themeService.setDisplayMode("dark");
      expect(themeService.lightMode.value).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes dark class when switching to light", () => {
      themeService.setDisplayMode("dark");
      themeService.setDisplayMode("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("defaults to light when mode is falsy", () => {
      themeService.setDisplayMode("");
      expect(themeService.lightMode.value).toBe("light");
    });

    it("persists mode to localStorage", () => {
      themeService.setDisplayMode("dark");
      expect(localStorage.modeCurrent).toBe("dark");
    });
  });

  describe("toggleDisplayMode", () => {
    it("switches from light to dark", () => {
      themeService.lightMode.value = "light";
      themeService.toggleDisplayMode();
      expect(themeService.lightMode.value).toBe("dark");
    });

    it("switches from dark to light", () => {
      themeService.lightMode.value = "dark";
      themeService.toggleDisplayMode();
      expect(themeService.lightMode.value).toBe("light");
    });
  });

  describe("setTheme", () => {
    it("sets a valid theme", () => {
      themeService.setTheme("classic");
      expect(themeService.currentTheme.value).toBe("classic");
    });

    it("defaults to tutors when theme is empty", () => {
      themeService.setTheme("");
      expect(themeService.currentTheme.value).toBe("tutors");
    });

    it("persists theme to localStorage", () => {
      themeService.setTheme("classic");
      expect(localStorage.theme).toBe("classic");
    });

    it("sets data-theme attribute on documentElement", () => {
      themeService.setTheme("rose");
      expect(document.documentElement.getAttribute("data-theme")).toBe("rose");
    });
  });

  describe("setLayout", () => {
    it("sets expanded layout", () => {
      themeService.setLayout("expanded");
      expect(themeService.layout.value).toBe("expanded");
      expect(localStorage.layout).toBe("expanded");
    });

    it("sets compacted layout", () => {
      themeService.setLayout("compacted");
      expect(themeService.layout.value).toBe("compacted");
    });

    it("defaults to expanded when layout is falsy", () => {
      themeService.setLayout("" as any);
      expect(themeService.layout.value).toBe("expanded");
    });
  });

  describe("toggleLayout", () => {
    it("switches from expanded to compacted", () => {
      themeService.layout.value = "expanded";
      themeService.toggleLayout();
      expect(themeService.layout.value).toBe("compacted");
    });

    it("switches from compacted to expanded", () => {
      themeService.layout.value = "compacted";
      themeService.toggleLayout();
      expect(themeService.layout.value).toBe("expanded");
    });
  });

  describe("setCardStyle", () => {
    it("sets portrait style", () => {
      themeService.setCardStyle("portrait");
      expect(themeService.cardStyle.value).toBe("portrait");
      expect(localStorage.cardStyle).toBe("portrait");
    });

    it("defaults to portrait when style is falsy", () => {
      themeService.setCardStyle("" as any);
      expect(themeService.cardStyle.value).toBe("portrait");
    });
  });

  describe("getIcon", () => {
    it("returns an icon from the current theme", () => {
      themeService.currentTheme.value = "tutors";
      const icon = themeService.getIcon("tutors");
      expect(icon).toBeDefined();
      expect(icon.type).toBeDefined();
      expect(icon.color).toBeDefined();
    });

    it("returns default icon for unknown type", () => {
      const icon = themeService.getIcon("nonexistent-type");
      expect(icon).toBeDefined();
    });
  });

  describe("eventTrigger", () => {
    it("sets isSnowing to true for festive theme", () => {
      themeService.currentTheme.value = "festive";
      themeService.eventTrigger();
      expect(themeService.isSnowing).toBe(true);
    });

    it("sets isSnowing to false when switching away from festive", () => {
      themeService.isSnowing = true;
      themeService.currentTheme.value = "tutors";
      themeService.eventTrigger();
      expect(themeService.isSnowing).toBe(false);
    });

    it("does not change isSnowing for non-festive theme when not snowing", () => {
      themeService.isSnowing = false;
      themeService.currentTheme.value = "tutors";
      themeService.eventTrigger();
      expect(themeService.isSnowing).toBe(false);
    });
  });
});
