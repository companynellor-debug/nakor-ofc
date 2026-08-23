import React from 'react';
import { Clock3, LogOut, Target, Zap } from 'lucide-react';
import type { CardTheme, CardVariant } from '../../domain/types';
import { hexToRgba } from '../../services/cardTheme';
import type { CardRenderData } from './registry';
import { AuraDomeCard } from '../AuraDomeCard';
import { UnifiedGlowCard } from '../UnifiedGlowCard';
import { WidgetStackCard } from '../WidgetStackCard';

type LegacyKind = 'trio' | 'unificado' | 'aura' | 'widget';

function activityValues(data: CardRenderData) {
  const activity = data.activity;
  return {
    title: activity.title || activity.projectName || 'Sessão de foco',
    minutes: Math.max(0, Math.round(activity.actualDuration / 60)),
    plannedMinutes: Math.max(0, Math.round(activity.plannedDuration / 60)),
    score: activity.focusScore || 0,
    exits: activity.exitCount || 0,
  };
}

function CompactLegacyCard({ theme, data, kind, ref }: { theme: CardTheme; data: CardRenderData; kind: LegacyKind; ref?: React.Ref<HTMLDivElement> }) {
  const value = activityValues(data);
  return (
    <div
      ref={ref}
      className="relative flex h-[200px] w-[360px] flex-col overflow-hidden rounded-[28px] p-5"
      style={{
        color: theme.textPrimary,
        backgroundColor: '#08080B',
        backgroundImage: `radial-gradient(90% 160% at 100% 100%, ${hexToRgba(theme.accent, 0.82)} 0%, transparent 68%)`,
        border: `1px solid ${hexToRgba(theme.accent, 0.48)}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.12), 0 20px 55px ${hexToRgba(theme.accent, 0.28)}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.textSecondary }}>{kind === 'aura' ? 'FOCUS SCORE' : kind === 'widget' ? 'WORK WIDGET' : kind === 'trio' ? 'PROOF OF WORK' : 'FOCUS SESSION'}</span>
          <h3 className="mt-1 truncate text-[18px] font-bold">{value.title}</h3>
        </div>
        <div className="shrink-0 text-right">
          <strong className="text-[34px] leading-none">{value.score.toFixed(1)}</strong>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>/10</span>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {[
          { icon: Clock3, value: `${value.minutes}m`, label: 'FOCO' },
          { icon: Target, value: `${value.plannedMinutes}m`, label: 'META' },
          { icon: LogOut, value: String(value.exits), label: 'SAÍDAS' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2">
            <item.icon size={11} style={{ color: theme.accent }} />
            <strong className="mt-1 block text-[15px] leading-none">{item.value}</strong>
            <span className="text-[8px] font-bold tracking-wider" style={{ color: theme.textSecondary }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[9px] font-bold tracking-[0.16em]" style={{ color: theme.textSecondary }}>
        <span>NAKOR.APP</span><Zap size={12} style={{ color: theme.accent }} />
      </div>
    </div>
  );
}

function TrioCard({ theme, data, ref }: { theme: CardTheme; data: CardRenderData; ref?: React.Ref<HTMLDivElement> }) {
  const value = activityValues(data);
  const panels = [
    { label: 'PLANEJADO', value: `${value.plannedMinutes} min`, sub: 'Meta da sessão' },
    { label: 'REALIZADO', value: `${value.minutes} min`, sub: `${value.exits} saídas` },
    { label: 'RESULTADO', value: value.score.toFixed(1), sub: 'Nota de foco' },
  ];
  return (
    <div ref={ref} className="grid min-h-[460px] w-[360px] grid-cols-3 gap-2 rounded-[34px] bg-[#08080B] p-3">
      {panels.map((panel, index) => (
        <div key={panel.label} className="relative flex flex-col overflow-hidden rounded-[25px] border p-3" style={{ borderColor: hexToRgba(theme.accent, .35), background: `linear-gradient(180deg, #111116 25%, ${hexToRgba(theme.accent, .22 + index * .16)} 100%)` }}>
          <span className="text-[8px] font-bold tracking-[0.15em]" style={{ color: theme.textSecondary }}>{panel.label}</span>
          <strong className="mt-auto break-words text-[25px] leading-none text-white">{panel.value}</strong>
          <span className="mt-2 text-[9px] text-white/60">{panel.sub}</span>
          <div className="mt-4 h-1.5 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 16px ${theme.accent}` }} />
        </div>
      ))}
    </div>
  );
}

export function LegacyCard({ kind, theme, variant, data, ref }: { kind: LegacyKind; theme: CardTheme; variant: CardVariant; data: CardRenderData; ref?: React.Ref<HTMLDivElement> }) {
  if (variant === 'compact') return <CompactLegacyCard kind={kind} theme={theme} data={data} ref={ref} />;
  const value = activityValues(data);
  if (kind === 'trio') return <TrioCard theme={theme} data={data} ref={ref} />;
  const props = { ref, accentColor: theme.accent, ...value, streak: data.streak };
  if (kind === 'aura') return <AuraDomeCard {...props} />;
  if (kind === 'widget') return <WidgetStackCard {...props} />;
  return <UnifiedGlowCard {...props} />;
}