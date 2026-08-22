import React, { useRef, useState } from 'react';
import { Check, Copy, Loader2 } from 'lucide-react';
import { copyCardToClipboard } from '../../utils/cardExport';
import { useT } from '../../lib/i18n';

interface Props {
  fileName?: string;
  children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}

/** Envolve qualquer card e adiciona o botão de copiar/compartilhar imagem. */
export function CopyableCard({ fileName = 'nakor-card.png', children }: Props) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleCopy = async () => {
    setState('loading');
    const result = await copyCardToClipboard(ref.current, fileName);
    setState(result === 'error' ? 'idle' : 'done');
    if (result !== 'error') setTimeout(() => setState('idle'), 1800);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="max-w-full overflow-hidden flex justify-center">{children(ref)}</div>
      <button
        onClick={handleCopy}
        disabled={state === 'loading'}
        className="h-11 px-5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_8px_24px_rgba(124,58,237,0.35)] disabled:opacity-70 cursor-pointer"
      >
        {state === 'loading' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : state === 'done' ? (
          <Check size={16} />
        ) : (
          <Copy size={16} />
        )}
        {state === 'done' ? t('Copiado!') : t('Copiar card')}
      </button>
    </div>
  );
}
