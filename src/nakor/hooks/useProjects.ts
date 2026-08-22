import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../domain/types';
import { createProjectDraft, localProjectRepository } from '../storage/localProjectRepository';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const refresh = useCallback(async () => {
    setProjects(await localProjectRepository.getAll());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('nakor_projects_updated', handler);
    return () => window.removeEventListener('nakor_projects_updated', handler);
  }, [refresh]);

  const createProject = useCallback(
    async (name: string) => {
      if (!name.trim()) return null;
      const created = await localProjectRepository.create(createProjectDraft(name));
      await refresh();
      return created;
    },
    [refresh],
  );

  const renameProject = useCallback(
    async (id: string, name: string) => {
      await localProjectRepository.update(id, { name: name.trim() });
      await refresh();
    },
    [refresh],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await localProjectRepository.delete(id);
      await refresh();
    },
    [refresh],
  );

  return { projects, refresh, createProject, renameProject, deleteProject };
}
