import React, { useMemo, useState } from 'react';
import { ArrowLeft, Flame, Layers, Target, TrendingUp } from 'lucide-react';
import type { ProgressPeriod } from '../domain/types';
import { useProgress } from '../hooks/useProgress';
import { useCardPreferences } from '../hooks/useCardPreferences';
import { formatDuration } from '../utils/duration';
import { getProjectBreakdown } from '../services/progressService';
import { WeeklyWorkCard } from './cards/WeeklyWorkCard';
import { MonthlyWorkCard } from './cards/MonthlyWorkCard';
import { WorkGridCard } from './cards/WorkGridCard';
import { CopyableCard } from './cards/CopyableCard';
import { useT } from '../lib/i18n';

interface ProgressScreenProps {
  onBack: () => void;
}

const PERIODS: { id: ProgressPeriod; label: string }[] = [
  { id: 'day', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
];

export function ProgressScreen({ onBack }: ProgressScreenProps) {
  const t = useT();
  const [period, setPeriod] = useState<ProgressPeriod>('week');
  const { summary, grid, activities } = useProgress(period);
  const { theme } = useCardPreferences();

  const projects = useMemo(
    () => getProjectBreakdown(activities, new Date(summary.rangeStart), new Date(summary.rangeEnd)),
    [activities, summary.rangeStart, summary.rangeEnd],
  );

  const change = summary.previousPeriodChange;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex justify-center">
      <div className="w-full max-w-[430px] px-6 pt-10 pb-40 flex flex-col">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-7">
          <button
            onClick={onBack}
            className="text-[#21222D] dark:text-[#F8F9FA] hover:text-[#7C3AED] dark:hover:text-[#C4B5FD] transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold">{t('Progresso')}</h1>
          <div className="w-6" />
        </div>

        {/* Period tabs */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-full p-1 flex mb-7 border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                period === p.id
                  ? 'bg-[#7C3AED] text-white shadow-[0_6px_18px_rgba(124,58,237,0.35)]'
                  : 'text-[#21222D]/70 dark:text-[#F8F9FA]/70'
              }`}
            >
              {t(p.label)}
            </button>
          ))}
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          <MetricTile
            icon={<Target size={16} />}
            label={t('Tempo de trabalho')}
            value={formatDuration(summary.totalFocusTime)}
            hint={
              change !== null
                ? `${change >= 0 ? '+' : ''}${change}% ${t('vs período anterior')}`
                : undefined
            }
          />
          <MetricTile
            icon={<Layers size={16} />}
            label={t('Sessões')}
            value={String(summary.sessionCount)}
            hint={`${summary.activeDays} ${t('dias ativos')}`}
          />
          <MetricTile
            icon={<TrendingUp size={16} />}
            label={t('Média de foco')}
            value={summary.averageFocusScore !== null ? `${summary.averageFocusScore}` : '—'}
            hint={`${summary.tasksCompleted}/${summary.tasksTotal} ${t('subtarefas')}`}
          />
          <MetricTile
            icon={<Flame size={16} />}
            label={t('Sequência')}
            value={`${summary.currentStreak}d`}
            hint={`${t('recorde')}: ${summary.longestStreak}d`}
          />
        </div>

        {/* Projetos */}
        {projects.length > 0 && (
          <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 p-5 mb-8 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#21222D]/50 dark:text-[#F8F9FA]/50">
              {t('Trabalho por projeto')}
            </span>
            <div className="mt-4 flex flex-col gap-3">
              {projects.slice(0, 5).map((p) => {
                const ratio = summary.totalFocusTime ? p.focusTime / summary.totalFocusTime : 0;
                return (
                  <div key={p.id} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[13px] font-bold">
                      <span className="truncate pr-3">{p.name}</span>
                      <span className="text-[#7C3AED] dark:text-[#C4B5FD] shrink-0">
                        {formatDuration(p.focusTime)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#ECECF1] dark:bg-[#2A2B3D] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]"
                        style={{ width: `${Math.max(4, ratio * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards compartilháveis */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#21222D]/50 dark:text-[#F8F9FA]/50 mb-4">
          {t('Provas de trabalho')}
        </span>

        <div className="flex flex-col gap-10">
          <CopyableCard fileName="nakor-grade-trabalho.png">
            {(ref) => (
              <WorkGridCard
                ref={ref}
                theme={theme}
                cells={grid}
                currentStreak={summary.currentStreak}
              />
            )}
          </CopyableCard>

          {period !== 'month' ? (
            <CopyableCard fileName="nakor-semana.png">
              {(ref) => <WeeklyWorkCard ref={ref} theme={theme} summary={summary} />}
            </CopyableCard>
          ) : (
            <CopyableCard fileName="nakor-mes.png">
              {(ref) => <MonthlyWorkCard ref={ref} theme={theme} summary={summary} />}
            </CopyableCard>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#151622] rounded-[22px] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[#7C3AED] dark:text-[#C4B5FD]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#21222D]/55 dark:text-[#F8F9FA]/55 leading-tight">
          {label}
        </span>
      </div>
      <span className="text-[24px] font-bold leading-none">{value}</span>
      {hint && (
        <span className="text-[11px] font-semibold text-[#21222D]/45 dark:text-[#F8F9FA]/45">
          {hint}
        </span>
      )}
    </div>
  );
}
