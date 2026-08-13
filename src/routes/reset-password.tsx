import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — Nakor" },
      {
        name: "description",
        content: "Defina uma nova senha para acessar sua conta Nakor com segurança.",
      },
      { property: "og:title", content: "Redefinir senha — Nakor" },
      {
        property: "og:description",
        content: "Defina uma nova senha para acessar sua conta Nakor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasSession(!!data.session);
      setReady(true);
    };
    // dá tempo do client processar o token do link de recuperação na URL
    const t = setTimeout(check, 400);
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      if (session) {
        setHasSession(true);
        setReady(true);
      }
    });
    return () => {
      mounted = false;
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.navigate({ to: "/" }), 1600);
  };

  return (
    <div className="min-h-screen bg-[#0B0714] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl">
        <h1 className="text-xl font-bold text-[#16131F]">Redefinir senha</h1>
        <p className="text-sm text-[#5B5766] mt-1.5">
          Escolha uma nova senha para sua conta Nakor.
        </p>

        {done ? (
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <CheckCircle size={16} strokeWidth={1.75} />
            Senha atualizada! Redirecionando...
          </div>
        ) : ready && !hasSession ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-2 text-sm text-red-500 font-semibold">
              <AlertCircle size={16} strokeWidth={1.75} className="mt-0.5" />
              <span>
                Link inválido ou expirado. Solicite um novo e-mail de recuperação na tela de
                login.
              </span>
            </div>
            <button
              onClick={() => router.navigate({ to: "/" })}
              className="w-full bg-gradient-to-r from-[#5B21B6] to-[#34117E] text-white font-bold py-3.5 rounded-xl text-sm cursor-pointer"
            >
              Voltar ao app
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {[
              { value: password, set: setPassword, ph: "nova senha" },
              { value: confirm, set: setConfirm, ph: "confirmar nova senha" },
            ].map((f, i) => (
              <div
                key={i}
                className="relative flex items-center bg-[#FAFAFB] border border-[#ECECF1] focus-within:border-[#6D28D9] rounded-xl transition-all"
              >
                <div className="absolute left-4 text-[#9A96A6]">
                  <Lock size={16} strokeWidth={1.75} />
                </div>
                <input
                  type={show ? "text" : "password"}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full py-4 pl-11 pr-11 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                />
                {i === 0 && (
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 text-[#9A96A6] p-1 cursor-pointer"
                  >
                    {show ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                  </button>
                )}
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                <AlertCircle size={12} strokeWidth={1.75} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full bg-gradient-to-r from-[#5B21B6] to-[#34117E] hover:from-[#6D28D9] hover:to-[#5B21B6] active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
