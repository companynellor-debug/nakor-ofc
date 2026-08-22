// Utilidades de data — sempre no timezone local do usuário.
// Semana: segunda → domingo.

export function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

export function startOfWeek(d: Date): Date {
  const out = startOfDay(d);
  const day = out.getDay(); // 0 = domingo
  const diff = day === 0 ? 6 : day - 1;
  out.setDate(out.getDate() - diff);
  return out;
}

export function endOfWeek(d: Date): Date {
  const s = startOfWeek(d);
  s.setDate(s.getDate() + 6);
  return endOfDay(s);
}

export function startOfMonth(d: Date): Date {
  const out = startOfDay(d);
  out.setDate(1);
  return out;
}

export function endOfMonth(d: Date): Date {
  const out = startOfMonth(d);
  out.setMonth(out.getMonth() + 1);
  out.setDate(0);
  return endOfDay(out);
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

/** Chave local yyyy-mm-dd (não usa UTC, evita erro perto da meia-noite). */
export function dayKey(d: Date | string | number): string {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

/** Número ISO da semana (usado no Weekly Card). */
export function isoWeekNumber(d: Date): number {
  const date = startOfDay(d);
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

export const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const MONTHS_SHORT_PT = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

export const WEEKDAYS_SHORT_PT = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

/** "28 JUL – 03 AGO" */
export function formatDayMonthShort(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT_PT[d.getMonth()]}`;
}

export function formatRangeShort(a: Date, b: Date): string {
  return `${formatDayMonthShort(a)} – ${formatDayMonthShort(b)}`;
}

export function formatTime(d: Date | string | number): string {
  const date = d instanceof Date ? d : new Date(d);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
