// Autenticação 100% local (sem banco de dados).
// Mantém a mesma superfície usada pelo app (`supabase.auth.*`) para que as telas
// continuem funcionando enquanto o banco definitivo é implementado fora daqui.

type LocalUser = {
  id: string;
  email: string;
  user_metadata: { name?: string; avatar_url?: string | null };
};

type StoredUser = LocalUser & { password: string };

const USERS_KEY = 'nakor_local_users';
const SESSION_KEY = 'nakor_local_session';

const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;

function readUsers(): StoredUser[] {
  if (!hasStorage()) return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  if (hasStorage()) localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(u: StoredUser): LocalUser {
  const { password: _pw, ...rest } = u;
  return rest;
}

function readSession(): { user: LocalUser } | null {
  if (!hasStorage()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { user: LocalUser }) : null;
  } catch {
    return null;
  }
}

function writeSession(user: LocalUser | null) {
  if (!hasStorage()) return;
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
  else localStorage.removeItem(SESSION_KEY);
}

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';
const listeners = new Set<(event: AuthEvent, session: { user: LocalUser } | null) => void>();

function emit(event: AuthEvent) {
  const session = readSession();
  listeners.forEach((cb) => cb(event, session));
}

const ok = <T,>(data: T) => ({ data, error: null as null | { message: string } });
const fail = (message: string) => ({
  data: { user: null, session: null },
  error: { message },
});

export const localAuth = {
  auth: {
    async getSession() {
      return ok({ session: readSession() });
    },

    async getUser() {
      return ok({ user: readSession()?.user ?? null });
    },

    async signUp(params: {
      email: string;
      password: string;
      options?: { data?: { name?: string } };
    }) {
      const email = params.email.trim().toLowerCase();
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        return fail('Já existe uma conta com esse e-mail');
      }
      const user: StoredUser = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `local-${Date.now()}`,
        email,
        password: params.password,
        user_metadata: {
          name: params.options?.data?.name || email.split('@')[0],
          avatar_url: null,
        },
      };
      writeUsers([...users, user]);
      const pub = publicUser(user);
      writeSession(pub);
      emit('SIGNED_IN');
      return ok({ user: pub, session: { user: pub } });
    },

    async signInWithPassword(params: { email: string; password: string }) {
      const email = params.email.trim().toLowerCase();
      const found = readUsers().find((u) => u.email === email);
      if (!found || found.password !== params.password) {
        return fail('E-mail ou senha incorretos');
      }
      const pub = publicUser(found);
      writeSession(pub);
      emit('SIGNED_IN');
      return ok({ user: pub, session: { user: pub } });
    },

    async updateUser(updates: {
      email?: string;
      password?: string;
      data?: { name?: string; avatar_url?: string | null };
    }) {
      const current = readSession()?.user;
      if (!current) return fail('Sessão expirada. Entre novamente.');

      const users = readUsers();
      const idx = users.findIndex((u) => u.id === current.id);
      if (idx < 0) return fail('Sessão expirada. Entre novamente.');

      const nextEmail = updates.email?.trim().toLowerCase();
      if (nextEmail && users.some((u) => u.email === nextEmail && u.id !== current.id)) {
        return fail('Já existe uma conta com esse e-mail');
      }

      const updated: StoredUser = {
        ...users[idx],
        ...(nextEmail ? { email: nextEmail } : {}),
        ...(updates.password ? { password: updates.password } : {}),
        user_metadata: { ...users[idx].user_metadata, ...(updates.data ?? {}) },
      };
      users[idx] = updated;
      writeUsers(users);
      const pub = publicUser(updated);
      writeSession(pub);
      emit('USER_UPDATED');
      return ok({ user: pub });
    },

    async signOut() {
      writeSession(null);
      emit('SIGNED_OUT');
      return { error: null };
    },

    /** Remove a conta local do usuário atual. */
    async deleteCurrentUser() {
      const current = readSession()?.user;
      if (current) writeUsers(readUsers().filter((u) => u.id !== current.id));
      writeSession(null);
      emit('SIGNED_OUT');
      return { error: null };
    },

    onAuthStateChange(
      cb: (event: AuthEvent, session: { user: LocalUser } | null) => void,
    ) {
      listeners.add(cb);
      return {
        data: {
          subscription: {
            unsubscribe() {
              listeners.delete(cb);
            },
          },
        },
      };
    },
  },
};
