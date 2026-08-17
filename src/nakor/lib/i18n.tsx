import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DICTIONARY, type Dict } from './i18n-dict';

export type Lang = 'pt' | 'en' | 'es';

export const LANGUAGES: { code: Lang; label: string; short: string; flag: string }[] = [
  { code: 'pt', label: 'Português (BR)', short: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'English (US)', short: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
];

const STORAGE_KEY = 'nakor_lang';

function readLang(): Lang {
  if (typeof window === 'undefined') return 'pt';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'pt' || saved === 'en' || saved === 'es') return saved;
  return 'pt';
}

let currentLang: Lang = 'pt';

function interpolate(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, key) =>
    key in vars ? String(vars[key]) : m,
  );
}

export function translate(
  pt: string,
  lang: Lang = currentLang,
  vars?: Record<string, string | number>,
): string {
  if (lang === 'pt') return interpolate(pt, vars);
  const entry = (DICTIONARY as Dict)[pt];
  const value = entry ? entry[lang] : undefined;
  return interpolate(value || pt, vars);
}

/** Translate outside of React components (uses the last known language). */
export function t(pt: string, vars?: Record<string, string | number>) {
  return translate(pt, currentLang, vars);
}

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (pt: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt');

  useEffect(() => {
    const initial = readLang();
    currentLang = initial;
    setLangState(initial);
  }, []);

  const setLang = useCallback((next: Lang) => {
    currentLang = next;
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event('nakor:langChanged'));
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (pt: string, vars?: Record<string, string | number>) => translate(pt, lang, vars),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // Fallback so components still render outside the provider (e.g. isolated previews)
  return {
    lang: currentLang,
    setLang: () => {},
    t: (pt: string, vars?: Record<string, string | number>) => translate(pt, currentLang, vars),
  };
}

/** Hook returning the translate function: const t = useT(); t('Olá') */
export function useT() {
  return useLanguage().t;
}
