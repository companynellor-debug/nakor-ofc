import type { CardPreferences, CardTheme } from '../domain/types';

const PREFS_KEY = 'nakor_estilo_cards';
const DEFAULT_ACCENT = '#7C3AED';

export function hexToRgba(hex: string, alpha: number): string {
  const clean = (hex || DEFAULT_ACCENT).replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const VALID_MODEL_IDS = ['unificado', 'aura', 'session', 'weekly', 'monthly'];

export function readCardPreferences(): CardPreferences {
  const fallback: CardPreferences = { selectedModelId: 'unificado', selectedColor: DEFAULT_ACCENT, bgOpacity: 100 };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const model = parsed.selectedModelId || parsed.layout;
    return {
      selectedModelId: VALID_MODEL_IDS.includes(model) ? model : fallback.selectedModelId,
      selectedColor: parsed.selectedColor || parsed.accentColor || fallback.selectedColor,
      bgOpacity: Math.min(100, Math.max(35, Number(parsed.bgOpacity) || 100)),
    };
  } catch {
    return fallback;
  }
}

/** Salva modelo + cor (mantém as chaves legadas para compatibilidade). */
export function saveCardPreferences(prefs: CardPreferences) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    const previous = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({
        ...previous,
        selectedModelId: prefs.selectedModelId,
        selectedColor: prefs.selectedColor,
        layout: prefs.selectedModelId,
        accentColor: prefs.selectedColor,
        bgOpacity: prefs.bgOpacity ?? previous.bgOpacity ?? 100,
      }),
    );
    window.dispatchEvent(new Event('nakor_card_prefs_updated'));
  } catch {
    /* ignora */
  }
}


export function buildCardTheme(accent: string = DEFAULT_ACCENT, backgroundOpacity = 100): CardTheme {
  const normalizedOpacity = Math.min(100, Math.max(35, backgroundOpacity)) / 100;
  return {
    accent,
    accentSoft: hexToRgba(accent, 0.18),
    accentStrong: hexToRgba(accent, 0.85),
    accentGlow: hexToRgba(accent, 0.45),
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.62)',
    background: `rgba(11,10,18,${normalizedOpacity})`,
    backgroundOpacity: normalizedOpacity,
  };
}
