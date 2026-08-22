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

export function readCardPreferences(): CardPreferences {
  const fallback: CardPreferences = { selectedModelId: 'trio', selectedColor: DEFAULT_ACCENT };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      selectedModelId: parsed.layout || parsed.selectedModelId || fallback.selectedModelId,
      selectedColor: parsed.accentColor || parsed.selectedColor || fallback.selectedColor,
    };
  } catch {
    return fallback;
  }
}

export function buildCardTheme(accent: string = DEFAULT_ACCENT): CardTheme {
  return {
    accent,
    accentSoft: hexToRgba(accent, 0.18),
    accentStrong: hexToRgba(accent, 0.85),
    accentGlow: hexToRgba(accent, 0.45),
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.62)',
    background: '#0B0A12',
  };
}
