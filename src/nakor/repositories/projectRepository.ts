import type { Project } from '../domain/types';

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}
