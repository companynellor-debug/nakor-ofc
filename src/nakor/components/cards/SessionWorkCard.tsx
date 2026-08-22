import React from 'react';
import type { Activity, CardTheme, CardVariant } from '../../domain/types';
import { formatDurationSplit } from '../../utils/duration';
import { formatTime } from '../../utils/dates';
import {
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
  activity: Activity;
  streak?: number;
}

export const SessionWorkCard = React.forwardRef<HTMLDivElement, Props>(
  ({ theme, variant = 'normal', activity, streak = 0 }, ref) => {
    const split = formatDurationSplit(activity.actualDuration);
    const score = activity.focusScore;
    const finishedAt = activity.completedAt ? formatTime(activity.completedAt) : '';

    if (variant === 'compact') {
      return (
        <CardShell ref={ref} theme={theme} variant="compact">
          <CardEyebrow
            theme={theme}
            label="Sessão concluída"
            right={score !== null && score !== undefined ? <CardChip theme={theme}>{`NOTA ${score}`}</CardChip> : undefined}
          />
          <span
            className="text-[15px] font-bold leading-tight mb-3 line-clamp-2"
            style={{ color: theme.textPrimary }}
          >
            {activity.title}
          </span>
          <div className="flex items-end justify-between gap-3">
            <CardBigMetric
              theme={theme}
              value={`${split.hours}h`}
              suffix={`${split.minutes}m`}
              caption={activity.projectName || 'sem projeto'}
            />
            <div className="text-right">
              <span className="text-[11px] font-semibold block" style={{ color: theme.textSecondary }}>
                {finishedAt}
              </span>
              <span className="text-[11px] font-bold" style={{ color: theme.accent }}>
                {streak}d de sequência
              </span>
            </div>
          </div>
        </CardShell>
      );
    }

    return (
      <CardShell ref={ref} theme={theme} variant="normal">
        <CardEyebrow
          theme={theme}
          label="Sessão concluída"
          right={score !== null && score !== undefined ? <CardChip theme={theme}>{`NOTA ${score}`}</CardChip> : undefined}
        />

        <span
          className="text-[22px] font-bold leading-tight mb-1"
          style={{ color: theme.textPrimary }}
        >
          {activity.title}
        </span>
        <span className="text-[11px] font-semibold mb-6" style={{ color: theme.textSecondary }}>
          {activity.projectName ? `${activity.projectName} · ` : ''}
          {finishedAt}
        </span>

        <CardBigMetric
          theme={theme}
          value={`${split.hours}h`}
          suffix={`${split.minutes}m`}
          caption="tempo focado"
        />

        <div className="grid grid-cols-2 gap-2.5 mt-7">
          <CardStat
            theme={theme}
            label="Subtarefas"
            value={`${activity.tasksCompleted ?? 0}/${activity.tasksTotal ?? 0}`}
          />
          <CardStat theme={theme} label="Saídas" value={String(activity.exitCount ?? 0)} />
          <CardStat theme={theme} label="Moedas" value={`+${activity.coinsEarned ?? 0}`} />
          <CardStat theme={theme} label="Sequência" value={`${streak}d`} />
        </div>

        <CardFooterBrand theme={theme} />
      </CardShell>
    );
  },
);
SessionWorkCard.displayName = 'SessionWorkCard';
