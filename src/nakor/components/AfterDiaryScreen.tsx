import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../lib/i18n';

interface AfterDiaryScreenProps {
  onNavigate: (view: string) => void;
}

export function AfterDiaryScreen({ onNavigate }: AfterDiaryScreenProps) {
  const t = useT();
  const [activity, setActivity] = useState<any>(null);
  const [afterText, setAfterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('nakor_atividade_atual');
    if (data) {
      try {
        setActivity(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse activity data');
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (afterText.length < 30 || !activity) return;

    setIsLoading(true);
    
    // Save texto_depois
    const updatedActivity = { ...activity, texto_depois: afterText };
    localStorage.setItem('nakor_atividade_atual', JSON.stringify(updatedActivity));

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: updatedActivity.nome,
          duracao: updatedActivity.duracao,
          duracao_real: updatedActivity.duracao_real,
          saidas: updatedActivity.saidas || 0,
          subtarefas: updatedActivity.subtarefas_concluidas || 0,
          texto_antes: updatedActivity.texto_antes,
          texto_depois: afterText,
        }),
      });
      const evaluation = await response.json();
      
      // Save evaluation
      localStorage.setItem('nakor_avaliacao', JSON.stringify(evaluation));
      
      onNavigate('resultado');
    } catch (error) {
      console.error('Evaluation error:', error);
      // Fallback
      localStorage.setItem('nakor_avaliacao', JSON.stringify({
        nota: 7.5,
        mensagem_resultado: t("Parece que os servidores estão focados em outra coisa. Mas você mandou bem!"),
        mensagem_card: t("Focado e offline 😎")
      }));
      onNavigate('resultado');
    } finally {
      setIsLoading(false);
    }
  };

  const minutesReal = activity?.duracao_real ? Math.floor(activity.duracao_real / 60) : 0;
  const subtarefas = activity?.subtarefas_concluidas || 0;
  const totalSubtarefas = activity?.subtarefas?.length || 0;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex justify-center relative overflow-y-auto pb-32">
      <div className="w-full max-w-[390px] px-6 pt-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('home')}
            className="text-[#21222D] dark:text-[#F8F9FA] hover:text-[#34117E] dark:text-[#C4B5FD] transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold text-[#21222D] dark:text-[#F8F9FA]">{t('Como foi?')}</h1>
          <div className="w-6" />
        </div>

        {/* Resumo da Sessão */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-5 mb-6 flex justify-between items-center border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA] mb-0.5">{minutesReal}min</span>
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-semibold">{t('focado real')}</span>
          </div>
          <div className="w-px h-10 bg-[#DBDBE5]/30 dark:bg-[#2A2B3D]/30" />
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA] mb-0.5">{activity?.saidas || 0}</span>
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-semibold">{t('saídas')}</span>
          </div>
          {totalSubtarefas > 0 && (
            <>
              <div className="w-px h-10 bg-[#DBDBE5]/30 dark:bg-[#2A2B3D]/30" />
              <div className="flex-1 flex flex-col items-center text-center">
                <span className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA] mb-0.5">{subtarefas}/{totalSubtarefas}</span>
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-semibold">{t('subtarefas')}</span>
              </div>
            </>
          )}
        </div>

        {/* Card Antes */}
        {activity?.texto_antes && (
          <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-4 mb-6 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
            <label className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2 block">{t('Você planejou')}</label>
            <p className="text-[#21222D] dark:text-[#F8F9FA] text-sm leading-snug font-medium">
              {activity.texto_antes}
            </p>
          </div>
        )}

        {/* Textarea Depois */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 p-4 mb-8 shadow-sm">
          <label className="text-neutral-500 dark:text-neutral-400 text-sm mb-3 block font-semibold">{t('O que aconteceu de verdade?')}</label>
          <div className="relative">
            <textarea
              value={afterText}
              onChange={(e) => setAfterText(e.target.value.slice(0, 300))}
              placeholder={t('Conseguiu bater sua meta? O que funcionou? O que atrapalhou?')}
              className="w-full bg-transparent border-none outline-none text-[#21222D] dark:text-[#F8F9FA] text-sm placeholder:text-neutral-400 resize-none h-32 leading-6"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(33,34,45,0.03) 24px)',
                backgroundAttachment: 'local'
              }}
            />
            <div className="text-right text-neutral-400 text-xs mt-2">
              {afterText.length}/300
            </div>
          </div>
        </div>

      </div>

      {/* Evaluate Button */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent pb-safe pt-6 px-6 z-50 flex justify-center">
        <button 
          onClick={handleSubmit}
          disabled={afterText.length < 30 || isLoading}
          className="w-full max-w-[342px] h-[56px] mb-8 bg-gradient-to-br from-[#5B34C7] to-[#34117E] hover:from-[#4C2AB0] hover:to-[#2A0E68] shadow-[0_10px_26px_-10px_rgba(52,17,126,0.7)] active:scale-[0.985] active:scale-95 disabled:opacity-50 disabled:hover:bg-[#34117E] disabled:active:scale-100 text-white font-bold text-base rounded-full flex justify-center items-center transition-all shadow-[0_4px_25px_rgba(52,17,126,0.25)] cursor-pointer"
        >
          {isLoading ? t('avaliando sua sessão...') : t('Ver minha nota')}
        </button>
      </div>
    </div>
  );
}
