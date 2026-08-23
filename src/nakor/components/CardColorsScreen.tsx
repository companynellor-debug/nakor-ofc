import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { CARD_MODELS, renderCardModel } from './cards/registry';
import { CARD_SIZES } from './cards/CardPrimitives';
import { ScaleToFit } from './cards/ScaleToFit';
import { buildCardTheme, readCardPreferences, saveCardPreferences } from '../services/cardTheme';
import { useCardData } from '../hooks/useCardData';
import type { CardVariant } from '../domain/types';
import { useT } from '../lib/i18n';

interface CardColorsScreenProps {
  onBack: () => void;
}

const COLORS = [
  { name: 'Roxo', hex: '#7C3AED' },
  { name: 'Azul', hex: '#2563EB' },
  { name: 'Ciano', hex: '#0CB6D7' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Verde Limão', hex: '#A5CE00' },
  { name: 'Âmbar', hex: '#F59E0B' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Grafite', hex: '#94A3B8' },
];

export function CardColorsScreen({ onBack }: CardColorsScreenProps) {
  const t = useT();
  const [modelId, setModelId] = useState<string>('session');
  const [color, setColor] = useState<string>('#7C3AED');
  const [variant, setVariant] = useState<CardVariant>('normal');
  const [saved, setSaved] = useState(false);

  const data = useCardData();
  const theme = buildCardTheme(color);

  useEffect(() => {
    const prefs = readCardPreferences();
    setModelId(prefs.selectedModelId);
    setColor(prefs.selectedColor);
  }, []);

  const handleSave = () => {
    saveCardPreferences({ selectedModelId: modelId, selectedColor: color });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] flex flex-col font-sans relative overflow-x-hidden">
      <div className="w-full max-w-[420px] mx-auto flex flex-col pb-32">
        {/* Header */}
        <div className="flex items-center px-6 py-6 sticky top-0 bg-[#F5F5F7]/90 dark:bg-[#0D0F14]/90 backdrop-blur-md z-30">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
            {t('Cards')}
          </h1>
        </div>

        <div className="px-5 flex flex-col gap-7">
          {/* Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-1">
                {t('Pré-visualização')}
              </span>
              <div className="flex gap-1 p-1 rounded-full bg-[#DBDBE5]/50 dark:bg-[#2A2B3D]/50">
                {(['normal', 'compact'] as CardVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      variant === v
                        ? 'bg-white dark:bg-[#151622] text-[#7C3AED] shadow-sm'
                        : 'text-neutral-500'
                    }`}
                  >
                    {v === 'normal' ? t('Normal') : t('Compacto')}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full rounded-[28px] p-4 bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 shadow-sm flex justify-center">
              <ScaleToFit width={CARD_SIZES[variant].width}>
                {renderCardModel(modelId, { theme, variant, data })}
              </ScaleToFit>
            </div>
          </div>

          {/* Modelos */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-1">
              {t('Modelo do card')}
            </span>
            <div className="grid grid-cols-2 gap-3">
              {CARD_MODELS.map((model) => {
                const active = model.id === modelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => setModelId(model.id)}
                    className={`text-left rounded-[22px] p-4 border transition-all cursor-pointer active:scale-[0.98] ${
                      active
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10'
                        : 'border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60 bg-white dark:bg-[#151622]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold">{model.name}</span>
                      {active && (
                        <span className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-snug block">
                      {t(model.description)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cores */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-1">
              {t('Cor de destaque')}
            </span>
            <div className="rounded-[24px] p-5 bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 shadow-sm flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    title={t(c.name)}
                    className="aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    style={{
                      backgroundColor: c.hex,
                      boxShadow:
                        color.toLowerCase() === c.hex.toLowerCase()
                          ? `0 0 0 3px rgba(124,58,237,0.35), 0 0 18px ${c.hex}`
                          : 'none',
                    }}
                  >
                    {color.toLowerCase() === c.hex.toLowerCase() && (
                      <Check size={14} className="text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>

              <label className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold">{t('Cor personalizada')}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-9 rounded-lg bg-transparent cursor-pointer border border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60"
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-[56px] rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-base transition-all active:scale-95 shadow-[0_10px_30px_rgba(124,58,237,0.35)] cursor-pointer"
          >
            {saved ? t('Preferência salva!') : t('Salvar preferência')}
          </button>

          <span className="text-center text-[11px] text-neutral-500 dark:text-neutral-400 px-4">
            {t('Todas as próximas atividades usam automaticamente este modelo e esta cor.')}
          </span>
        </div>
      </div>
    </div>
  );
}
