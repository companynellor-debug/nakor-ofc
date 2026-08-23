import { useMemo } from 'react';
import type { Activity } from '../domain/types';
import type { CardRenderData } from '../components/cards/registry';
import { getProgressSummary, getWorkGrid } from '../services/progressService';
import { useActivities } from './useActivities';

/**
 * Constrói os dados reais usados por qualquer modelo de card.
 * `activity` permite forçar a sessão exibida (resultado recém concluído).
 */
export function useCardData(activity?: Activity | null): CardRenderData {
  const { activities } = useActivities();

  return useMemo(() => {
    const weekly = getProgressSummary(activities, 'week');
    const monthly = getProgressSummary(activities, 'month');
    const grid = getWorkGrid(activities, 35);

    const fallbackActivity: Activity =
      activity ||
      activities[0] || {
        id: 'preview',
        title: 'Trabalhar na Nakor',
        projectName: 'Nakor',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        actualDuration: 2700,
        plannedDuration: 3600,
        focusScore: 8.7,
        exitCount: 0,
        tasksTotal: 4,
        tasksCompleted: 3,
        coinsEarned: 60,
        status: 'completed',
      };

    return {
      activity: fallbackActivity,
      weekly,
      monthly,
      grid,
      streak: weekly.currentStreak,
    };
  }, [activities, activity]);
}
