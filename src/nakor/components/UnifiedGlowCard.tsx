import React, { forwardRef } from 'react';
import { Timer, Zap, LogOut } from 'lucide-react';
import { useT } from '../lib/i18n';

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map((c) => c + c).join('');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface UnifiedGlowCardProps {
  accentColor: string;
  title: string;
  minutes: number;
  plannedMinutes: number;
  score: number;
  exits: number;
  streak?: number | string;
  message?: string;
  timeLabel?: string;
}

/**
 * Card único "glow" — inspirado nos cards de atividade estilo iOS:
 * squircle escuro com um brilho forte da cor de destaque subindo do rodapé.
 */
export const UnifiedGlowCard = forwardRef<HTMLDivElement, UnifiedGlowCardProps>(
  function UnifiedGlowCard(
    { accentColor, title, minutes, plannedMinutes, score, exits, streak, message, timeLabel },
    ref
  ) {
    const t = useT();
    const progress = plannedMinutes > 0 ? Math.min(1, minutes / plannedMinutes) : minutes > 0 ? 1 : 0;
    const isBright = accentColor.toUpperCase() === '#FFFFFF';
    const onAccent = isBright ? '#0B0B0F' : '#0B0B0F';

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '1 / 1',
          borderRadius: '52px',
          overflow: 'hidden',
          backgroundColor: '#0A0A0C',
          boxShadow: `0 30px 70px -20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.6)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '26px',
          margin: '0 auto',
        }}
      >
        {/* Glow principal subindo do rodapé */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(120% 85% at 50% 108%, ${hexToRgba(accentColor, 0.98)} 0%, ${hexToRgba(accentColor, 0.55)} 38%, ${hexToRgba(accentColor, 0.12)} 66%, rgba(10,10,12,0) 85%)`,
            borderRadius: 'inherit',
          }}
        />
        {/* Brilho lateral suave */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(80% 60% at 95% 30%, ${hexToRgba(accentColor, 0.22)} 0%, rgba(10,10,12,0) 70%)`,
            borderRadius: 'inherit',
          }}
        />
        {/* Borda interna de vidro */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.07)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <p
                  className="text-white font-bold text-[19px] leading-tight truncate m-0 whitespace-nowrap"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                >
                  {title}
                </p>
                <p className="text-white/60 text-[12px] leading-tight m-0 mt-0.5 truncate whitespace-nowrap">
                  {streak ? (Number(streak) === 1 ? t('{n} dia de foco', { n: streak }) : t('{n} dias de foco', { n: streak })) : t('Sessão de foco')}
                </p>
              </div>
            </div>
            <span className="text-white/70 text-[12px] font-medium shrink-0 mt-1 whitespace-nowrap">
              {timeLabel || ''}
            </span>

          </div>

          {/* Stats row */}
          <div className="flex items-start gap-6 mt-5">
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-white font-bold text-[24px] leading-none">
                <Timer size={15} strokeWidth={2.5} className="opacity-80" />
                {minutes}
              </span>
              <span className="text-white/55 text-[11px] mt-1">{t('min')}</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-white font-bold text-[24px] leading-none">
                <Zap size={15} strokeWidth={2.5} className="opacity-80" />
                {score ? score.toFixed(1) : '—'}
              </span>
              <span className="text-white/55 text-[11px] mt-1">{t('nota')}</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-white font-bold text-[24px] leading-none">
                <LogOut size={15} strokeWidth={2.5} className="opacity-80" />
                {exits}
              </span>
              <span className="text-white/55 text-[11px] mt-1">{t('saídas')}</span>
            </div>
          </div>

          {/* Progress bar listrada */}
          <div
            className="w-full mt-5 relative"
            style={{
              height: '46px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.16)',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${Math.max(8, progress * 100)}%`,
                borderRadius: '15px',
                backgroundColor: hexToRgba(accentColor, 0.95),
                backgroundImage:
                  'repeating-linear-gradient(115deg, rgba(255,255,255,0.26) 0px, rgba(255,255,255,0.26) 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 24px)',
                boxShadow: `0 0 24px ${hexToRgba(accentColor, 0.6)}`,
              }}
            />
          </div>

          {/* Rodapé: número grande + badge da nota */}
          <div className="flex items-end justify-between mt-5 gap-3">
            <div className="flex items-baseline gap-2 min-w-0 whitespace-nowrap">
              <span
                className="text-white font-extrabold leading-none tracking-tight"
                style={{ fontSize: '54px', textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
              >
                {minutes}
              </span>
              <span className="text-white/70 text-[14px] font-medium whitespace-nowrap">{t('min focados')}</span>
            </div>
            <div
              className="shrink-0 flex flex-col items-center justify-center"
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '22px',
                backgroundColor: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.28)',
                color: onAccent,
              }}
            >
              <span className="text-white font-extrabold text-[20px] leading-none">
                {score ? score.toFixed(1) : '—'}
              </span>
              <span className="text-white/75 text-[9px] mt-0.5 font-semibold uppercase tracking-wide">{t('nota')}</span>
            </div>
          </div>

          {message ? (
            <p
              className="text-white/80 text-[12px] italic leading-snug m-0 mt-3 overflow-hidden"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.45)',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                maxHeight: '2.6em',
              }}
            >
              "{message}"
            </p>
          ) : null}


          <div className="flex items-center justify-between mt-3 text-[9px] font-mono tracking-wider text-white/70">
            <span>nakor.com.br</span>
            <span>{t('SESSÃO FOCO')}</span>
          </div>
        </div>
      </div>
    );
  }
);
