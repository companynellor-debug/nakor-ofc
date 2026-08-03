// Camada de "banco local" (apenas para testes, sem banco de dados real).
// Guarda contas, marca se o questionário já foi respondido e isola os dados
// de app quando outra conta entra no mesmo navegador.

export interface LocalAccount {
  email: string;
  name: string;
  password: string;
  onboardingDone: boolean;
  onboardingData: any | null;
  createdAt: number;
}

const ACCOUNTS_KEY = 'nakor_accounts';
const ACTIVE_EMAIL_KEY = 'nakor_user_email';
const ACTIVE_NAME_KEY = 'nakor_user';
const DATA_OWNER_KEY = 'nakor_data_owner';

// Chaves de dados do app (histórico, tarefas, moedas, etc.)
const APP_DATA_KEYS = [
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
];

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const normalize = (email: string) => email.trim().toLowerCase();

export function getAccounts(): LocalAccount[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: LocalAccount[]) {
  if (!hasStorage()) return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getAccount(email: string | null | undefined): LocalAccount | null {
  if (!email) return null;
  const target = normalize(email);
  return getAccounts().find((a) => normalize(a.email) === target) || null;
}

export function updateAccount(email: string, patch: Partial<LocalAccount>) {
  const target = normalize(email);
  const accounts = getAccounts().map((a) =>
    normalize(a.email) === target ? { ...a, ...patch } : a,
  );
  saveAccounts(accounts);
}

/** Migra o estado antigo (antes do registro de contas) para uma conta real. */
function migrateLegacyAccount() {
  if (!hasStorage()) return;
  const accounts = getAccounts();
  if (accounts.length > 0) return;
  const legacyEmail = localStorage.getItem(ACTIVE_EMAIL_KEY);
  if (!legacyEmail) return;
  const legacyName = localStorage.getItem(ACTIVE_NAME_KEY) || 'Usuário Nakor';
  let legacyOnboarding: any = null;
  try {
    const raw =
      localStorage.getItem(`nakor_onboarding_${legacyEmail}`) ||
      localStorage.getItem('nakor_onboarding');
    legacyOnboarding = raw ? JSON.parse(raw) : null;
  } catch {
    legacyOnboarding = null;
  }
  saveAccounts([
    {
      email: normalize(legacyEmail),
      name: legacyName,
      password: '',
      onboardingDone: !!legacyOnboarding,
      onboardingData: legacyOnboarding,
      createdAt: Date.now(),
    },
  ]);
  localStorage.setItem(DATA_OWNER_KEY, normalize(legacyEmail));
}

export function initStore() {
  migrateLegacyAccount();
}

export type AuthResult =
  | { ok: true; account: LocalAccount }
  | { ok: false; field: 'email' | 'password'; message: string };

export function registerAccount(
  email: string,
  name: string,
  password: string,
): AuthResult {
  migrateLegacyAccount();
  const target = normalize(email);
  if (getAccount(target)) {
    return {
      ok: false,
      field: 'email',
      message: 'Já existe uma conta com esse e-mail',
    };
  }
  const account: LocalAccount = {
    email: target,
    name: name.trim(),
    password,
    onboardingDone: false,
    onboardingData: null,
    createdAt: Date.now(),
  };
  saveAccounts([...getAccounts(), account]);
  return { ok: true, account };
}

export function loginAccount(email: string, password: string): AuthResult {
  migrateLegacyAccount();
  const account = getAccount(email);
  if (!account) {
    return {
      ok: false,
      field: 'email',
      message: 'Não encontramos uma conta com esse e-mail',
    };
  }
  // Contas migradas do estado antigo não têm senha salva.
  if (account.password && account.password !== password) {
    return { ok: false, field: 'password', message: 'Senha incorreta' };
  }
  return { ok: true, account };
}

export function clearAppData() {
  if (!hasStorage()) return;
  APP_DATA_KEYS.forEach((k) => localStorage.removeItem(k));
}

/**
 * Garante que os dados de app pertencem à conta ativa.
 * Se outra conta usou o navegador antes, limpa os dados para não misturar.
 */
export function ensureDataOwner(email: string) {
  if (!hasStorage()) return;
  const target = normalize(email);
  const owner = localStorage.getItem(DATA_OWNER_KEY);
  if (owner !== target) {
    clearAppData();
    localStorage.setItem(DATA_OWNER_KEY, target);
  }
}

export function setActiveAccount(account: LocalAccount) {
  if (!hasStorage()) return;
  localStorage.setItem(ACTIVE_EMAIL_KEY, account.email);
  if (account.name) localStorage.setItem(ACTIVE_NAME_KEY, account.name);
  ensureDataOwner(account.email);
  if (account.onboardingData) {
    localStorage.setItem('nakor_onboarding', JSON.stringify(account.onboardingData));
  }
}

export function getActiveEmail(): string | null {
  if (!hasStorage()) return null;
  migrateLegacyAccount();
  return localStorage.getItem(ACTIVE_EMAIL_KEY);
}

export function clearActiveAccount() {
  if (!hasStorage()) return;
  localStorage.removeItem(ACTIVE_EMAIL_KEY);
}

export function completeOnboarding(email: string, data: any) {
  updateAccount(email, { onboardingDone: true, onboardingData: data });
  if (hasStorage()) {
    localStorage.setItem('nakor_onboarding', JSON.stringify(data));
    if (data?.name) localStorage.setItem(ACTIVE_NAME_KEY, data.name);
  }
}

export function resetOnboarding(email: string) {
  updateAccount(email, { onboardingDone: false, onboardingData: null });
  if (hasStorage()) localStorage.removeItem('nakor_onboarding');
}

/** Apaga tudo (contas + dados) — usado no "limpar dados de teste". */
export function wipeEverything() {
  if (!hasStorage()) return;
  clearAppData();
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(ACTIVE_EMAIL_KEY);
  localStorage.removeItem(ACTIVE_NAME_KEY);
  localStorage.removeItem(DATA_OWNER_KEY);
}
