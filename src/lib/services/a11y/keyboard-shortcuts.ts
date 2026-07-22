import type { MessageKey } from "$lib/services/i18n";

export type ShortcutContext = "general" | "lab" | "talk" | "notebook";

export interface ShortcutDefinition {
  keys: string[];
  descriptionKey: MessageKey;
}

export interface ShortcutCategory {
  titleKey: MessageKey;
  context: ShortcutContext;
  shortcuts: ShortcutDefinition[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    titleKey: "shortcuts.general",
    context: "general",
    shortcuts: [
      { keys: ["?"], descriptionKey: "shortcuts.showShortcuts" },
      { keys: ["Esc"], descriptionKey: "shortcuts.closeOverlay" },
      { keys: ["F"], descriptionKey: "shortcuts.focusMode" },
      { keys: ["T"], descriptionKey: "shortcuts.backToTop" }
    ]
  },
  {
    titleKey: "shortcuts.lab",
    context: "lab",
    shortcuts: [
      { keys: ["→", "↓"], descriptionKey: "shortcuts.nextStep" },
      { keys: ["←", "↑"], descriptionKey: "shortcuts.prevStep" }
    ]
  },
  {
    titleKey: "shortcuts.talk",
    context: "talk",
    shortcuts: [
      { keys: ["→"], descriptionKey: "shortcuts.nextSlide" },
      { keys: ["←"], descriptionKey: "shortcuts.prevSlide" }
    ]
  },
  {
    titleKey: "shortcuts.notebook",
    context: "notebook",
    shortcuts: [
      { keys: ["→", "↓"], descriptionKey: "shortcuts.nextCell" },
      { keys: ["←", "↑"], descriptionKey: "shortcuts.prevCell" }
    ]
  }
];

function getShortcutContext(loType?: string): ShortcutContext | null {
  switch (loType) {
    case "lab":
    case "step":
      return "lab";
    case "talk":
    case "paneltalk":
      return "talk";
    case "notebook":
      return "notebook";
    default:
      return null;
  }
}

export function getActiveCategories(loType?: string): ShortcutCategory[] {
  const context = getShortcutContext(loType);
  return SHORTCUT_CATEGORIES.filter((cat) => cat.context === "general" || cat.context === context);
}
