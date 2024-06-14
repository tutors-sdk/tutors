import i18n from 'sveltekit-i18n';
import type { Config } from 'sveltekit-i18n';
import type { Translation } from './types';

const config: Config = {
  loaders: [
    {
      locale: 'en',
      key: 'common',
      loader: async () => {
        console.log('Loading English translations');
        const module = await import('./en/common.json');
        return module.default as Translation;
      },
    },
    {
      locale: 'fr',
      key: 'common',
      loader: async () => {
        console.log('Loading French translations');
        const module = await import('./fr/common.json');
        return module.default as Translation;
      },
    },
    {
      locale: 'de',
      key: 'common',
      loader: async () => {
        console.log('Loading German translations');
        const module = await import('./de/common.json');
        return module.default as Translation;
      },
    },
    {
      locale: 'it',
      key: 'common',
      loader: async () => {
        console.log('Loading Italian translations');
        const module = await import('./it/common.json');
        return module.default as Translation;
      },
    },
    {
      locale: 'es',
      key: 'common',
      loader: async () => {
        console.log('Loading Spanish translations');
        const module = await import('./es/common.json');
        return module.default as Translation;
      },
    },
  ],
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

export function setLocale(newLocale: string) {
  console.log('Setting locale:', newLocale);
  locale.set(newLocale);
}
