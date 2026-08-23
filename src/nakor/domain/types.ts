// Modelos de domínio da Nakor (Etapa 1).
// Estes tipos são a "fonte de verdade" para histórico, projetos, progresso e cards.
// A UI só conhece estes tipos — nunca o mecanismo de persistência.

export type ActivityStatus =
  | 'planned'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled';

export interface Activity {
  id: string;

  title: string;

  projectId?: string | null;
  projectName?: string | null;

  /** ISO string */
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;

  /** segundos */
  plannedDuration?: number | null;
  /** segundos */
  actualDuration: number;

  focusScore?: number | null;

  exitCount?: number;

  tasksTotal?: number;
  tasksCompleted?: number;

  coinsEarned?: number;

  status: ActivityStatus;

  /** Campos originais preservados (relatos, frase da IA, etc.) */
  raw?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  /** ISO string */
  createdAt: string;
  archived: boolean;
}

export interface ProgressDailyPoint {
  /** yyyy-mm-dd (timezone local) */
  date: string;
  /** segundos */
  focusTime: number;
  sessions: number;
}

export interface ProgressSummary {
  period: ProgressPeriod;
  /** início/fim do período (local) */
  rangeStart: string;
  rangeEnd: string;

  /** segundos */
  totalFocusTime: number;
  sessionCount: number;
  activeDays: number;
  /** null quando nenhuma sessão possui nota */
  averageFocusScore: number | null;
  tasksCompleted: number;
  tasksTotal: number;
  coinsEarned: number;
  currentStreak: number;
  longestStreak: number;
  /** variação % vs período anterior; null quando não há base de comparação */
  previousPeriodChange: number | null;
  dailyBreakdown: ProgressDailyPoint[];
}

export type ProgressPeriod = 'day' | 'week' | 'month';

/* ---------- Cards ---------- */

export type CardVariant = 'normal' | 'compact';

export interface CardModel {
  id: string;
  name: string;
  category: 'session' | 'weekly' | 'monthly' | 'grid';
  unlockType?: 'default' | 'coins' | 'level' | 'milestone';
  unlockValue?: number | string;
}

export interface CardPreferences {
  selectedModelId: string;
  selectedColor: string;
  bgOpacity?: number;
}

export interface CardTheme {
  accent: string;
  accentSoft: string;
  accentStrong: string;
  accentGlow: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  backgroundOpacity: number;
}
