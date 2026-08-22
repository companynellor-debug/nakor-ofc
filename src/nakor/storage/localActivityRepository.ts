import type { Activity, ActivityStatus } from '../domain/types';
import type { ActivityRepository } from '../repositories/activityRepository';

const HISTORY_KEY = 'nakor_historico';
const MIGRATION_FLAG = 'nakor_migration_progress_v1_complete';

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

/** Registro legado (mantido no localStorage para não quebrar telas existentes). */
interface LegacyRecord {
  id?: string;
  nome?: string;
  duracao_real?: number;
  duracao_prevista?: number;
  nota?: number | null;
  saidas?: number;
  moedas?: number;
  timestamp?: number;
  timestamp_inicio?: number;
  subtarefas_total?: number;
  subtarefas_concluidas?: number;
  projeto_id?: string | null;
  projeto_nome?: string | null;
  status?: ActivityStatus;
  [key: string]: any;
}

function readRaw(): LegacyRecord[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(records: LegacyRecord[]) {
  if (!hasStorage()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event('nakor_activities_updated'));
}

export function toActivity(record: LegacyRecord): Activity {
  const ts = record.timestamp ?? Date.now();
  const startTs = record.timestamp_inicio ?? ts - (record.duracao_real ?? 0) * 1000;
  return {
    id: String(record.id ?? ts),
    title: record.nome || 'Sessão de Foco',
    projectId: record.projeto_id ?? null,
    projectName: record.projeto_nome ?? null,
    createdAt: new Date(startTs).toISOString(),
    startedAt: new Date(startTs).toISOString(),
    completedAt: new Date(ts).toISOString(),
    plannedDuration: record.duracao_prevista ?? null,
    actualDuration: record.duracao_real ?? 0,
    focusScore:
      record.nota === undefined || record.nota === null || Number.isNaN(Number(record.nota))
        ? null
        : Number(record.nota),
    exitCount: record.saidas ?? 0,
    tasksTotal: record.subtarefas_total ?? 0,
    tasksCompleted: record.subtarefas_concluidas ?? 0,
    coinsEarned: record.moedas ?? 0,
    status: record.status ?? 'completed',
    raw: record,
  };
}

function toLegacy(activity: Activity, previous?: LegacyRecord): LegacyRecord {
  const completedTs = activity.completedAt ? new Date(activity.completedAt).getTime() : Date.now();
  return {
    ...(previous || {}),
    ...(activity.raw || {}),
    id: activity.id,
    nome: activity.title,
    duracao_real: activity.actualDuration,
    duracao_prevista: activity.plannedDuration ?? undefined,
    nota: activity.focusScore ?? null,
    saidas: activity.exitCount ?? 0,
    moedas: activity.coinsEarned ?? 0,
    subtarefas_total: activity.tasksTotal ?? 0,
    subtarefas_concluidas: activity.tasksCompleted ?? 0,
    projeto_id: activity.projectId ?? null,
    projeto_nome: activity.projectName ?? null,
    status: activity.status,
    timestamp: completedTs,
    timestamp_inicio: activity.startedAt ? new Date(activity.startedAt).getTime() : undefined,
  };
}

/**
 * Migração idempotente: apenas completa campos que faltam nos registros antigos.
 * Nunca apaga dados; o formato legado continua legível pelas telas atuais.
 */
export function runActivityMigration() {
  if (!hasStorage()) return;
  if (localStorage.getItem(MIGRATION_FLAG) === '1') return;

  const records = readRaw();
  if (records.length === 0) {
    localStorage.setItem(MIGRATION_FLAG, '1');
    return;
  }

  const migrated = records.map((r, index) => ({
    ...r,
    id: String(r.id ?? `${r.timestamp ?? Date.now()}-${index}`),
    status: (r.status ?? 'completed') as ActivityStatus,
    duracao_real: r.duracao_real ?? 0,
    saidas: r.saidas ?? 0,
    moedas: r.moedas ?? 0,
    projeto_id: r.projeto_id ?? null,
    projeto_nome: r.projeto_nome ?? null,
    timestamp: r.timestamp ?? Date.now(),
  }));

  // Só grava se todos os registros continuam presentes e íntegros.
  if (migrated.length === records.length && migrated.every((m) => !!m.id)) {
    writeRaw(migrated);
    localStorage.setItem(MIGRATION_FLAG, '1');
  }
}

export const localActivityRepository: ActivityRepository = {
  async getAll() {
    runActivityMigration();
    return readRaw()
      .map(toActivity)
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt).getTime() -
          new Date(a.completedAt || a.createdAt).getTime(),
      );
  },

  async getById(id) {
    const found = readRaw().find((r) => String(r.id) === String(id));
    return found ? toActivity(found) : null;
  },

  async create(activity) {
    const records = readRaw();
    records.unshift(toLegacy(activity));
    writeRaw(records);
    return activity;
  },

  async update(id, data) {
    const records = readRaw();
    const index = records.findIndex((r) => String(r.id) === String(id));
    if (index === -1) throw new Error(`Activity ${id} not found`);
    const current = toActivity(records[index]);
    const next: Activity = { ...current, ...data, id: current.id };
    records[index] = toLegacy(next, records[index]);
    writeRaw(records);
    return next;
  },

  async delete(id) {
    const records = readRaw().filter((r) => String(r.id) !== String(id));
    writeRaw(records);
  },
};
