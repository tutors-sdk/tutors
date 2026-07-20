import { rune } from "$lib/runes.svelte";
import en, { type MessageKey } from "./messages/en";
import fr from "./messages/fr";
import de from "./messages/de";
import it from "./messages/it";
import es from "./messages/es";

export const SUPPORTED_LOCALES = ["en", "fr", "de", "it", "es"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type { MessageKey };

const messages: Record<SupportedLocale, Record<string, string>> = { en, fr, de, it, es };

export const locale = rune<SupportedLocale>("en");

export function t(key: MessageKey): string {
  return messages[locale.value]?.[key] ?? messages.en[key] ?? key;
}

export function setLocale(newLocale: SupportedLocale) {
  locale.value = newLocale;
  if (typeof document !== "undefined") {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = newLocale;
  }
}

export function initLocaleFromCookie(cookieHeader?: string): SupportedLocale {
  if (!cookieHeader) return "en";
  const match = cookieHeader.match(/(?:^|;\s*)locale=([a-z]{2})/);
  if (match && SUPPORTED_LOCALES.includes(match[1] as SupportedLocale)) {
    return match[1] as SupportedLocale;
  }
  return "en";
}
