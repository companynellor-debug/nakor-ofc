import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useT } from '../lib/i18n';
import { NakorLogo } from './NakorLogo';

const MESSAGES = [
  'Ajustando seu ritmo de foco',
  'Preparando suas sessões de work',
  'Configurando seu card de resultado',
  'Deixando o Nakor com a sua cara',
  'Tudo pronto para começar',
];

interface LoadingPreparationProps {
  accent: string;
  onDone: () => void;
  /** duração total em ms */
  duration?: number;
}

export function LoadingPreparation({ accent, onDone, duration = 3600 }: LoadingPreparationProps) {
  const t = useT();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / duration) * 100);
      setProgress(pct);
      setMessageIndex(Math.min(MESSAGES.length - 1, Math.floor((pct / 100) * MESSAGES.length)));
      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(onDone, 420);
      }
    }, 60);
    return () => clearInterval(tick);
  }, [duration, onDone]);

  const R = 78;
  const C = 2 * Math.PI * R;

  return (
    <div className="fixed inset-0 z-[100] bg-[#08070E] flex flex-col items-center justify-center px-8 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[70vh] rounded-full blur-[120px] opacity-50 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 90px ${accent}55` }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.96, 1.02, 0.96] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (progress / 100) * C}
              style={{ transition: 'stroke-dashoffset 120ms linear', filter: `drop-shadow(0 0 10px ${accent})` }}
            />
          </svg>
          <motion.div
            className="absolute w-[132px] h-[132px] rounded-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle at 30% 25%, ${accent}55, rgba(255,255,255,0.04))` }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <NakorLogo size={54} />
          </motion.div>
        </div>

        <p className="mt-8 font-display text-[26px] font-bold text-white tracking-tight text-center">
          {t('Preparando sua Nakor')}
        </p>

        <div className="h-8 mt-2 overflow-hidden">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[13.5px] font-medium text-white/60 text-center"
          >
            {t(MESSAGES[messageIndex])}
          </motion.p>
        </div>

        <p className="mt-3 text-[12px] font-bold tabular-nums" style={{ color: accent }}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
