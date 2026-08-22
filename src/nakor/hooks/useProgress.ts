import { useMemo } from 'react';
import type { ProgressPeriod } from '../domain/types';
import { getProgressSummary, getProjectBreakdown, getWorkGrid } from '../services/progressService';
import { useActivities } from './useActivities';

export function useProgress(period: ProgressPeriod = 'week', gridDays = 35) {
  const { activities, loading, refresh } = useActivities();

  const summary = useMemo(() => getProgressSummary(activities, period), [activities, period]);
  const grid = useMemo(() => getWorkGrid(activities, gridDays), [activities, gridDays]);
  const projects = useMemo(() => getProjectBreakdown(activities), [activities]);

  return { activities, loading, refresh, summary, grid, projects };
}
