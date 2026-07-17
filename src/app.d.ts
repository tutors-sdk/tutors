// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  const APP_VERSION: string;

  namespace App {
    // interface Error {}
    interface Locals {
      locale: import("$lib/services/i18n").SupportedLocale;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
