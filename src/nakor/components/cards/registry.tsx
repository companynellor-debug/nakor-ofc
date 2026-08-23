import React from 'react';
import type { Activity, CardTheme, CardVariant, ProgressSummary } from '../../domain/types';
import type { WorkGridCell } from '../../services/progressService';
import { SessionWorkCard } from './SessionWorkCard';
import { WeeklyWorkCard } from './WeeklyWorkCard';
import { MonthlyWorkCard } from './MonthlyWorkCard';
import { WorkGridCard } from './WorkGridCard';

/** Dados reais necessários para renderizar qualquer modelo de card. */
export interface CardRenderData {
  activity: Activity;
  weekly: ProgressSummary;
  monthly: ProgressSummary;
  grid: WorkGridCell[];
  streak: number;
}

export type CardModelId = 'session' | 'weekly' | 'monthly' | 'grid';

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
  {
    id: 'grid',
    name: 'Work Grid',
    description: 'Consistência em grid de intensidade',
    render: ({ theme, variant, data, ref }) => (
      <WorkGridCard
        ref={ref}
        theme={theme}
        variant={variant}
        cells={data.grid}
        currentStreak={data.streak}
      />
    ),
  },
];

export const CARD_MODEL_IDS = CARD_MODELS.map((m) => m.id);

export function resolveCardModel(id?: string): CardModelDefinition {
  return CARD_MODELS.find((m) => m.id === id) ?? CARD_MODELS[0];
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
