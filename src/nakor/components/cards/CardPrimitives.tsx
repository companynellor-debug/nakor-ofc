import React from 'react';
import type { CardTheme, CardVariant } from '../../domain/types';
import { hexToRgba } from '../../services/cardTheme';

/** Dimensões fixas garantem export consistente (sem depender do layout da tela). */
export const CARD_SIZES: Record<CardVariant, { width: number; minHeight: number }> = {
  normal: { width: 360, minHeight: 460 },
  compact: { width: 360, minHeight: 200 },
};

interface CardShellProps {
  theme: CardTheme;
  variant: CardVariant;
  children: React.ReactNode;
  className?: string;
}

export const CardShell = React.forwardRef<HTMLDivElement, CardShellProps>(
  ({ theme, variant, children, className = '' }, ref) => {
    const size = CARD_SIZES[variant];
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden flex flex-col ${className}`}
        style={{
          width: size.width,
          minHeight: size.minHeight,
          borderRadius: variant === 'compact' ? 28 : 34,
          backgroundColor: theme.background,
          backgroundImage: `radial-gradient(130% 95% at 84% -12%, ${hexToRgba(theme.accent, 0.62)} 0%, transparent 60%), radial-gradient(100% 75% at -5% 108%, ${hexToRgba(theme.accent, 0.34)} 0%, transparent 64%), linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.22) 100%)`,
          border: `1px solid ${hexToRgba(theme.accent, 0.46)}`,
          padding: variant === 'compact' ? 20 : 26,
          color: theme.textPrimary,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 26px 60px -28px ${hexToRgba(theme.accent, 0.55)}`,
        }}
      >
        {/* brilho superior em gradiente para exportar corretamente em todos os navegadores */}
        <div
          className="pointer-events-none absolute"
          style={{
            inset: 0,
            background: `radial-gradient(70% 58% at 92% 0%, ${hexToRgba(theme.accent, 0.5)} 0%, transparent 72%)`,
          }}
        />
        {/* vinheta suave nas bordas para dar profundidade */}
        <div
          className="pointer-events-none absolute"
          style={{
            inset: 0,
            background: 'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)',
          }}
        />
        <div className="relative flex flex-col flex-1">{children}</div>
      </div>

      </div>
    );
  },
);
CardShell.displayName = 'CardShell';

export function CardEyebrow({
  theme,
  label,
  right,
}: {
  theme: CardTheme;
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span
        className="text-[10px] font-bold tracking-[0.22em] uppercase"
        style={{ color: theme.textSecondary }}
      >
        {label}
      </span>
      {right}
    </div>
  );
}

export function CardChip({ theme, children }: { theme: CardTheme; children: React.ReactNode }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
      style={{
        backgroundColor: hexToRgba(theme.accent, 0.22),
        border: `1px solid ${hexToRgba(theme.accent, 0.5)}`,
        color: theme.textPrimary,
      }}
    >
      {children}
    </span>
  );
}

export function CardBigMetric({
  theme,
  value,
  suffix,
  caption,
}: {
  theme: CardTheme;
  value: string;
  suffix?: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: 52, color: theme.textPrimary }}
        >
          {value}
        </span>
        {suffix && (
          <span className="font-bold leading-none" style={{ fontSize: 20, color: theme.accent }}>
            {suffix}
          </span>
        )}
      </div>
      {caption && (
        <span
          className="mt-2 text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: theme.textSecondary }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}

export function CardStat({
  theme,
  label,
  value,
}: {
  theme: CardTheme;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl px-3 py-2.5"
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: `1px solid ${hexToRgba(theme.accent, 0.24)}`,
      }}
    >
      <span
        className="text-[9px] font-bold uppercase tracking-[0.16em] leading-tight"
        style={{ color: theme.textSecondary }}
      >
        {label}
      </span>
      <span className="text-[16px] font-bold leading-none" style={{ color: theme.textPrimary }}>
        {value}
      </span>
    </div>
  );
}

export function CardBars({
  theme,
  data,
  labels,
  height = 96,
}: {
  theme: CardTheme;
  data: number[];
  labels: string[];
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((value, i) => {
        const ratio = value / max;
        const barHeight = value > 0 ? Math.max(8, ratio * (height - 18)) : 4;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
            <div
              className="w-full rounded-full"
              style={{
                height: barHeight,
                background:
                  value > 0
                    ? `linear-gradient(180deg, ${theme.accent} 0%, ${hexToRgba(theme.accent, 0.45)} 100%)`
                    : 'rgba(255,255,255,0.12)',
                boxShadow: value > 0 ? `0 0 14px ${hexToRgba(theme.accent, 0.55)}` : 'none',
              }}
            />
            <span className="text-[8px] font-bold" style={{ color: theme.textSecondary }}>
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CardFooterBrand({ theme }: { theme: CardTheme }) {
  return (
    <div
      className="mt-auto pt-4 flex items-center justify-between"
      style={{ borderTop: `1px solid ${hexToRgba(theme.accent, 0.22)}` }}
    >
      <span
        className="text-[10px] font-bold tracking-[0.24em] uppercase"
        style={{ color: theme.textSecondary }}
      >
        nakor.com.br
      </span>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }}
      />
    </div>
  );
}
