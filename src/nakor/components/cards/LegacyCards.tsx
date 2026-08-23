import React from 'react';
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
    plannedMinutes: Math.max(0, Math.round((activity.plannedDuration ?? 0) / 60)),
    score: activity.focusScore || 0,
    exits: activity.exitCount || 0,
  };
}

function TrioCard({ theme, data, ref }: { theme: CardTheme; data: CardRenderData; ref?: React.Ref<HTMLDivElement> }) {
  const value = activityValues(data);
  const panels = [
    { label: 'PLANEJADO', value: `${value.plannedMinutes} min`, sub: 'Meta da sessão' },
    { label: 'REALIZADO', value: `${value.minutes} min`, sub: `${value.exits} saídas` },
    { label: 'RESULTADO', value: value.score.toFixed(1), sub: 'Nota de foco' },
  ];
  return (
    <div ref={ref} className="grid min-h-[460px] w-[360px] grid-cols-3 gap-2 rounded-[34px] p-3" style={{ backgroundColor: `rgba(8,8,11,${theme.backgroundOpacity})` }}>
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

/**
 * Modelos originais: renderizam sempre exatamente como antes.
 * O modo compacto não altera o desenho destes cards (pedido do usuário).
 */
export function LegacyCard({ kind, theme, data, ref }: { kind: LegacyKind; theme: CardTheme; variant?: CardVariant; data: CardRenderData; ref?: React.Ref<HTMLDivElement> }) {
  const value = activityValues(data);
  if (kind === 'trio') return <TrioCard theme={theme} data={data} ref={ref} />;
  const props = { ref, accentColor: theme.accent, backgroundOpacity: theme.backgroundOpacity, ...value, streak: data.streak };
  if (kind === 'aura') return <AuraDomeCard {...props} />;
  if (kind === 'widget') return <WidgetStackCard {...props} />;
  return <UnifiedGlowCard {...props} />;
}