// Toda duração é armazenada em SEGUNDOS. Formatação é responsabilidade da UI.

export function durationParts(seconds: number) {
  const total = Math.max(0, Math.round(seconds || 0));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** 9170 -> "2h 32m" | 1500 -> "25m" */
export function formatDuration(seconds: number): string {
  const { hours, minutes } = durationParts(seconds);
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/** 9170 -> "02H 32M" (destaque dos cards) */
export function formatDurationUpper(seconds: number): string {
  const { hours, minutes } = durationParts(seconds);
  return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

/** Partes separadas para tipografia composta (87h 34m). */
export function formatDurationSplit(seconds: number) {
  const { hours, minutes } = durationParts(seconds);
  return { hours: String(hours), minutes: String(minutes).padStart(2, '0') };
}

export function minutesFromSeconds(seconds: number): number {
  return Math.round((seconds || 0) / 60);
}
