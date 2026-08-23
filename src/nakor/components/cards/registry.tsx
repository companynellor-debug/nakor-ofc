import React from 'react';
import type { Activity, CardTheme, CardVariant, ProgressSummary } from '../../domain/types';
import type { WorkGridCell } from '../../services/progressService';
import { SessionWorkCard } from './SessionWorkCard';
import { WeeklyWorkCard } from './WeeklyWorkCard';
import { MonthlyWorkCard } from './MonthlyWorkCard';
import { LegacyCard } from './LegacyCards';

/** Dados reais necessários para renderizar qualquer modelo de card. */
export interface CardRenderData {
  activity: Activity;
  weekly: ProgressSummary;
  monthly: ProgressSummary;
  grid: WorkGridCell[];
  streak: number;
}

export type CardModelId = 'trio' | 'unificado' | 'aura' | 'widget' | 'session' | 'weekly' | 'monthly';

/** Modelos removidos por serem visualmente idênticos a outro modelo. */
const MODEL_ALIASES: Record<string, CardModelId> = { grid: 'monthly' };

export interface CardModelDefinition {
  id: CardModelId;
  name: string;
  description: string;
  render: (args: {
    theme: CardTheme;
    variant: CardVariant;
    data: CardRenderData;
    ref?: React.Ref<HTMLDivElement>;
  }) => React.ReactNode;
}

export const CARD_MODELS: CardModelDefinition[] = [
  {
    id: 'trio',
    name: '3 cards alinhados',
    description: 'Antes, depois e nota no formato original',
    render: ({ theme, variant, data, ref }) => <LegacyCard kind="trio" ref={ref} theme={theme} variant={variant} data={data} />,
  },
  {
    id: 'unificado',
    name: 'Card único glow',
    description: 'O modelo original com brilho intenso',
    render: ({ theme, variant, data, ref }) => <LegacyCard kind="unificado" ref={ref} theme={theme} variant={variant} data={data} />,
  },
  {
    id: 'aura',
    name: 'Aura de vidro',
    description: 'Nota em destaque e gráfico da sessão',
    render: ({ theme, variant, data, ref }) => <LegacyCard kind="aura" ref={ref} theme={theme} variant={variant} data={data} />,
  },
  {
    id: 'widget',
    name: 'Widget medidores',
    description: 'Anéis de progresso e tempo focado',
    render: ({ theme, variant, data, ref }) => <LegacyCard kind="widget" ref={ref} theme={theme} variant={variant} data={data} />,
  },
  {
    id: 'session',
    name: 'Session Card',
    description: 'Resultado da sessão que você acabou de concluir',
    render: ({ theme, variant, data, ref }) => (
      <SessionWorkCard
        ref={ref}
        theme={theme}
        variant={variant}
        activity={data.activity}
        streak={data.streak}
      />
    ),
  },
  {
    id: 'weekly',
    name: 'Weekly Work',
    description: 'Resumo da sua semana de trabalho',
    render: ({ theme, variant, data, ref }) => (
      <WeeklyWorkCard ref={ref} theme={theme} variant={variant} summary={data.weekly} />
    ),
  },
  {
    id: 'monthly',
    name: 'Monthly Work',
    description: 'Resumo do mês com evolução',
    render: ({ theme, variant, data, ref }) => (
      <MonthlyWorkCard ref={ref} theme={theme} variant={variant} summary={data.monthly} />
    ),
  },
];

export const CARD_MODEL_IDS = CARD_MODELS.map((m) => m.id);

export function resolveCardModel(id?: string): CardModelDefinition {
  const resolved = (id && MODEL_ALIASES[id]) || id;
  return CARD_MODELS.find((m) => m.id === resolved) ?? CARD_MODELS[0];
}

export function renderCardModel(
  id: string | undefined,
  args: {
    theme: CardTheme;
    variant: CardVariant;
    data: CardRenderData;
    ref?: React.Ref<HTMLDivElement>;
  },
) {
  return resolveCardModel(id).render(args);
}
