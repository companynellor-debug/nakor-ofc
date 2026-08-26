import React from 'react';
import { useT } from '../../lib/i18n';
import type { CardTheme, CardVariant } from '../../domain/types';
import type { WorkGridCell } from '../../services/progressService';
import { formatDurationSplit } from '../../utils/duration';
import { hexToRgba } from '../../services/cardTheme';
import {
  CardBigMetric,
  CardChip,
  CardEyebrow,
  CardFooterBrand,
  CardShell,
  CardStat,
} from './CardPrimitives';

const LEVEL_ALPHA = [0, 0.3, 0.5, 0.72, 1];

interface Props {
  theme: CardTheme;
  variant?: CardVariant;
  cells: WorkGridCell[];
  currentStreak?: number;
  columns?: number;
}

export function WorkGridSquares({
  cells,
  theme,
  columns = 7,
  gap = 6,
}: {
  cells: WorkGridCell[];
  theme: CardTheme;
  columns?: number;
  gap?: number;
}) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
    >
      {cells.map((cell) => (
        <div
          key={cell.date}
          className="rounded-[7px]"
          style={{
            aspectRatio: '1 / 1',
            backgroundColor:
              cell.level > 0
                ? hexToRgba(theme.accent, LEVEL_ALPHA[cell.level])
                : 'rgba(255,255,255,0.07)',
            boxShadow: cell.level >= 3 ? `0 0 12px ${hexToRgba(theme.accent, 0.55)}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export const WorkGridCard = React.forwardRef<HTMLDivElement, Props>(
  ({ theme, variant = 'normal', cells, currentStreak = 0, columns = 7 }, ref) => {
    const t = useT();
    const total = cells.reduce((s, c) => s + c.focusTime, 0);

    const activeDays = cells.filter((c) => c.focusTime > 0).length;
    const sessions = cells.reduce((s, c) => s + c.sessions, 0);
    const split = formatDurationSplit(total);

    if (variant === 'compact') {
      return (
        <CardShell ref={ref} theme={theme} variant="compact">
          <CardEyebrow
            theme={theme}
            label={t('Grade de trabalho')}
            right={<CardChip theme={theme}>{`${activeDays} dias`}</CardChip>}
          />
          <div className="flex items-end justify-between gap-4">
            <CardBigMetric
              theme={theme}
              value={`${split.hours}h`}
              suffix={`${split.minutes}m`}
              caption={`${cells.length} dias registrados`}
            />
            <div className="w-[132px]">
              <WorkGridSquares cells={cells.slice(-21)} theme={theme} columns={columns} gap={5} />
            </div>
          </div>
        </CardShell>
      );
    }

    return (
      <CardShell ref={ref} theme={theme} variant="normal">
        <CardEyebrow
          theme={theme}
          label={t('Grade de trabalho')}
          right={<CardChip theme={theme}>{`${cells.length} DIAS`}</CardChip>}
        />

        <CardBigMetric
          theme={theme}
          value={`${split.hours}h`}
          suffix={`${split.minutes}m`}
          caption="trabalho acumulado no período"
        />

        <div className="mt-6">
          <WorkGridSquares cells={cells} theme={theme} columns={columns} />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            menos
          </span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className="w-3 h-3 rounded-[4px]"
              style={{
                backgroundColor:
                  level > 0 ? hexToRgba(theme.accent, LEVEL_ALPHA[level]) : 'rgba(255,255,255,0.07)',
              }}
            />
          ))}
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            mais
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-6">
          <CardStat theme={theme} label={t('Dias ativos')} value={String(activeDays)} />
          <CardStat theme={theme} label={t('Sessões')} value={String(sessions)} />
          <CardStat theme={theme} label={t('Sequência')} value={`${currentStreak}d`} />
        </div>

        <CardFooterBrand theme={theme} />
      </CardShell>
    );
  },
);
WorkGridCard.displayName = 'WorkGridCard';
