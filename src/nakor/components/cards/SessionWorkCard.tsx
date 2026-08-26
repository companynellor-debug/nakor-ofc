import React from 'react';
import type { Activity, CardTheme, CardVariant } from '../../domain/types';
import { formatDuration, formatDurationSplit } from '../../utils/duration';
import { useT } from '../../lib/i18n';
import { formatTime } from '../../utils/dates';
import { hexToRgba } from '../../services/cardTheme';
import {
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

function focusLabel(score?: number | null) {
  if (score === null || score === undefined) return 'FOCO REGISTRADO';
  if (score >= 9) return 'FOCO EXCEPCIONAL';
  if (score >= 7.5) return 'FOCO ALTO';
  if (score >= 5) return 'FOCO MODERADO';
  return 'FOCO BAIXO';
}

function ScoreHero({ theme, score }: { theme: CardTheme; score: number | null | undefined }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        height: 132,
        borderRadius: 26,
        background: `radial-gradient(110% 130% at 50% 0%, ${hexToRgba(theme.accent, 0.85)} 0%, ${hexToRgba(theme.accent, 0.25)} 55%, transparent 100%)`,
        border: `1px solid ${hexToRgba(theme.accent, 0.45)}`,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-baseline gap-1">
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: 62, color: theme.textPrimary, textShadow: '0 6px 26px rgba(0,0,0,0.45)' }}
        >
          {score !== null && score !== undefined ? Number(score).toFixed(1) : '—'}
        </span>
        <span className="font-bold leading-none" style={{ fontSize: 22, color: 'rgba(255,255,255,0.72)' }}>
          /10
        </span>
      </div>
    </div>
  );
}

function ProgressLine({
  theme,
  ratio,
  caption,
}: {
  theme: CardTheme;
  ratio: number;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.10)' }}
      >
        <div
          style={{
            width: `${Math.max(4, Math.min(100, ratio * 100))}%`,
            height: '100%',
            borderRadius: 9999,
            background: `linear-gradient(90deg, ${hexToRgba(theme.accent, 0.55)} 0%, ${theme.accent} 100%)`,
            boxShadow: `0 0 14px ${hexToRgba(theme.accent, 0.6)}`,
          }}
        />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: theme.textSecondary }}>
        {caption}
      </span>
    </div>
  );
}

export const SessionWorkCard = React.forwardRef<HTMLDivElement, Props>(
  ({ theme, variant = 'normal', activity, streak = 0 }, ref) => {
    const t = useT();
    const split = formatDurationSplit(activity.actualDuration);
    const score = activity.focusScore;
    const finishedAt = activity.completedAt ? formatTime(activity.completedAt) : '';
    const planned = activity.plannedDuration || activity.actualDuration || 1;
    const ratio = (activity.actualDuration || 0) / planned;
    const phrase: string | undefined = activity.raw?.mensagem_card || activity.raw?.message;

    if (variant === 'compact') {
      return (
        <CardShell ref={ref} theme={theme} variant="compact">
          <CardEyebrow
            theme={theme}
            label={t('Sessão concluída')}
            right={
              score !== null && score !== undefined ? (
                <CardChip theme={theme}>{`${Number(score).toFixed(1)}/10`}</CardChip>
              ) : undefined
            }
          />
          <span
            className="text-[15px] font-bold leading-tight mb-3 line-clamp-2"
            style={{ color: theme.textPrimary }}
          >
            {activity.title}
          </span>
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-bold leading-none" style={{ fontSize: 42, color: theme.textPrimary }}>
                {split.hours}h
              </span>
              <span className="font-bold leading-none" style={{ fontSize: 18, color: theme.accent }}>
                {split.minutes}m
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold block" style={{ color: theme.textSecondary }}>
                {t('{n} saídas', { n: activity.exitCount ?? 0 })} · {finishedAt}
              </span>
              <span className="text-[11px] font-bold" style={{ color: theme.accent }}>
                {t('{n}d de sequência', { n: streak })}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <ProgressLine theme={theme} ratio={ratio} caption="nakor.com.br" />
          </div>
        </CardShell>
      );
    }

    return (
      <CardShell ref={ref} theme={theme} variant="normal">
        <CardEyebrow
          theme={theme}
          label={t('Sessão concluída')}
          right={<CardChip theme={theme}>{t('{v} focados', { v: formatDuration(activity.actualDuration) })}</CardChip>}
        />

        <ScoreHero theme={theme} score={score} />

        <div className="flex items-center justify-between mt-4 mb-1">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: theme.accent }}>
            {t(focusLabel(score))}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: theme.textSecondary }}>
            {t('{n} saídas', { n: activity.exitCount ?? 0 })}
          </span>
        </div>

        <span
          className="text-[18px] font-bold leading-tight mt-3"
          style={{ color: theme.textPrimary }}
        >
          {activity.title}
        </span>
        <span className="text-[11px] font-semibold mb-4" style={{ color: theme.textSecondary }}>
          {activity.projectName ? `${activity.projectName} · ` : ''}
          {finishedAt}
        </span>

        <ProgressLine
          theme={theme}
          ratio={ratio}
          caption={t('{a} de {b} planejados', { a: formatDuration(activity.actualDuration), b: formatDuration(planned) })}
        />

        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <CardStat
            theme={theme}
            label={t('Subtarefas')}
            value={`${activity.tasksCompleted ?? 0}/${activity.tasksTotal ?? 0}`}
          />
          <CardStat theme={theme} label={t('Moedas')} value={`+${activity.coinsEarned ?? 0}`} />
          <CardStat theme={theme} label={t('Sequência')} value={`${streak}d`} />
          <CardStat
            theme={theme}
            label={t('Nota')}
            value={score !== null && score !== undefined ? Number(score).toFixed(1) : '—'}
          />
        </div>

        {phrase && (
          <span
            className="mt-4 text-[12px] font-medium italic leading-snug line-clamp-2"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            “{phrase}”
          </span>
        )}

        <CardFooterBrand theme={theme} />
      </CardShell>
    );
  },
);
SessionWorkCard.displayName = 'SessionWorkCard';
