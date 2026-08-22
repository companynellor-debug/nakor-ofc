import type { Activity } from '../domain/types';

/**
 * Contrato de persistência de atividades.
 * Hoje existe apenas a implementação local; futuramente um ApiActivityRepository
 * pode substituí-la sem mudar UI, Progress ou Cards.
 */
export interface ActivityRepository {
  getAll(): Promise<Activity[]>;
  getById(id: string): Promise<Activity | null>;
  create(activity: Activity): Promise<Activity>;
  update(id: string, data: Partial<Activity>): Promise<Activity>;
  delete(id: string): Promise<void>;
}
