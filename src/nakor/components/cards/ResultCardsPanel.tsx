import React from 'react';
import type { Activity } from '../../domain/types';
import { useCardPreferences } from '../../hooks/useCardPreferences';
import { useCardData } from '../../hooks/useCardData';
import { renderCardModel, resolveCardModel } from './registry';
import { CopyableCard } from './CopyableCard';
import { CARD_SIZES } from './CardPrimitives';
import { ScaleToFit } from './ScaleToFit';
import { useT } from '../../lib/i18n';

/**
 * Mostrado depois de finalizar uma atividade: apenas o modelo + cor
 * escolhidos na Personalização, nas versões NORMAL e COMPACTO.
 */
export function ResultCardsPanel({ activity }: { activity?: Activity | null }) {
  const t = useT();
  const { prefs, theme } = useCardPreferences();
  const data = useCardData(activity);
  const model = resolveCardModel(prefs.selectedModelId);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 pl-1">
          {t('Normal')} · {t(model.name)}
        </span>
        <CopyableCard fileName={`nakor-${model.id}-normal.png`}>
          {(ref) => (
            <ScaleToFit width={CARD_SIZES.normal.width}>
              {renderCardModel(model.id, { theme, variant: 'normal', data, ref })}
            </ScaleToFit>
          )}
        </CopyableCard>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 pl-1">
          {t('Compacto')} · {t(model.name)}
        </span>
        <CopyableCard fileName={`nakor-${model.id}-compacto.png`}>
          {(ref) => (
            <ScaleToFit width={CARD_SIZES.compact.width}>
              {renderCardModel(model.id, { theme, variant: 'compact', data, ref })}
            </ScaleToFit>
          )}
        </CopyableCard>
      </div>
    </div>
  );
}
