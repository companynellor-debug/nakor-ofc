import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

export interface TourStep {
  /** Tela do app onde o passo acontece */
  view: string;
  /** Elemento destacado (data-tour="...") — vazio = passo sem alvo (centralizado) */
  target?: string;
  title: string;
  description: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    view: 'home',
    title: 'Bem-vindo ao Nakor',
    description:
      'Em 30 segundos você conhece o essencial: seu foco do dia, as tarefas, os desafios e as coins que você ganha focando.',
  },
  {
    view: 'home',
    target: 'focus-circle',
    title: 'Seu foco de hoje',
    description:
      'Este círculo mostra quanto tempo você já focou hoje. Ele se enche conforme você conclui sessões e brilha ao bater a meta.',
  },
  {
    view: 'home',
    target: 'weekly-goal',
    title: 'Meta semanal',
    description:
      'Acompanhe o total de horas da semana e os dias em que você manteve o foco. Constância aqui vira ofensiva (streak).',
  },
  {
    view: 'home',
    target: 'nav-new_activity',
    title: 'Iniciar uma sessão',
    description:
      'Toque no botão central para criar uma atividade, escolher a duração e entrar no modo foco.',
  },
  {
    view: 'home',
    target: 'nav-tasks',
    title: 'Tarefas e desafios',
    description:
      'Organize suas tarefas do dia e avance nos desafios — cada desafio concluído rende coins extras.',
  },
  {
    view: 'loja',
    target: 'coins-balance',
    title: 'Sistema de coins',
    description:
      'Cada sessão concluída te dá coins. Aqui está o seu saldo e o quanto falta para o próximo prêmio.',
  },
  {
    view: 'loja',
    target: 'products-grid',
    title: 'Troque por recompensas',
    description:
      'Use suas coins para resgatar as recompensas disponíveis. Quanto mais foco, mais opções liberadas.',
  },
  {
    view: 'profile',
    target: 'nav-profile',
    title: 'Seu perfil',
    description:
      'No perfil você ajusta tema, tempo de foco, notificações e o estilo dos cards de resultado que acabou de escolher.',
  },
  {
    view: 'home',
    title: 'Tudo pronto!',
    description:
      'É só isso. Comece criando sua primeira atividade — o resto o Nakor cuida por você.',
  },
];

type Rect = { top: number; left: number; width: number; height: number };

const PAD = 10;

export function GuidedTour({
  currentView,
  onNavigate,
  onFinish,
}: {
  currentView: string;
  onNavigate: (view: string) => void;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const rafRef = useRef<number | null>(null);
  const step = TOUR_STEPS[index];

  // Garante que estamos na tela correta do passo
  useEffect(() => {
    if (step && currentView !== step.view) onNavigate(step.view);
  }, [step, currentView, onNavigate]);

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      setReady(true);
      return true;
    }
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setReady(true);
    return true;
  }, [step]);

  // Espera o elemento aparecer (troca de tela + animação) e mede
  useLayoutEffect(() => {
    setReady(false);
    setRect(null);
    let cancelled = false;
    let tries = 0;

    const attempt = () => {
      if (cancelled) return;
      const el = step?.target
        ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`)
        : null;
      if (el) {
        const r = el.getBoundingClientRect();
        const needsScroll = r.top < 90 || r.bottom > window.innerHeight - 220;
        if (needsScroll) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
      const ok = measure();
      tries += 1;
      if (!ok && tries < 90) {
        rafRef.current = requestAnimationFrame(attempt);
      } else if (ok && tries < 25) {
        // continua remedindo por alguns frames enquanto animações terminam
        rafRef.current = requestAnimationFrame(attempt);
      }
    };
    rafRef.current = requestAnimationFrame(attempt);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [index, step, currentView, measure]);

  // Reage a resize/scroll
  useEffect(() => {
    const handler = () => measure();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [measure]);

  // Bloqueia rolagem do body enquanto o tour está ativo
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const isLast = index === TOUR_STEPS.length - 1;

  const next = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1));
  };
  const back = () => setIndex((i) => Math.max(i - 1, 0));

  // Painéis embaçados ao redor do alvo (mantém o alvo nítido)
  const panels: Rect[] = [];
  if (rect) {
    const top = Math.max(0, rect.top - PAD);
    const left = Math.max(0, rect.left - PAD);
    const right = Math.min(window.innerWidth, rect.left + rect.width + PAD);
    const bottom = Math.min(window.innerHeight, rect.top + rect.height + PAD);
    panels.push({ top: 0, left: 0, width: window.innerWidth, height: top });
    panels.push({
      top: bottom,
      left: 0,
      width: window.innerWidth,
      height: Math.max(0, window.innerHeight - bottom),
    });
    panels.push({ top, left: 0, width: left, height: Math.max(0, bottom - top) });
    panels.push({
      top,
      left: right,
      width: Math.max(0, window.innerWidth - right),
      height: Math.max(0, bottom - top),
    });
  }

  // Posição do cartão de texto
  const cardH = 210;
  let cardTop = 0;
  if (rect) {
    const below = rect.top + rect.height + PAD + 16;
    const above = rect.top - PAD - 16 - cardH;
    cardTop =
      below + cardH < window.innerHeight - 16
        ? below
        : above > 16
          ? above
          : Math.max(16, window.innerHeight - cardH - 16);
  } else {
    cardTop = Math.max(16, window.innerHeight / 2 - cardH / 2);
  }

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#0B0B12]/45 backdrop-blur-[6px] pointer-events-auto" />
    );
  }

  return (
    <div className="fixed inset-0 z-[300] pointer-events-auto select-none" aria-live="polite">
      {/* Fundo embaçado */}
      {rect ? (
        panels.map((p, i) => (
          <div
            key={i}
            className="absolute bg-[#0B0B12]/55 backdrop-blur-[7px]"
            style={{ top: p.top, left: p.left, width: p.width, height: p.height }}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-[#0B0B12]/60 backdrop-blur-[8px]" />
      )}

      {/* Anel de destaque */}
      {rect && (
        <motion.div
          className="absolute rounded-[24px] pointer-events-none"
          initial={false}
          animate={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
          transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.7 }}
          style={{
            boxShadow:
              '0 0 0 2px rgba(196,181,253,0.95), 0 0 0 8px rgba(124,58,237,0.22), 0 0 42px rgba(124,58,237,0.45)',
          }}
        />
      )}

      {/* Botão fechar */}
      <button
        onClick={onFinish}
        aria-label="Pular tutorial"
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Cartão de texto */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="absolute left-4 right-4 mx-auto max-w-[380px]"
          style={{ top: cardTop }}
        >
          <div className="rounded-[26px] bg-white dark:bg-[#171826] border border-black/[0.06] dark:border-white/10 shadow-[0_24px_60px_-18px_rgba(11,11,18,0.65)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6D5BF5] to-[#3A26C4] flex items-center justify-center text-white shrink-0">
                <Sparkles size={14} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#34117E] dark:text-[#C4B5FD] font-bold">
                Tutorial {index + 1}/{TOUR_STEPS.length}
              </span>
            </div>

            <h3 className="text-[18px] font-bold tracking-tight text-[#21222D] dark:text-[#F8F9FA] m-0">
              {step.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-[#6B7280] dark:text-neutral-300 mt-1.5 mb-4">
              {step.description}
            </p>

            {/* Progresso */}
            <div className="flex items-center gap-1.5 mb-4">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-6 bg-[#34117E] dark:bg-[#C4B5FD]'
                      : i < index
                        ? 'w-1.5 bg-[#34117E]/45 dark:bg-[#C4B5FD]/45'
                        : 'w-1.5 bg-black/10 dark:bg-white/15'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {index > 0 && (
                <button
                  onClick={back}
                  className="px-4 h-11 rounded-2xl text-[13px] font-semibold text-[#21222D] dark:text-[#F8F9FA] bg-black/[0.05] dark:bg-white/10 active:scale-95 transition-transform"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={onFinish}
                className="px-3 h-11 rounded-2xl text-[13px] font-medium text-[#9CA3AF] dark:text-neutral-400 active:scale-95 transition-transform"
              >
                Pular
              </button>
              <button
                onClick={next}
                className="flex-1 h-11 rounded-2xl bg-gradient-to-br from-[#6D5BF5] to-[#3A26C4] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_10px_24px_-6px_rgba(79,70,229,0.6)] active:scale-95 transition-transform"
              >
                {isLast ? (
                  <>
                    Começar <Check size={16} />
                  </>
                ) : (
                  <>
                    Próximo <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
