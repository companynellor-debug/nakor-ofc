import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, Home, Clock, User, Info } from 'lucide-react';
import { ResultCardsPanel } from './cards/ResultCardsPanel';
import type { Activity } from '../domain/types';
import { useT } from '../lib/i18n';

interface ResultScreenProps {
  onNavigate: (view: string) => void;
  historicActivity?: any;
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let cleanHex = hex.replace('#', '');
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getInsetShadowOnly(styleId: string, accentColor: string, opacity: number): string {
  const bgOpacityVal = opacity / 100;
  switch (styleId) {
    case 'neon_radial':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.4 * bgOpacityVal)}`;
    case 'aurora_mesh':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.25 * bgOpacityVal)}`;
    case 'cyber_grid':
    case 'laser_split':
    case 'vortex_matrix':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'nebula_glow':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'sunset_fire':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'super_nova':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.35 * bgOpacityVal)}`;
    case 'neon_border':
      return `inset 0 0 12px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    default:
      return 'none';
  }
}

export function getCardBgStyle(styleId: string, accentColor: string, opacity: number): React.CSSProperties {
  const bgOpacityVal = opacity / 100;
  const cardBgColor = `rgba(13, 15, 18, ${bgOpacityVal})`;
  
  const baseStyle: React.CSSProperties = {
    backgroundColor: cardBgColor,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  switch (styleId) {
    case 'gradient':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.8)} 0%, ${cardBgColor} 70%)`,
        border: `1.5px solid ${hexToRgba(accentColor, 0.45)}`,
      };
    case 'neon_radial':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.95)} 0%, ${hexToRgba(accentColor, 0.25)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.5)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'aurora_mesh':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.85)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.5px solid ${hexToRgba(accentColor, 0.75)}`,
      };
    case 'cyber_grid':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.25)} 40%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'laser_split':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'nebula_glow':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(225deg, ${hexToRgba(accentColor, 0.85)} 0%, ${cardBgColor} 45%, ${hexToRgba(accentColor, 0.4)} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.8)}`,
      };
    case 'sunset_fire':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(45deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'super_nova':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(to top right, ${hexToRgba(accentColor, 0.95)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.5)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `2px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'vortex_matrix':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(115deg, ${hexToRgba(accentColor, 0.85)} 10%, ${cardBgColor} 50%, ${hexToRgba(accentColor, 0.45)} 90%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'neon_border':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${cardBgColor} 0%, ${cardBgColor} 100%)`,
        boxShadow: `0 0 20px ${hexToRgba(accentColor, 0.85)}, inset 0 0 12px ${hexToRgba(accentColor, 0.5)}`,
        border: `2px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'eclipse_glow':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${cardBgColor} 50%, ${hexToRgba(accentColor, 0.25)} 80%, ${hexToRgba(accentColor, 0.85)} 100%)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'grain':
      return {
        ...baseStyle,
        backgroundImage: 'none',
        border: `1px solid ${hexToRgba(accentColor, 0.5)}`,
      };
    case 'solid':
    default:
      return {
        ...baseStyle,
        backgroundImage: 'none',
        border: `1px solid ${hexToRgba(accentColor, 0.5)}`,
      };
  }
}

export function ResultScreen({ onNavigate, historicActivity }: ResultScreenProps) {
  const t = useT();
  const [activity, setActivity] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string>('');
  const exportRef = useRef<HTMLDivElement>(null);
  const hasSavedHistory = useRef(false);

  // Calculate fallback streak and level
  const currentLevel = useMemo(() => {
    const historyRaw = localStorage.getItem('nakor_historico');
    let history: any[] = [];
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch(e) {}
    }
    const totalSecs = history.reduce((acc: number, item: any) => acc + (item.duracao_real || 0), 0);
    const totalHours = Math.floor(totalSecs / 3600);
    
    // Streak
    let currentStreak = 0;
    if (history.length > 0) {
      const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
      const uniqueDays = new Set<string>();
      sorted.forEach(item => {
        const d = new Date(item.timestamp);
        uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      });
      const dayList = Array.from(uniqueDays).map(dStr => new Date(dStr));
      if (dayList.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const firstActiveDay = dayList[0];
        firstActiveDay.setHours(0, 0, 0, 0);
        if (firstActiveDay >= yesterday) {
          currentStreak = 1;
          let currentDay = firstActiveDay;
          for (let i = 1; i < dayList.length; i++) {
            const prevDay = new Date(currentDay);
            prevDay.setDate(currentDay.getDate() - 1);
            prevDay.setHours(0, 0, 0, 0);
            const checkDay = dayList[i];
            checkDay.setHours(0, 0, 0, 0);
            if (checkDay.getTime() === prevDay.getTime()) {
              currentStreak++;
              currentDay = checkDay;
            } else {
              break;
            }
          }
        }
      }
    }

    if (totalHours >= 500) return 'Lenda';
    if (totalHours >= 250) return 'Elite';
    if (totalHours >= 100) return 'Dedicado';
    if (totalHours >= 25) return 'Focado';
    if (currentStreak >= 7) return 'Consistente';
    if (history.length > 0) return 'Estreante';
    return 'Iniciante';
  }, []);

  const currentStreak = useMemo(() => {
    const historyRaw = localStorage.getItem('nakor_historico');
    let history: any[] = [];
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch(e) {}
    }
    if (history.length === 0) return 1;
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDays = new Set<string>();
    sorted.forEach(item => {
      const d = new Date(item.timestamp);
      uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    const dayList = Array.from(uniqueDays).map(dStr => new Date(dStr));
    if (dayList.length === 0) return 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstActiveDay = dayList[0];
    firstActiveDay.setHours(0, 0, 0, 0);
    if (firstActiveDay < yesterday) return 1;
    
    let currentStreak = 1;
    let currentDay = firstActiveDay;
    for (let i = 1; i < dayList.length; i++) {
      const prevDay = new Date(currentDay);
      prevDay.setDate(currentDay.getDate() - 1);
      prevDay.setHours(0, 0, 0, 0);
      const checkDay = dayList[i];
      checkDay.setHours(0, 0, 0, 0);
      if (checkDay.getTime() === prevDay.getTime()) {
        currentStreak++;
        currentDay = checkDay;
      } else {
        break;
      }
    }
    return currentStreak;
  }, []);

  const [estiloCards, setEstiloCards] = useState<any>({
    accentColor: '#A5CE00',
    bgStyle: 'gradient',
    scoreStyle: 'large',
    layout: 'trio',
    bgOpacity: 80,
    conteudo: {
      textoAntes: true,
      textoDepois: true,
      notaIA: true,
      fraseIA: true,
      streak: true,
      selo: true,
      horario: false,
      duracao: true
    }
  });

  useEffect(() => {
    try {
      const savedStyle = localStorage.getItem('nakor_estilo_cards');
      if (savedStyle) {
        setEstiloCards((prev: any) => ({ ...prev, ...JSON.parse(savedStyle) }));
      }
    } catch (e) {}

    if (historicActivity) {
      setActivity(historicActivity);
      setEvaluation({
        nota: historicActivity.nota || 0,
        mensagem_resultado: historicActivity.mensagem_resultado || t('Bom trabalho na sua sessão!'),
        mensagem_card: historicActivity.mensagem_card || t('Foco concluído com sucesso.')
      });
      return;
    }

    let currentActivity: any = null;
    let currentEvaluation: any = null;

    const activityData = localStorage.getItem('nakor_atividade_atual');
    if (activityData) {
      try {
        currentActivity = JSON.parse(activityData);
        setActivity(currentActivity);
      } catch (e) {
        console.error('Failed to parse activity data');
      }
    }

    const evalData = localStorage.getItem('nakor_avaliacao');
    if (evalData) {
      try {
        currentEvaluation = JSON.parse(evalData);
        setEvaluation(currentEvaluation);
      } catch (e) {
        console.error('Failed to parse evaluation data');
      }
    }

    if (currentActivity && currentEvaluation && !hasSavedHistory.current) {
      hasSavedHistory.current = true;
      try {
        const historyRaw = localStorage.getItem('nakor_historico');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        
        // Prevent duplicate saves by checking if this exact activity + timestamp exists
        // Since we don't have a unique ID, we'll check if the last item is exactly the same one
        const isDuplicate = history.length > 0 && 
                            history[0].nome === currentActivity.nome && 
                            history[0].texto_depois === currentActivity.texto_depois &&
                            Date.now() - history[0].timestamp < 60000; // Less than 1 minute ago

        if (!isDuplicate) {
          const durationHours = (currentActivity.duracao_real || 0) / 3600;
          let earnedCoins = Math.floor(durationHours * 50);
          if ((currentEvaluation.nota || 0) > 9) earnedCoins += 150;

          const newHistoryItem = {
            id: Date.now().toString(),
            nome: currentActivity.nome || 'Sessão de Foco',
            duracao_real: currentActivity.duracao_real || 0,
            duracao_prevista: (currentActivity.duracao || 0) * 60,
            nota: currentEvaluation.nota || 0,
            saidas: currentActivity.saidas || 0,
            texto_antes: currentActivity.texto_antes || '',
            texto_depois: currentActivity.texto_depois || '',
            mensagem_card: currentEvaluation.mensagem_card || '',
            moedas: earnedCoins,
            projeto_id: currentActivity.projeto_id ?? null,
            projeto_nome: currentActivity.projeto_nome ?? null,
            subtarefas_total: Array.isArray(currentActivity.subtarefas)
              ? currentActivity.subtarefas.length
              : currentActivity.subtarefas_total || 0,
            subtarefas_concluidas: currentActivity.subtarefas_concluidas || 0,
            status: currentActivity.concluida === false ? 'cancelled' : 'completed',
            timestamp_inicio: currentActivity.timestamp_inicio || null,
            timestamp: Date.now()
          };
          history.unshift(newHistoryItem);
          localStorage.setItem('nakor_historico', JSON.stringify(history));

          // Credita as moedas ganhas na sessão
          const currentCoins = parseInt(localStorage.getItem('nakor_coins') || '0', 10) || 0;
          localStorage.setItem('nakor_coins', String(currentCoins + earnedCoins));
        }
      } catch (err) {
        console.error('Failed to save history', err);
      }
    }
  }, []);

  const cardAntesRef = useRef<HTMLDivElement>(null);

  const cardDepoisRef = useRef<HTMLDivElement>(null);
  const cardScoreRef = useRef<HTMLDivElement>(null);
  const cardUnifiedRef = useRef<HTMLDivElement>(null);

  const userStreak = useMemo(() => {
    try {
      const userRaw = localStorage.getItem('nakor_user');
      if (userRaw && userRaw.startsWith('{')) {
        const u = JSON.parse(userRaw);
        if (u && u.streak !== undefined) return u.streak;
      }
    } catch (e) {}
    return activity?.streak ?? currentStreak;
  }, [activity, currentStreak]);

  const userSelo = useMemo(() => {
    try {
      const userRaw = localStorage.getItem('nakor_user');
      if (userRaw && userRaw.startsWith('{')) {
        const u = JSON.parse(userRaw);
        if (u && (u.selo_atual || u.selo)) return u.selo_atual || u.selo;
      }
    } catch (e) {}
    return activity?.nivel ?? currentLevel;
  }, [activity, currentLevel]);

  const minutesReal = activity?.duracao_real ? Math.floor(activity.duracao_real / 60) : 0;

  /** Sessão concluída no formato do domínio, usada pelos cards. */
  const resultActivity: Activity | null = useMemo(() => {
    if (!activity) return null;
    return {
      id: activity.id || 'atual',
      title: activity.nome || 'Sessão de Foco',
      projectId: activity.projeto_id ?? null,
      projectName: activity.projeto_nome ?? null,
      createdAt: new Date(activity.timestamp_inicio || Date.now()).toISOString(),
      startedAt: activity.timestamp_inicio
        ? new Date(activity.timestamp_inicio).toISOString()
        : null,
      completedAt: new Date(activity.timestamp || Date.now()).toISOString(),
      plannedDuration: activity.duracao_prevista ?? (activity.duracao || 0) * 60,
      actualDuration: activity.duracao_real || 0,
      focusScore: evaluation?.nota ?? activity.nota ?? null,
      exitCount: activity.saidas ?? 0,
      tasksTotal: Array.isArray(activity.subtarefas)
        ? activity.subtarefas.length
        : activity.subtarefas_total ?? 0,
      tasksCompleted: activity.subtarefas_concluidas ?? 0,
      coinsEarned: activity.moedas ?? 0,
      status: 'completed',
      raw: {
        mensagem_card: evaluation?.mensagem_card || activity.mensagem_card,
        texto_antes: activity.texto_antes,
        texto_depois: activity.texto_depois,
      },
    };
  }, [activity, evaluation]);

  const bgOpacityVal = estiloCards.bgOpacity !== undefined ? estiloCards.bgOpacity : 80;
  const accentColor = estiloCards.accentColor || '#A5CE00';

  const baseCardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#FFFFFF] font-sans flex flex-col items-center relative overflow-y-auto pb-32 pt-10">
      
      {/* Main compact metrics wrapper */}
      <div className="w-full max-w-[390px] px-6 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8 relative">
          <h1 className="text-[18px] font-bold w-full text-center text-white">
            {historicActivity ? t('Detalhes da Atividade') : t('Atividade concluída')}
          </h1>
          <span className="text-xl absolute right-0">🎉</span>
        </div>

        {/* Metrics Card */}
        <div className="w-full bg-[#0d0f12]/60 backdrop-blur-md rounded-[24px] p-5 mb-6 flex justify-between items-center border border-white/[0.04] shadow-md">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold text-white mb-0.5">{minutesReal}min</span>
            <span className="text-neutral-400 text-[11px] font-medium">{t('duração')}</span>
          </div>
          <div className="w-px h-10 bg-white/[0.08]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold mb-0.5" style={{ color: accentColor }}>
              {evaluation ? evaluation.nota.toFixed(1) : '-'}
            </span>
            <span className="text-neutral-400 text-[11px] font-medium">{t('sua nota')}</span>
          </div>
          <div className="w-px h-10 bg-white/[0.08]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold text-white mb-0.5">
              {activity?.saidas === 1 ? t('1 saída') : t('{n} saídas', { n: activity?.saidas || 0 })}
            </span>
            <span className="text-neutral-400 text-[11px] font-medium">{t('distrações')}</span>
          </div>
        </div>

        {/* Score & AI Message Card */}
        <div className="w-full bg-[#0d0f12]/60 backdrop-blur-md rounded-[24px] p-6 mb-8 flex flex-col items-center text-center border border-white/[0.04] shadow-md">
          <span className="text-neutral-400 text-sm mb-2">{t('sua nota')}</span>
          
          <div className="relative inline-block mb-4">
            <span className="text-[72px] font-bold text-white leading-none tracking-tighter">
              {evaluation?.nota?.toFixed(1) || '0.0'}
            </span>
            <div className="w-full h-1 mt-2 rounded-full opacity-50" style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
          </div>
          <p className="text-white italic text-[15px] mb-6 px-4">
            {evaluation?.mensagem_resultado || t('...')}
          </p>

          <span className="text-neutral-500 dark:text-neutral-400 text-[10px]">{t('gerado por IA com base no seu relato')}</span>
        </div>
      </div>

      {/* Cards do resultado: apenas o modelo + cor escolhidos na Personalização */}
      <div className="w-full max-w-[420px] px-6 mb-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold text-[15px]">{t('Seu card')}</h3>
          <Info size={16} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        <ResultCardsPanel activity={resultActivity} />
      </div>


      {/* Action Buttons Wrapper */}
      <div className="w-full max-w-[390px] px-6 flex flex-col items-center">
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-4">
          

          
          <button 
            onClick={() => onNavigate('home')}
            className="w-full h-[56px] bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] active:scale-95 text-white font-bold text-base rounded-full flex justify-center items-center transition-all cursor-pointer"
          >
            {t('Voltar para o Início')}
          </button>
        </div>

        <span className="text-neutral-500 dark:text-neutral-400 text-[10px] text-center mt-6">{t('compartilhe sua evolução')}</span>
      </div>

      {/* Modern Touch & Hold Fallback Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#0d0f12]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] bg-[#16191d] border border-white/[0.08] rounded-[28px] p-6 flex flex-col items-center gap-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xl mb-1">
              📸
            </div>
            
            <h4 className="text-white text-lg font-bold tracking-tight">
              {t('Toque e segure para copiar')}
            </h4>
            
            <p className="text-neutral-400 text-xs leading-relaxed px-2">
              {t('Seu navegador não permite a cópia direta.')} <strong className="text-white font-semibold">{t('Pressione e segure')}</strong> {t('o card abaixo para')} <strong className="text-white font-semibold">{t('Copiar')}</strong> {t('ou')} <strong className="text-white font-semibold">{t('Compartilhar')}</strong> {t('nos Stories!')}
            </p>

            <div className="w-full bg-[#0d0f12] rounded-xl p-2 border border-white/[0.04] overflow-hidden flex items-center justify-center max-h-[300px]">
              {generatedImgUrl ? (
                <img 
                  src={generatedImgUrl} 
                  alt={t('Seus Cards Nakor')} 
                  className="max-w-full max-h-[280px] object-contain rounded-lg shadow-md pointer-events-auto cursor-pointer"
                  style={{ WebkitTouchCallout: 'default' }} // Enable iOS/Android touch callout
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-neutral-600 text-xs">
                  {t('Carregando imagem...')}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setShowShareModal(false);
                setGeneratedImgUrl('');
              }}
              style={{ backgroundColor: accentColor }}
              className="w-full h-[48px] hover:brightness-105 active:scale-95 text-[#000000] font-bold text-sm rounded-full flex justify-center items-center transition-all cursor-pointer mt-2"
            >
              {t('Concluído')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
