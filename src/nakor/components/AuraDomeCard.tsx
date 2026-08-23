import React, { forwardRef } from 'react';
import { TrendingUp, Zap } from 'lucide-react';
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

export interface AuraDomeCardProps {
  accentColor: string;
  title: string;
  minutes: number;
  plannedMinutes: number;
  score: number;
  exits: number;
  streak?: number | string;
  message?: string;
  showDomain?: boolean;
  backgroundOpacity?: number;
}

/** Barras determinísticas derivadas da sessão (mesma sessão = mesmo gráfico). */
function buildBars(minutes: number, score: number, exits: number): number[] {
  const bars: number[] = [];
  const seedBase = Math.max(1, minutes) * 7 + Math.round(score * 10) * 3 + exits * 11;
  const focusRatio = Math.min(1, Math.max(0.25, score / 10 || 0.5));
  for (let i = 0; i < 22; i++) {
    const s = Math.sin(seedBase * (i + 1) * 0.37) * 0.5 + 0.5;
    const shape = 0.45 + 0.55 * Math.sin((i / 21) * Math.PI); // curva central
    bars.push(Math.max(0.14, Math.min(1, s * 0.55 * focusRatio + shape * focusRatio * 0.75)));
  }
  return bars;
}

/**
 * Card "Aura" — squircle escuro com cúpula de vidro no topo,
 * nota gigante em degradê e mini-gráfico de barras da sessão.
 */
export const AuraDomeCard = forwardRef<HTMLDivElement, AuraDomeCardProps>(
  function AuraDomeCard(
    { accentColor, title, minutes, plannedMinutes, score, exits, streak, message, showDomain = true, backgroundOpacity = 1 },
    ref
  ) {
    const t = useT();
    const bars = buildBars(minutes, score, exits);
    const scoreLabel = score ? score.toFixed(1).replace('.0', '') : '0';
    const peakIndex = bars.indexOf(Math.max(...bars));
    const focusLabel =
      score >= 8.5 ? t('FOCO PROFUNDO') : score >= 6.5 ? t('FOCO MODERADO') : score > 0 ? t('FOCO LEVE') : t('SEM NOTA');
    const delta = plannedMinutes > 0 ? minutes - plannedMinutes : 0;

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '1 / 1',
          borderRadius: '64px',
          overflow: 'hidden',
          backgroundColor: `rgba(7,7,10,${backgroundOpacity})`,
          boxShadow: `0 30px 70px -22px ${hexToRgba(accentColor, 0.5)}, 0 10px 30px rgba(0,0,0,0.65)`,
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
        }}
      >
        {/* Halo externo suave da cor */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(90% 60% at 50% 8%, ${hexToRgba(accentColor, 0.35)} 0%, rgba(7,7,10,0) 70%)`,
            borderRadius: 'inherit',
          }}
        />

        {/* Cúpula de vidro */}
        <div
          style={{
            position: 'relative',
            height: '52%',
            margin: '10px 10px 0 10px',
            borderRadius: '54px 54px 50% 50% / 54px 54px 46% 46%',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.30)} 0%, ${hexToRgba(
              accentColor,
              0.82
            )} 62%, ${hexToRgba(accentColor, 0.98)} 100%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 24px 50px -18px ${hexToRgba(accentColor, 0.7)}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {/* brilho especular superior */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '-12%',
              left: '8%',
              right: '8%',
              height: '55%',
              borderRadius: '50%',
              backgroundImage: 'radial-gradient(60% 100% at 50% 100%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div className="relative flex items-baseline" style={{ marginTop: '6px' }}>
            <span
              style={{
                fontSize: '86px',
                lineHeight: 0.9,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                backgroundImage: `linear-gradient(180deg, #FFFFFF 10%, rgba(255,255,255,0.92) 46%, ${hexToRgba(
                  accentColor,
                  0.45
                )} 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 18px rgba(0,0,0,0.25)',
              }}
            >
              {scoreLabel}
            </span>
            <span
              style={{
                fontSize: '52px',
                lineHeight: 1,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '-0.03em',
              }}
            >
              /10
            </span>
          </div>

          <div
            className="relative flex items-center gap-1.5"
            style={{
              padding: '5px 12px 5px 6px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0,0,0,0.30)',
              border: '1px solid rgba(255,255,255,0.22)',
            }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: hexToRgba(accentColor, 1),
                color: '#0B0B0F',
              }}
            >
              <TrendingUp size={12} strokeWidth={3} />
            </span>
            <span className="text-white text-[12px] font-semibold whitespace-nowrap">
              {t('{n} min focados', { n: minutes })}
              {delta > 0 ? ` · +${delta}` : ''}
            </span>
          </div>
        </div>

        {/* Base: dados da sessão */}
        <div className="relative flex-1 flex flex-col justify-between" style={{ padding: '18px 26px 22px' }}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/55 text-[11px] font-semibold uppercase tracking-[0.14em] truncate">
              {focusLabel}:
            </span>
            <span
              className="flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap"
              style={{ color: accentColor }}
            >
              <Zap size={13} strokeWidth={3} />
              {exits === 1 ? t('{n} saída', { n: exits }) : t('{n} saídas', { n: exits })}
            </span>
          </div>

          {/* Gráfico */}
          <div className="relative w-full" style={{ marginTop: '12px' }}>
            <div
              className="absolute left-0 right-0"
              style={{ top: 0, borderTop: '1px dashed rgba(255,255,255,0.14)' }}
            />
            <div
              className="absolute left-0 right-0"
              style={{ bottom: 0, borderTop: '1px dashed rgba(255,255,255,0.14)' }}
            />
            <div className="flex items-end justify-between" style={{ height: '62px', gap: '3px' }}>
              {bars.map((v, i) => (
                <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full">
                  {i === peakIndex && (
                    <div
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '999px',
                        backgroundColor: '#FFFFFF',
                        marginBottom: '4px',
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.round(v * 100)}%`,
                      borderRadius: '2px',
                      backgroundColor: hexToRgba(accentColor, i <= peakIndex ? 0.95 : 0.5),
                      boxShadow: `0 0 10px ${hexToRgba(accentColor, 0.35)}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-white/40 text-[10px] font-mono tracking-wider mt-2">
            <span className="truncate max-w-[150px]">{title}</span>
            <span>{streak ? t('{n}d streak', { n: streak }) : ''}</span>
          </div>

          {message ? (
            <p
              className="text-white/70 text-[11px] italic leading-snug m-0 mt-1 overflow-hidden"
              style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}
            >
              "{message}"
            </p>
          ) : null}

          {showDomain ? (
            <span className="text-white/35 text-[9px] font-mono tracking-widest mt-1">nakor.com.br</span>
          ) : null}
        </div>
      </div>
    );
  }
);
