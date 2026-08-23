import { useEffect, useMemo, useState } from 'react';
import type { CardPreferences } from '../domain/types';
import { buildCardTheme, readCardPreferences } from '../services/cardTheme';

export function useCardPreferences() {
  const [prefs, setPrefs] = useState<CardPreferences>({
    selectedModelId: 'session',
    selectedColor: '#7C3AED',
    bgOpacity: 100,
  });


  useEffect(() => {
    setPrefs(readCardPreferences());
    const handler = () => setPrefs(readCardPreferences());
    window.addEventListener('storage', handler);
    window.addEventListener('nakor_card_prefs_updated', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('nakor_card_prefs_updated', handler);
    };
  }, []);

  const theme = useMemo(() => buildCardTheme(prefs.selectedColor, prefs.bgOpacity), [prefs.selectedColor, prefs.bgOpacity]);

  return { prefs, theme };
}
