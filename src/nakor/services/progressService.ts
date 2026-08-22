import type {
  Activity,
  ProgressDailyPoint,
  ProgressPeriod,
  ProgressSummary,
} from '../domain/types';
import {
  addDays,
  dayKey,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '../utils/dates';

/** Somente sessões efetivamente realizadas entram nas métricas. */
function isCounted(a: Activity) {
  return (a.status === 'completed' || a.status === 'cancelled') && a.actualDuration > 0;
}

export function getPeriodRange(period: ProgressPeriod, reference = new Date()) {
  if (period === 'day') return { start: startOfDay(reference), end: endOfDay(reference) };
  if (period === 'week') return { start: startOfWeek(reference), end: endOfWeek(reference) };
  return { start: startOfMonth(reference), end: endOfMonth(reference) };
}

function previousRange(period: ProgressPeriod, reference: Date) {
  const ref = new Date(reference);
  if (period === 'day') return getPeriodRange('day', addDays(ref, -1));
  if (period === 'week') return getPeriodRange('week', addDays(ref, -7));
  const prevMonth = new Date(ref);
  prevMonth.setDate(1);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return getPeriodRange('month', prevMonth);
}

function inRange(a: Activity, start: Date, end: Date) {
  const ts = new Date(a.completedAt || a.createdAt).getTime();
  return ts >= start.getTime() && ts <= end.getTime();
}

function totalTime(activities: Activity[]) {
  return activities.reduce((sum, a) => sum + (a.actualDuration || 0), 0);
}

export function computeStreaks(activities: Activity[]) {
  const days = new Set(
    activities.filter(isCounted).map((a) => dayKey(a.completedAt || a.createdAt)),
  );
  if (days.size === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = Array.from(days).sort();

  // Maior sequência histórica
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    run = diff === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  // Sequência atual (hoje ou ontem mantém a chama viva)
  const today = startOfDay(new Date());
  let cursor = days.has(dayKey(today))
    ? today
    : days.has(dayKey(addDays(today, -1)))
      ? addDays(today, -1)
      : null;

  let current = 0;
  while (cursor && days.has(dayKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

function buildDailyBreakdown(
  activities: Activity[],
  start: Date,
  end: Date,
): ProgressDailyPoint[] {
  const points: ProgressDailyPoint[] = [];
  const map = new Map<string, ProgressDailyPoint>();

  let cursor = startOfDay(start);
  const last = startOfDay(end);
  while (cursor.getTime() <= last.getTime()) {
    const point: ProgressDailyPoint = { date: dayKey(cursor), focusTime: 0, sessions: 0 };
    map.set(point.date, point);
    points.push(point);
    cursor = addDays(cursor, 1);
  }

  activities.forEach((a) => {
    const point = map.get(dayKey(a.completedAt || a.createdAt));
    if (point) {
      point.focusTime += a.actualDuration || 0;
      point.sessions += 1;
    }
  });

  return points;
}

export function getProgressSummary(
  allActivities: Activity[],
  period: ProgressPeriod,
  reference = new Date(),
): ProgressSummary {
  const counted = allActivities.filter(isCounted);
  const { start, end } = getPeriodRange(period, reference);
  const current = counted.filter((a) => inRange(a, start, end));

  const prev = previousRange(period, reference);
  const previous = counted.filter((a) => inRange(a, prev.start, prev.end));

  const currentTime = totalTime(current);
  const previousTime = totalTime(previous);

  const scored = current.filter((a) => typeof a.focusScore === 'number');
  const { currentStreak, longestStreak } = computeStreaks(counted);

  return {
    period,
    rangeStart: start.toISOString(),
    rangeEnd: end.toISOString(),
    totalFocusTime: currentTime,
    sessionCount: current.length,
    activeDays: new Set(current.map((a) => dayKey(a.completedAt || a.createdAt))).size,
    averageFocusScore: scored.length
      ? Math.round((scored.reduce((s, a) => s + (a.focusScore || 0), 0) / scored.length) * 10) / 10
      : null,
    tasksCompleted: current.reduce((s, a) => s + (a.tasksCompleted || 0), 0),
    tasksTotal: current.reduce((s, a) => s + (a.tasksTotal || 0), 0),
    coinsEarned: current.reduce((s, a) => s + (a.coinsEarned || 0), 0),
    currentStreak,
    longestStreak,
    previousPeriodChange:
      previousTime > 0 ? Math.round(((currentTime - previousTime) / previousTime) * 100) : null,
    dailyBreakdown: buildDailyBreakdown(current, start, end),
  };
}

export interface WorkGridCell {
  date: string;
  focusTime: number;
  sessions: number;
  /** 0 = vazio, 1..4 = intensidade crescente */
  level: 0 | 1 | 2 | 3 | 4;
}

/** Grid tipo "contribution graph" dos últimos N dias. */
export function getWorkGrid(allActivities: Activity[], days = 35, reference = new Date()): WorkGridCell[] {
  const counted = allActivities.filter(isCounted);
  const end = startOfDay(reference);
  const start = addDays(end, -(days - 1));
  const breakdown = buildDailyBreakdown(counted, start, endOfDay(end));

  const max = breakdown.reduce((m, p) => Math.max(m, p.focusTime), 0);

  return breakdown.map((p) => {
    let level: WorkGridCell['level'] = 0;
    if (p.focusTime > 0 && max > 0) {
      const ratio = p.focusTime / max;
      level = ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
    }
    return { date: p.date, focusTime: p.focusTime, sessions: p.sessions, level };
  });
}

export function getProjectBreakdown(allActivities: Activity[], start?: Date, end?: Date) {
  const counted = allActivities
    .filter(isCounted)
    .filter((a) => (start && end ? inRange(a, start, end) : true));

  const map = new Map<string, { id: string; name: string; focusTime: number; sessions: number }>();
  counted.forEach((a) => {
    const id = a.projectId || 'sem-projeto';
    const name = a.projectName || 'Sem projeto';
    const entry = map.get(id) || { id, name, focusTime: 0, sessions: 0 };
    entry.focusTime += a.actualDuration || 0;
    entry.sessions += 1;
    map.set(id, entry);
  });

  return Array.from(map.values()).sort((a, b) => b.focusTime - a.focusTime);
}
