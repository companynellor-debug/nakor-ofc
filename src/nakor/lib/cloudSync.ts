// Sincronização dos dados do usuário com o backend (Lovable Cloud).
// Estratégia: as telas continuam lendo/gravando no localStorage; esta camada
// carrega o estado da nuvem no login e envia de volta (debounce) a cada mudança.

import { supabase } from '@/integrations/supabase/client';

/** Chaves do app que representam os dados do usuário. */
export const SYNC_KEYS = [
  'nakor_historico',
  'nakor_tarefas',
  'nakor_coins',
  'nakor_resgatados',
  'nakor_seals_notified',
  'nakor_atividade_atual',
  'nakor_avaliacao',
  'nakor_avatar',
  'nakor_onboarding',
  'nakor_estilo_cards',
  'nakor_notificacoes',
  'nakor_user',
] as const;

export interface CloudProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  onboarding_done: boolean;
  onboarding_data: any | null;
}

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

function snapshot(): Record<string, string> {
  const out: Record<string, string> = {};
  if (!hasStorage()) return out;
  SYNC_KEYS.forEach((k) => {
    const v = localStorage.getItem(k);
    if (v !== null) out[k] = v;
  });
  return out;
}

function applySnapshot(state: Record<string, any> | null | undefined) {
  if (!hasStorage()) return;
  SYNC_KEYS.forEach((k) => localStorage.removeItem(k));
  if (!state) return;
  Object.entries(state).forEach(([k, v]) => {
    if (!(SYNC_KEYS as readonly string[]).includes(k)) return;
    if (v === null || v === undefined) return;
    localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  });
}

/** Garante que o perfil e o estado existam e devolve o perfil. */
export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: any;
}): Promise<CloudProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, email, name, avatar_url, onboarding_done, onboarding_data')
    .eq('id', user.id)
    .maybeSingle();

  if (data) return data as CloudProfile;

  const meta = user.user_metadata || {};
  const fallbackName =
    meta.name || meta.full_name || (user.email ? user.email.split('@')[0] : 'Usuário Nakor');

  const { data: created } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email ?? null,
      name: fallbackName,
      avatar_url: meta.avatar_url ?? null,
    })
    .select('id, email, name, avatar_url, onboarding_done, onboarding_data')
    .maybeSingle();

  return (created as CloudProfile) ?? null;
}

/** Carrega perfil + estado da nuvem para o localStorage. */
export async function loadUserData(user: {
  id: string;
  email?: string | null;
  user_metadata?: any;
}): Promise<CloudProfile | null> {
  const profile = await ensureProfile(user);

  const { data: row } = await supabase
    .from('user_app_state')
    .select('state')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!row) {
    // primeira vez neste backend: cria a linha com o que existir localmente
    await supabase
      .from('user_app_state')
      .upsert({ user_id: user.id, state: snapshot() }, { onConflict: 'user_id' });
  } else {
    applySnapshot((row.state as Record<string, any>) ?? {});
  }

  if (hasStorage()) {
    localStorage.setItem('nakor_user_email', profile?.email || user.email || '');
    if (profile?.name) localStorage.setItem('nakor_user', profile.name);
    if (profile?.avatar_url && !localStorage.getItem('nakor_avatar')) {
      localStorage.setItem('nakor_avatar', profile.avatar_url);
    }
    if (profile?.onboarding_data) {
      localStorage.setItem('nakor_onboarding', JSON.stringify(profile.onboarding_data));
    }
  }

  return profile;
}

let activeUserId: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let patched = false;
let originalSetItem: ((k: string, v: string) => void) | null = null;
let originalRemoveItem: ((k: string) => void) | null = null;

async function push() {
  if (!activeUserId) return;
  const uid = activeUserId;
  try {
    await supabase
      .from('user_app_state')
      .upsert({ user_id: uid, state: snapshot() }, { onConflict: 'user_id' });
  } catch {
    // silencioso: falha de rede não deve quebrar a UI
  }
}

export function scheduleSync() {
  if (!activeUserId) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void push();
  }, 700);
}

/** Envia imediatamente o estado atual. */
export async function flushSync() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  await push();
}

/** Passa a observar o localStorage e sincronizar automaticamente. */
export function startAutoSync(userId: string) {
  activeUserId = userId;
  if (!hasStorage() || patched) return;

  const storage = window.localStorage;
  originalSetItem = storage.setItem.bind(storage);
  originalRemoveItem = storage.removeItem.bind(storage);

  storage.setItem = (key: string, value: string) => {
    originalSetItem!(key, value);
    if ((SYNC_KEYS as readonly string[]).includes(key)) scheduleSync();
  };
  storage.removeItem = (key: string) => {
    originalRemoveItem!(key);
    if ((SYNC_KEYS as readonly string[]).includes(key)) scheduleSync();
  };
  patched = true;

  window.addEventListener('beforeunload', () => {
    void flushSync();
  });
}

export function stopAutoSync() {
  activeUserId = null;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

/** Limpa os dados locais do app (usado no logout / troca de conta). */
export function clearLocalAppData() {
  if (!hasStorage()) return;
  SYNC_KEYS.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem('nakor_user_email');
}

/** Salva o questionário inicial no perfil. */
export async function saveOnboarding(userId: string, data: any) {
  if (hasStorage()) {
    localStorage.setItem('nakor_onboarding', JSON.stringify(data));
    if (data?.name) localStorage.setItem('nakor_user', data.name);
  }
  await supabase
    .from('profiles')
    .update({
      onboarding_done: true,
      onboarding_data: data,
      ...(data?.name ? { name: data.name } : {}),
    })
    .eq('id', userId);
  await flushSync();
}

/** Marca o questionário como não respondido (refazer). */
export async function resetOnboardingCloud(userId: string) {
  if (hasStorage()) localStorage.removeItem('nakor_onboarding');
  await supabase
    .from('profiles')
    .update({ onboarding_done: false, onboarding_data: null })
    .eq('id', userId);
}
