import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Lock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Static assets references using Vite URL resolution
import estreanteImg from "../assets/images/estreante_trans_1783475879674.jpg";
import consistenteImg from "../assets/images/consistente_trans_1783475889801.jpg";
import focadoImg from "../assets/images/focado_trans_1783475899110.jpg";
import dedicadoImg from "../assets/images/dedicado_trans_1783475907599.jpg";
import eliteImg from "../assets/images/elite_trans_1783475916598.jpg";
import lendaImg from "../assets/images/lenda_trans_1783475924245.jpg";

interface AchievementsScreenProps {
  onNavigate: (view: any) => void;
}

interface Seal {
  id: string;
  name: string;
  image: string;
  description: string;
  requirementText: string;
  reward: number;
  check: (hours: number, streak: number, hasHistory: boolean) => boolean;
}

export function AchievementsScreen({ onNavigate }: AchievementsScreenProps) {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('nakor_coins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [unlockedNotified, setUnlockedNotified] = useState<string[]>(() => {
    const saved = localStorage.getItem('nakor_seals_notified');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Load History
  const history = useMemo(() => {
    const raw = localStorage.getItem('nakor_historico');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }, []);

  // 2. Streak calculation (matching ProfileScreen & HomeScreen)
  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDays = new Set<string>();
    sorted.forEach(item => {
      const d = new Date(item.timestamp);
      uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    
    const dayList = Array.from(uniqueDays).map(dStr => new Date(dStr));
    if (dayList.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const firstActiveDay = dayList[0];
    firstActiveDay.setHours(0, 0, 0, 0);
    
    if (firstActiveDay < yesterday) {
      return 0;
    }
    
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
  }, [history]);

  // 3. Total hours
  const totalHours = useMemo(() => {
    const totalSecs = history.reduce((acc: number, item: any) => acc + (item.duracao_real || 0), 0);
    return Math.floor(totalSecs / 3600);
  }, [history]);

  const hasHistory = history.length > 0;

  // 4. Seal definitions
  const SEALS: Seal[] = useMemo(() => [
    {
      id: 'estreante',
      name: 'Estreante',
      image: estreanteImg,
      description: 'Estreante',
      requirementText: '1h total focada',
      reward: 50,
      check: (hours, str, hasHist) => hasHist
    },
    {
      id: 'consistente',
      name: 'Consistente',
      image: consistenteImg,
      description: 'Consistente',
      requirementText: '10h totais focadas',
      reward: 200,
      check: (hours, str, hasHist) => str >= 7
    },
    {
      id: 'focado',
      name: 'Focado',
      image: focadoImg,
      description: 'Focado',
      requirementText: '25h totais focadas',
      reward: 300,
      check: (hours, str, hasHist) => hours >= 25
    },
    {
      id: 'dedicado',
      name: 'Dedicado',
      image: dedicadoImg,
      description: 'Dedicado',
      requirementText: '100h totais focadas',
      reward: 500,
      check: (hours, str, hasHist) => hours >= 100
    },
    {
      id: 'elite',
      name: 'Elite',
      image: eliteImg,
      description: 'Elite',
      requirementText: '250h totais focadas',
      reward: 800,
      check: (hours, str, hasHist) => hours >= 250
    },
    {
      id: 'lenda',
      name: 'Lenda',
      image: lendaImg,
      description: 'Lenda',
      requirementText: '500h totais focadas',
      reward: 2000,
      check: (hours, str, hasHist) => hours >= 500
    }
  ], []);

  // 5. Check which seals are unlocked
  const unlockedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    SEALS.forEach(seal => {
      map[seal.id] = seal.check(totalHours, streak, hasHistory);
    });
    return map;
  }, [SEALS, totalHours, streak, hasHistory]);

  // 6. Current seal (highest unlocked)
  const currentSealIndex = useMemo(() => {
    let highestIdx = -1;
    for (let i = 0; i < SEALS.length; i++) {
      if (unlockedMap[SEALS[i].id]) {
        highestIdx = i;
      }
    }
    return highestIdx;
  }, [SEALS, unlockedMap]);

  const currentSeal = currentSealIndex >= 0 ? SEALS[currentSealIndex] : null;
  const nextSeal = currentSealIndex < SEALS.length - 1 ? SEALS[currentSealIndex + 1] : null;

  // 7. Coin rewards logic upon unlocking new seals
  useEffect(() => {
    const newlyUnlockedSeals: Seal[] = [];
    SEALS.forEach(seal => {
      const isUnlocked = unlockedMap[seal.id];
      const isNotified = unlockedNotified.includes(seal.id);
      if (isUnlocked && !isNotified) {
        newlyUnlockedSeals.push(seal);
      }
    });

    if (newlyUnlockedSeals.length > 0) {
      // Reward calculation
      let addedCoins = 0;
      const updatedNotified = [...unlockedNotified];
      
      newlyUnlockedSeals.forEach(seal => {
        addedCoins += seal.reward;
        updatedNotified.push(seal.id);
      });

      const newCoinsTotal = coins + addedCoins;
      
      // Persist
      localStorage.setItem('nakor_coins', newCoinsTotal.toString());
      localStorage.setItem('nakor_seals_notified', JSON.stringify(updatedNotified));
      
      // Update state
      setCoins(newCoinsTotal);
      setUnlockedNotified(updatedNotified);

      // Trigger custom event so other parts of the app can react to coins update if needed
      window.dispatchEvent(new Event('nakor_coins_updated'));

      // Show toast
      if (newlyUnlockedSeals.length === 1) {
        const s = newlyUnlockedSeals[0];
        setToastMessage(`🎉 Selo ${s.name} desbloqueado! +${s.reward} coins`);
      } else {
        setToastMessage(`🎉 ${newlyUnlockedSeals.length} novos selos desbloqueados! +${addedCoins} coins`);
      }

      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [unlockedMap, SEALS, unlockedNotified, coins]);

  // 8. Progress calculation for the next seal
  const progressPercent = useMemo(() => {
    if (!nextSeal) return 100;
    
    // Calculate progress metric
    if (nextSeal.id === 'estreante') {
      return hasHistory ? 100 : 0;
    } else if (nextSeal.id === 'consistente') {
      return Math.min(100, Math.round((streak / 7) * 100));
    } else {
      // Hour-based seals
      const required = nextSeal.id === 'focado' ? 25 : nextSeal.id === 'dedicado' ? 100 : nextSeal.id === 'elite' ? 250 : 500;
      return Math.min(100, Math.round((totalHours / required) * 100));
    }
  }, [nextSeal, streak, totalHours, hasHistory]);

  const progressText = useMemo(() => {
    if (!nextSeal) return 'Nível Máximo Atingido!';
    
    if (nextSeal.id === 'estreante') {
      return 'Falta 1 atividade para Estreante';
    } else if (nextSeal.id === 'consistente') {
      const remaining = Math.max(0, 7 - streak);
      return `Faltam ${remaining} dias de streak para Consistente`;
    } else {
      const required = nextSeal.id === 'focado' ? 25 : nextSeal.id === 'dedicado' ? 100 : nextSeal.id === 'elite' ? 250 : 500;
      const remaining = Math.max(0, required - totalHours);
      return `Faltam ${remaining}h para ${nextSeal.name}`;
    }
  }, [nextSeal, streak, totalHours]);

  const progressFraction = useMemo(() => {
    if (!nextSeal) return '';
    
    if (nextSeal.id === 'estreante') {
      return `${hasHistory ? 1 : 0} / 1 atividade`;
    } else if (nextSeal.id === 'consistente') {
      return `${streak} / 7 dias`;
    } else {
      const required = nextSeal.id === 'focado' ? 25 : nextSeal.id === 'dedicado' ? 100 : nextSeal.id === 'elite' ? 250 : 500;
      return `${totalHours}h / ${required}h`;
    }
  }, [nextSeal, streak, totalHours, hasHistory]);

  const formattedCoins = useMemo(() => {
    return coins.toLocaleString('pt-BR');
  }, [coins]);

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex justify-center pb-32 relative overflow-y-auto">
      <div className="w-full max-w-[390px] px-6 pt-12 flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <button 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] text-xs font-bold uppercase tracking-wider mb-2 cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
            <h1 className="text-[32px] font-extrabold tracking-tighter text-[#21222D] dark:text-[#F8F9FA] uppercase leading-none">
              CONQUISTAS
            </h1>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold mt-1">Seu progresso</span>
          </div>

          {/* Badge Coins */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 py-1.5 px-3.5 rounded-full shadow-sm">
            <div className="w-3.5 h-3.5 bg-[#34117E] rounded-full shadow-[0_0_8px_rgba(52,17,126,0.6)]" />
            <span className="text-sm font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">{formattedCoins}</span>
          </div>
        </div>

        {/* Current Spotlight Seal Card */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 mb-8 flex flex-col items-center border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered relative overflow-hidden">
          {/* Spotlight Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#34117E]/[0.03] blur-3xl rounded-full pointer-events-none" />

          {currentSeal ? (
            <>
              {/* Highlight active border if selected */}
              <div className="w-32 h-32 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-[#34117E]/[0.1] blur-xl animate-pulse" />
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center relative z-10 filter drop-shadow-[0_8px_16px_rgba(52,17,126,0.15)] bg-transparent">
                  <img 
                    src={currentSeal.image} 
                    alt={currentSeal.name} 
                    className="w-full h-full object-cover scale-[1.38] transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight uppercase leading-none mb-1">
                {currentSeal.name}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider mb-5">
                {currentSeal.requirementText}
              </p>
            </>
          ) : (
            <>
              {/* Locked/Empty state */}
              <div className="w-32 h-32 rounded-full bg-neutral-100 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 flex items-center justify-center mb-4">
                <Lock size={36} className="text-neutral-400" />
              </div>
              <h2 className="text-xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight uppercase mb-1">
                Sem Conquistas
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold mb-5">
                Complete atividades para desbloquear selos!
              </p>
            </>
          )}

          {/* Next Seal Progress Bar internal card */}
          <div className="w-full bg-[#F5F5F7] dark:bg-[#0D0F14] rounded-[20px] p-5 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-sm-layered">
            <div className="flex flex-col">
              <span className="text-xs text-[#21222D] dark:text-[#F8F9FA] font-bold tracking-tight mb-2.5 block text-center">
                {nextSeal ? (
                  <>Faltam <span className="text-[#34117E]">{nextSeal.id === 'consistente' ? `${Math.max(0, 7 - streak)} dias de streak` : nextSeal.id === 'estreante' ? '1 atividade' : `${Math.max(0, (nextSeal.id === 'focado' ? 25 : nextSeal.id === 'dedicado' ? 100 : nextSeal.id === 'elite' ? 250 : 500) - totalHours)}h`}</span> para {nextSeal.name}</>
                ) : (
                  'Todos os selos desbloqueados!'
                )}
              </span>

              {/* Progress bar line */}
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-[#34117E] rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {nextSeal && (
                <span className="text-[11px] text-[#34117E] font-mono font-extrabold text-center block tracking-wide">
                  {progressFraction}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3x2 Grid of Seals */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {SEALS.map((seal, index) => {
            const isUnlocked = unlockedMap[seal.id];
            const isSpotlight = currentSeal?.id === seal.id;
            const isLenda = seal.id === 'lenda';

            return (
              <div 
                key={seal.id}
                className={`bg-white dark:bg-[#151622] rounded-[20px] p-5 flex flex-col items-center border transition-all duration-300 relative overflow-hidden ${
                  isSpotlight 
                    ? 'border-[#34117E] shadow-md-layered scale-[1.02]' 
                    : 'border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-sm-layered hover:shadow-md-layered'
                }`}
              >
                {/* Overlay lock condition if blocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-2 opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white dark:bg-[#151622] rounded-full border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 flex items-center justify-center mb-1.5 shadow-sm-layered">
                      <Lock size={15} className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Bloqueado
                    </span>
                  </div>
                )}

                {/* Badge Image or "?" placeholder */}
                {isLenda && !isUnlocked ? (
                  <div className="w-20 h-20 bg-neutral-100 border-2 border-dashed border-[#34117E]/30 rounded-[16px] flex items-center justify-center text-3xl font-black text-[#34117E] mb-3 select-none">
                    ?
                  </div>
                ) : (
                  <div className={`w-20 h-20 flex items-center justify-center mb-3 relative ${!isUnlocked ? 'opacity-60' : ''}`}>
                    <div className="w-18 h-18 rounded-full overflow-hidden flex items-center justify-center bg-transparent">
                      <img 
                        src={seal.image} 
                        alt={seal.name} 
                        className="w-full h-full object-cover scale-[1.38] transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* Seal Name */}
                <span className="text-sm font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight uppercase block leading-none mb-1">
                  {seal.name}
                </span>

                {/* Requirement or Secret label */}
                <span className="text-[10px] text-neutral-400 font-bold text-center block mb-3 line-clamp-1">
                  {isLenda && !isUnlocked ? 'Requisito Secreto' : seal.requirementText}
                </span>

                {/* Unlock Status Text */}
                <div className="mt-auto">
                  {isUnlocked ? (
                    <span className="text-[10px] font-extrabold text-[#34117E] uppercase tracking-wider flex items-center gap-1">
                      Conquistado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {isLenda ? 'Requisito secreto' : 'Bloqueado'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#21222D] border border-white/10 text-white text-xs font-bold px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
