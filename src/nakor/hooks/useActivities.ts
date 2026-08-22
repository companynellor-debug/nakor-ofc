import { useCallback, useEffect, useState } from 'react';
import type { Activity } from '../domain/types';
import { localActivityRepository } from '../storage/localActivityRepository';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await localActivityRepository.getAll();
    setActivities(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('nakor_activities_updated', handler);
    return () => window.removeEventListener('nakor_activities_updated', handler);
  }, [refresh]);

  const updateActivity = useCallback(
    async (id: string, data: Partial<Activity>) => {
      await localActivityRepository.update(id, data);
      await refresh();
    },
    [refresh],
  );

  const deleteActivity = useCallback(
    async (id: string) => {
      await localActivityRepository.delete(id);
      await refresh();
    },
    [refresh],
  );

  return { activities, loading, refresh, updateActivity, deleteActivity };
}
