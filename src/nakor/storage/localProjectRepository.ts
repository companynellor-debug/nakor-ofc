import type { Project } from '../domain/types';
import type { ProjectRepository } from '../repositories/projectRepository';

const KEY = 'nakor_projetos_v1';
const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

function read(): Project[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(projects: Project[]) {
  if (!hasStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event('nakor_projects_updated'));
}

export const localProjectRepository: ProjectRepository = {
  async getAll() {
    return read().filter((p) => !p.archived);
  },

  async getById(id) {
    return read().find((p) => p.id === id) ?? null;
  },

  async create(project) {
    const projects = read();
    const existing = projects.find(
      (p) => p.name.trim().toLowerCase() === project.name.trim().toLowerCase(),
    );
    if (existing) return existing;
    projects.push(project);
    write(projects);
    return project;
  },

  async update(id, data) {
    const projects = read();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project ${id} not found`);
    projects[index] = { ...projects[index], ...data, id };
    write(projects);
    return projects[index];
  },

  async delete(id) {
    write(read().filter((p) => p.id !== id));
  },
};

export function createProjectDraft(name: string): Project {
  return {
    id: `prj_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    archived: false,
  };
}
