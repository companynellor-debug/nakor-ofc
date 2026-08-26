import React from 'react';
import type { CardTheme, CardVariant, ProgressSummary } from '../../domain/types';
import { formatDuration, formatDurationSplit } from '../../utils/duration';
import { MONTHS_PT } from '../../utils/dates';
import { useT } from '../../lib/i18n';
import {
  CardBigMetric,
  CardChip,
  CardEyebrow,
  CardFooterBrand,
  CardShell,
  CardStat,
} from './CardPrimitives';
import { hexToRgba } from '../../services/cardTheme';

interface Props {
  theme: CardTheme;
  variant?: CardVariant;
  summary: ProgressSummary;
}

function MonthHeatmap({ summary, theme }: { summary: ProgressSummary; theme: CardTheme }) {
  const max = Math.max(...summary.dailyBreakdown.map((p) => p.focusTime), 1);
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {summary.dailyBreakdown.map((point) => {
        const ratio = point.focusTime / max;
        const alpha = point.focusTime > 0 ? 0.28 + ratio * 0.7 : 0;
        return (
          <div
            key={point.date}
            className="rounded-[7px]"
            style={{
              aspectRatio: '1 / 1',
              backgroundColor:
                point.focusTime > 0 ? hexToRgba(theme.accent, alpha) : 'rgba(255,255,255,0.07)',
              boxShadow: ratio > 0.65 ? `0 0 10px ${hexToRgba(theme.accent, 0.6)}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export const MonthlyWorkCard = React.forwardRef<HTMLDivElement, Props>(
  ({ theme, variant = 'normal', summary }, ref) => {
    const t = useT();
    const start = new Date(summary.rangeStart);
    const monthLabel = `${t(MONTHS_PT[start.getMonth()])} ${start.getFullYear()}`;
    const split = formatDurationSplit(summary.totalFocusTime);
    const change = summary.previousPeriodChange;
    const daysInMonth = summary.dailyBreakdown.length;

    if (variant === 'compact') {
      return (
        <CardShell ref={ref} theme={theme} variant="compact">
          <CardEyebrow
            theme={theme}
            label={monthLabel}
            right={
              change !== null ? (
                <CardChip theme={theme}>{`${change >= 0 ? '+' : ''}${change}%`}</CardChip>
              ) : undefined
            }
          />
          <div className="flex items-end justify-between gap-4">
            <CardBigMetric
              theme={theme}
              value={`${split.hours}h`}
              suffix={`${split.minutes}m`}
              caption={`${t('{n} sessões', { n: summary.sessionCount })} · ${t('{n} dias', { n: summary.activeDays })}`}
            />
            <div className="w-[128px]">
              <MonthHeatmap summary={summary} theme={theme} />
            </div>
          </div>
        </CardShell>
      );
    }

    return (
      <CardShell ref={ref} theme={theme} variant="normal">
        <CardEyebrow
          theme={theme}
          label={t('Resumo mensal')}
          right={<CardChip theme={theme}>{monthLabel.toUpperCase()}</CardChip>}
        />

        <CardBigMetric
          theme={theme}
          value={`${split.hours}h`}
          suffix={`${split.minutes}m`}
          caption={t('tempo total de trabalho')}
        />

        {change !== null && (
          <span className="mt-3 text-[12px] font-bold" style={{ color: theme.accent }}>
            {change >= 0 ? '▲' : '▼'} {t('{n}% vs mês anterior', { n: Math.abs(change) })}
          </span>
        )}

        <div className="mt-6">
          <MonthHeatmap summary={summary} theme={theme} />
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <CardStat theme={theme} label={t('Sessões')} value={String(summary.sessionCount)} />
          <CardStat
            theme={theme}
            label={t('Dias ativos')}
            value={`${summary.activeDays}/${daysInMonth}`}
          />
          <CardStat
            theme={theme}
            label={t('Média diária')}
            value={formatDuration(summary.totalFocusTime / Math.max(1, summary.activeDays))}
          />
          <CardStat theme={theme} label={t('Maior sequência')} value={`${summary.longestStreak}d`} />
        </div>

        <CardFooterBrand theme={theme} />
      </CardShell>
    );
  },
);
MonthlyWorkCard.displayName = 'MonthlyWorkCard';
