// Persistência 100% local (sem banco de dados).
// As telas continuam lendo/gravando no localStorage; esta camada só organiza
// o perfil e o estado por usuário, mantendo a mesma API usada pelo app.

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
const profileKey = (userId: string) => `nakor_profile_${userId}`;

function readProfile(userId: string): CloudProfile | null {
  if (!hasStorage()) return null;
  try {
    const raw = localStorage.getItem(profileKey(userId));
    return raw ? (JSON.parse(raw) as CloudProfile) : null;
  } catch {
    return null;
  }
}

function writeProfile(profile: CloudProfile) {
  if (hasStorage()) localStorage.setItem(profileKey(profile.id), JSON.stringify(profile));
}

/** Garante que o perfil exista localmente e devolve ele. */
export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: any;
}): Promise<CloudProfile | null> {
  const existing = readProfile(user.id);
  if (existing) return existing;

  const meta = user.user_metadata || {};
  const created: CloudProfile = {
    id: user.id,
    email: user.email ?? null,
    name:
      meta.name || meta.full_name || (user.email ? user.email.split('@')[0] : 'Usuário Nakor'),
    avatar_url: meta.avatar_url ?? null,
    onboarding_done: false,
    onboarding_data: null,
  };
  writeProfile(created);
  return created;
}

/** Carrega o perfil salvo e prepara o localStorage do app. */
export async function loadUserData(user: {
  id: string;
  email?: string | null;
  user_metadata?: any;
}): Promise<CloudProfile | null> {
  const profile = await ensureProfile(user);

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

export function scheduleSync() {
  // sem backend: os dados já ficam salvos no localStorage
}

/** Compatibilidade: nada para enviar, os dados já estão salvos localmente. */
export async function flushSync() {
  /* no-op */
}

export function startAutoSync(userId: string) {
  activeUserId = userId;
}

export function stopAutoSync() {
  activeUserId = null;
}

/** Limpa os dados locais do app (usado no logout / troca de conta). */
export function clearLocalAppData() {
  if (!hasStorage()) return;
  SYNC_KEYS.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem('nakor_user_email');
}

/** Salva o questionário inicial no perfil local. */
export async function saveOnboarding(userId: string, data: any) {
  if (hasStorage()) {
    localStorage.setItem('nakor_onboarding', JSON.stringify(data));
    if (data?.name) localStorage.setItem('nakor_user', data.name);
  }
  const profile =
    readProfile(userId) ??
    ({
      id: userId,
      email: hasStorage() ? localStorage.getItem('nakor_user_email') : null,
      name: data?.name ?? null,
      avatar_url: null,
      onboarding_done: false,
      onboarding_data: null,
    } as CloudProfile);

  writeProfile({
    ...profile,
    onboarding_done: true,
    onboarding_data: data,
    ...(data?.name ? { name: data.name } : {}),
  });
}

/** Marca o questionário como não respondido (refazer). */
export async function resetOnboardingCloud(userId: string) {
  if (hasStorage()) localStorage.removeItem('nakor_onboarding');
  const profile = readProfile(userId);
  if (profile) writeProfile({ ...profile, onboarding_done: false, onboarding_data: null });
}

/** Atualiza nome/avatar do perfil local. */
export async function updateLocalProfile(
  userId: string,
  patch: { name?: string; avatar_url?: string | null },
) {
  const profile = readProfile(userId);
  if (profile) writeProfile({ ...profile, ...patch });
}

/** Remove o perfil e o estado local do usuário. */
export function deleteLocalProfile(userId: string) {
  if (hasStorage()) localStorage.removeItem(profileKey(userId));
  clearLocalAppData();
}
