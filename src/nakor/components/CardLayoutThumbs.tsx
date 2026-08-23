import React from 'react';

export type CardLayoutId = 'trio' | 'unificado' | 'aura' | 'widget';

export const CARD_LAYOUTS: { id: CardLayoutId; label: string; hint: string }[] = [
  { id: 'trio', label: '3 cards alinhados', hint: 'Antes • Depois • Nota' },
  { id: 'unificado', label: 'Card único glow', hint: 'Tudo em um só card' },
  { id: 'aura', label: 'Aura de vidro', hint: 'Nota gigante + gráfico' },
  { id: 'widget', label: 'Widget medidores', hint: 'Anéis + pílula do tempo' },
];

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255,255,255,${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Miniatura ilustrativa de cada formato de card. */
export function LayoutThumb({ id, accentColor }: { id: CardLayoutId; accentColor: string }) {
  if (id === 'trio') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.35) }} />
        <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.6) }} />
        <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.9) }} />
      </div>
    );
  }

  if (id === 'unificado') {
    return (
      <div
        className="w-14 h-14 rounded-2xl"
        style={{
          backgroundColor: '#0A0A0C',
          backgroundImage: `radial-gradient(120% 85% at 50% 110%, ${hexToRgba(accentColor, 0.95)} 0%, transparent 75%)`,
        }}
      />
    );
  }

  if (id === 'aura') {
    return (
      <div
        className="w-14 h-14 rounded-[18px] overflow-hidden flex flex-col"
        style={{ backgroundColor: '#07070A', padding: '3px' }}
      >
        <div
          style={{
            height: '52%',
            borderRadius: '14px 14px 50% 50% / 14px 14px 46% 46%',
            backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.35)} 0%, ${hexToRgba(accentColor, 0.95)} 100%)`,
          }}
        />
        <div className="flex items-end justify-between flex-1 gap-[1px] px-[3px] pb-[3px]">
          {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((v, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ height: `${v * 100}%`, backgroundColor: hexToRgba(accentColor, 0.85), borderRadius: '1px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-14 h-14 rounded-[18px] flex flex-col justify-center gap-1.5"
      style={{ backgroundColor: '#050506', padding: '6px' }}
    >
      <div
        className="flex items-center justify-center gap-1.5 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)', padding: '3px' }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ border: `2.5px solid ${accentColor}`, borderBottomColor: hexToRgba(accentColor, 0.25) }}
        />
        <div
          className="w-4 h-4 rounded-full"
          style={{ border: `2.5px solid ${hexToRgba(accentColor, 0.7)}`, borderBottomColor: hexToRgba(accentColor, 0.2) }}
        />
      </div>
      <div
        className="h-4 rounded-full"
        style={{
          backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.95)}, ${hexToRgba(accentColor, 0.6)})`,
        }}
      />
    </div>
  );
}
