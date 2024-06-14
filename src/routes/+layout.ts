import type { LayoutLoad } from './$types';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { loadTranslations, setLocale } from '$lib/translations';

export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
  depends('supabase:auth');

  const initLocale = url.searchParams.get('lang') || 'en';
  const { pathname } = url;

  console.log('Loading translations for locale:', initLocale, 'on pathname:', pathname);
  setLocale(initLocale);
  await loadTranslations(initLocale, pathname);

  if (PUBLIC_SUPABASE_URL !== 'XXX') {
    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global: {
        fetch,
      },
      cookies: {
        get(key) {
          if (!isBrowser()) {
            return JSON.stringify(data.session);
          }

          const cookie = parse(document.cookie);
          return cookie[key];
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return { supabase, session };
  }
};
