import React, { forwardRef } from 'react';
import { Timer, LogOut, Moon } from 'lucide-react';
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

export interface WidgetStackCardProps {
  accentColor: string;
  title: string;
  minutes: number;
  plannedMinutes: number;
  score: number;
  exits: number;
  streak?: number | string;
  message?: string;
  startLabel?: string;
  endLabel?: string;
  showDomain?: boolean;
}

function Gauge({
  value,
  max,
  label,
  color,
  icon,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  const size = 104;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const gapRatio = 0.22; // abertura inferior do gauge
  const arc = circumference * (1 - gapRatio);
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${90 + (gapRatio * 360) / 2}deg)` }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hexToRgba(color, 0.22)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc * pct} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 6px ${hexToRgba(color, 0.55)})` }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ gap: '2px' }}
      >
        <span className="text-white font-bold text-[26px] leading-none tracking-tight">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
  );
}

/**
 * Card "Widget" — inspirado nos widgets de smartwatch:
 * dois medidores em cápsula + uma pílula colorida com o tempo da sessão.
 */
export const WidgetStackCard = forwardRef<HTMLDivElement, WidgetStackCardProps>(
  function WidgetStackCard(
    {
      accentColor,
      title,
      minutes,
      plannedMinutes,
      score,
      exits,
      streak,
      message,
      startLabel,
      endLabel,
      showDomain = true,
    },
    ref
  ) {
    const t = useT();
    const goal = plannedMinutes > 0 ? plannedMinutes : Math.max(minutes, 1);
    const focusPct = Math.round(Math.min(1, minutes / goal) * 100);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '1 / 1',
          borderRadius: '44px',
          overflow: 'hidden',
          backgroundColor: '#050506',
          boxShadow: `0 30px 70px -24px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.6)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 20px 18px',
          gap: '12px',
          margin: '0 auto',
        }}
      >
        <p className="text-white font-bold text-[19px] text-center leading-tight m-0 truncate">{title}</p>

        {/* Cápsula com dois medidores */}
        <div
          className="relative flex items-center justify-center"
          style={{
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '10px 12px',
            gap: '10px',
          }}
        >
          <Gauge
            value={score}
            max={10}
            label={score ? score.toFixed(1) : '—'}
            color={accentColor}
            icon={<Timer size={14} strokeWidth={2.5} />}
          />
          <div style={{ width: '1px', height: '46px', backgroundColor: 'rgba(255,255,255,0.18)' }} />
          <Gauge
            value={focusPct}
            max={100}
            label={`${focusPct}`}
            color={accentColor}
            icon={<LogOut size={14} strokeWidth={2.5} />}
          />
        </div>

        {/* Pílula do tempo */}
        <div
          className="relative flex items-center"
          style={{
            borderRadius: '999px',
            padding: '14px 18px',
            gap: '14px',
            backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.95)} 0%, ${hexToRgba(
              accentColor,
              0.65
            )} 100%)`,
            boxShadow: `0 14px 30px -12px ${hexToRgba(accentColor, 0.8)}`,
          }}
        >
          <span
            className="flex items-center justify-center shrink-0"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0,0,0,0.30)',
              color: '#FFFFFF',
            }}
          >
            <Moon size={24} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="m-0 text-white font-bold leading-none whitespace-nowrap" style={{ fontSize: '30px' }}>
              {h > 0 ? (
                <>
                  {h}
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>h </span>
                  {m}
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>m</span>
                </>
              ) : (
                <>
                  {m}
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>min</span>
                </>
              )}
            </p>
            <p className="m-0 mt-1 text-white/75 text-[14px] font-medium whitespace-nowrap">
              {startLabel && endLabel
                ? `${startLabel} - ${endLabel}`
                : (exits === 1
                    ? t('{n} saída · meta {goal}min', { n: exits, goal })
                    : t('{n} saídas · meta {goal}min', { n: exits, goal }))}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-white/45 text-[10px] font-mono tracking-wider mt-auto">
          <span>{showDomain ? 'nakor.com.br' : ''}</span>
          <span>{streak ? t('{n}D STREAK', { n: streak }) : t('SESSÃO FOCO')}</span>
        </div>

        {message ? (
          <p
            className="text-white/60 text-[11px] italic leading-snug m-0 overflow-hidden"
            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}
          >
            "{message}"
          </p>
        ) : null}
      </div>
    );
  }
);
