import React from 'react';
import type { CardTheme, CardVariant, ProgressSummary } from '../../domain/types';
import { formatDuration, formatDurationSplit } from '../../utils/duration';
import { formatRangeShort, isoWeekNumber, WEEKDAYS_SHORT_PT } from '../../utils/dates';
import { useT } from '../../lib/i18n';
import {
  CardBars,
  CardBigMetric,
  CardChip,
  CardEyebrow,
  CardFooterBrand,
  CardShell,
  CardStat,
} from './CardPrimitives';

interface Props {
  theme: CardTheme;
  variant?: CardVariant;
  summary: ProgressSummary;
}

export const WeeklyWorkCard = React.forwardRef<HTMLDivElement, Props>(
  ({ theme, variant = 'normal', summary }, ref) => {
    const t = useT();
    const start = new Date(summary.rangeStart);
    const end = new Date(summary.rangeEnd);
    const data = summary.dailyBreakdown.map((p) => p.focusTime);
    const labels = summary.dailyBreakdown.map(
      (_, i) => WEEKDAYS_SHORT_PT[i % 7]?.[0] ?? '',
    );
    const split = formatDurationSplit(summary.totalFocusTime);
    const change = summary.previousPeriodChange;

    if (variant === 'compact') {
      return (
        <CardShell ref={ref} theme={theme} variant="compact">
          <CardEyebrow
            theme={theme}
            label={t('Semana {n}', { n: isoWeekNumber(start) })}
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
              caption={t('tempo de trabalho')}
            />
            <div className="flex-1 max-w-[150px]">
              <CardBars theme={theme} data={data} labels={labels} height={62} />
            </div>
          </div>
        </CardShell>
      );
    }

    return (
      <CardShell ref={ref} theme={theme} variant="normal">
        <CardEyebrow
          theme={theme}
          label={t('Resumo semanal')}
          right={<CardChip theme={theme}>{t('SEMANA {n}', { n: isoWeekNumber(start) })}</CardChip>}
        />
        <span className="text-[11px] font-semibold mb-5" style={{ color: theme.textSecondary }}>
          {formatRangeShort(start, end)}
        </span>

        <CardBigMetric
          theme={theme}
          value={`${split.hours}h`}
          suffix={`${split.minutes}m`}
          caption={t('tempo total de trabalho')}
        />

        {change !== null && (
          <span className="mt-3 text-[12px] font-bold" style={{ color: theme.accent }}>
            {change >= 0 ? '▲' : '▼'} {t('{n}% vs semana anterior', { n: Math.abs(change) })}
          </span>
        )}

        <div className="mt-6">
          <CardBars theme={theme} data={data} labels={labels} height={104} />
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <CardStat theme={theme} label="Sessões" value={String(summary.sessionCount)} />
          <CardStat theme={theme} label="Dias ativos" value={`${summary.activeDays}/7`} />
          <CardStat
            theme={theme}
            label={t('Média de foco')}
            value={summary.averageFocusScore !== null ? `${summary.averageFocusScore}` : '—'}
          />
          <CardStat theme={theme} label={t('Sequência')} value={`${summary.currentStreak}d`} />
        </div>

        <span className="mt-4 text-[11px] font-semibold" style={{ color: theme.textSecondary }}>
          {t('Média diária: {v}', { v: formatDuration(summary.totalFocusTime / 7) })}
        </span>

        <CardFooterBrand theme={theme} />
      </CardShell>
    );
  },
);
WeeklyWorkCard.displayName = 'WeeklyWorkCard';
