import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye } from 'lucide-react';

interface FocusScreenProps {
  onNavigate: (view: string) => void;
}

export function FocusScreen({ onNavigate }: FocusScreenProps) {
  const [activity, setActivity] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exits, setExits] = useState(0);
  const [completedSubtasks, setCompletedSubtasks] = useState<number[]>([]);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const wakeLockRef = useRef<any>(null);
  const totalTimeRef = useRef(1); // To prevent division by zero

  useEffect(() => {
    const data = localStorage.getItem('nakor_atividade_atual');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setActivity(parsed);
        const durationSeconds = (parsed.duracao || 25) * 60;
        setTimeLeft(durationSeconds);
        totalTimeRef.current = durationSeconds;
      } catch (e) {
        console.error('Failed to parse activity data');
      }
    } else {
      // Fallback if no activity found
      setActivity({ nome: 'Foco Profundo', subtarefas: [] });
      setTimeLeft(25 * 60);
      totalTimeRef.current = 25 * 60;
    }
  }, []);

  // Request WakeLock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.error('WakeLock error:', err);
      }
    };
    
    requestWakeLock();
    
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(console.error);
      }
    };
  }, []);

  // Visibility Change Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setExits((prev) => prev + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleFinish = useCallback((completedNormally: boolean = true) => {
    if (activity) {
      const realDuration = totalTimeRef.current - timeLeft;
      const updatedActivity = {
        ...activity,
        duracao_real: realDuration,
        saidas: exits,
        subtarefas_concluidas: completedSubtasks.length,
        timestamp_fim: Date.now(),
        concluida: completedNormally
      };
      localStorage.setItem('nakor_atividade_atual', JSON.stringify(updatedActivity));
      
      // Also add to history/recent activities logic here if needed later
    }
    
    onNavigate('diario-depois');
  }, [activity, timeLeft, exits, completedSubtasks, onNavigate]);

  // Timer interval
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, handleFinish]);

  const toggleSubtask = (index: number) => {
    setCompletedSubtasks((prev) => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const hoursLeft = Math.floor(timeLeft / 3600);
  const minutesLeft = Math.floor((timeLeft % 3600) / 60);
  const secondsLeft = timeLeft % 60;
  
  const timeString = hoursLeft > 0 
    ? `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
    : `${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  
  const progress = timeLeft / totalTimeRef.current;
  const circumference = 2 * Math.PI * 140; // r=140
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex justify-center relative overflow-y-auto pb-32">
      <div className="w-full max-w-[390px] px-6 pt-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-12">
          <button 
            onClick={() => setShowModal(true)}
            className="text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <h1 className="text-[16px] font-bold text-[#21222D] dark:text-[#F8F9FA] truncate px-4 flex-1 text-center">
            {activity?.nome || 'Trabalho Focado'}
          </h1>
          <div className="bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 px-3 py-1.5 rounded-full border border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 flex items-center justify-center shrink-0">
            <span className="text-[#21222D] dark:text-[#F8F9FA] text-xs font-semibold">{exits} saídas</span>
          </div>
        </div>

        {/* Circular Timer */}
        <div className="relative w-[300px] h-[300px] flex flex-col items-center justify-center mb-10 animate-in fade-in zoom-in duration-500">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="150"
              cy="150"
              r="140"
              className="fill-transparent stroke-[#DBDBE5]/40"
              strokeWidth="10"
            />
            <circle
              cx="150"
              cy="150"
              r="140"
              className="fill-transparent stroke-[#34117E] transition-all duration-1000 ease-linear"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 0 12px rgba(52,17,126,0.15))'
              }}
            />
          </svg>
          <div className="text-center z-10 flex flex-col items-center mt-2">
            <span className={`leading-none font-bold tracking-tight text-[#21222D] dark:text-[#F8F9FA] ${hoursLeft > 0 ? 'text-[54px]' : 'text-[72px]'}`}>
              {timeString}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 font-semibold">restantes</span>
          </div>
        </div>

        {/* Subtasks Card */}
        {activity?.subtarefas && activity.subtarefas.length > 0 && (
          <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-5 mb-8 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold">
                {completedSubtasks.length} de {activity.subtarefas.length} subtarefas concluídas
              </span>
              <div className="flex gap-1.5">
                {activity.subtarefas.map((_: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentSubtaskIndex ? 'bg-[#34117E]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Interactive Subtask Area */}
            <div 
              className="flex items-start gap-3 mt-4 cursor-pointer"
              onClick={() => toggleSubtask(currentSubtaskIndex)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                completedSubtasks.includes(currentSubtaskIndex) 
                  ? 'border-[#34117E] bg-[#34117E]/20' 
                  : 'border-[#DBDBE5] dark:border-[#2A2B3D]'
              }`}>
                {completedSubtasks.includes(currentSubtaskIndex) && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34117E]" />
                )}
              </div>
              <span className={`text-[15px] font-bold ${
                completedSubtasks.includes(currentSubtaskIndex) 
                  ? 'text-neutral-400 line-through' 
                  : 'text-[#21222D] dark:text-[#F8F9FA]'
              }`}>
                {activity.subtarefas[currentSubtaskIndex]}
              </span>
            </div>
            
            {/* Navigation for subtasks if more than 1 */}
            {activity.subtarefas.length > 1 && (
              <div className="flex justify-between mt-4 border-t border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 pt-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentSubtaskIndex(prev => Math.max(0, prev - 1)); }}
                  disabled={currentSubtaskIndex === 0}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-[#34117E] disabled:opacity-30 cursor-pointer font-bold"
                >
                  Anterior
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentSubtaskIndex(prev => Math.min(activity.subtarefas.length - 1, prev + 1)); }}
                  disabled={currentSubtaskIndex === activity.subtarefas.length - 1}
                  className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-[#34117E] disabled:opacity-30 cursor-pointer font-bold"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}

        {/* Motivational Phrase */}
        <p className="text-neutral-500 dark:text-neutral-400 italic text-[15px] text-center mb-10 px-4">
          "você já passou da metade. não para agora."
        </p>

        {/* Monitoring Badge */}
        <div className="bg-white dark:bg-[#151622] px-4 py-2.5 rounded-full border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 flex items-center gap-2 shadow-sm">
          <Eye size={16} className="text-neutral-500 dark:text-neutral-400" />
          <span className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold">monitorando distrações</span>
        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent pb-safe pt-6 px-6 z-40 flex justify-center">
        <div className="w-full max-w-[390px] flex gap-3 mb-8">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 h-[56px] bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 hover:bg-neutral-50 active:scale-95 text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px] rounded-[20px] transition-all flex justify-center items-center cursor-pointer shadow-sm"
          >
            {isPaused ? 'Retomar' : 'Pausar'}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 h-[56px] bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 hover:bg-neutral-50 active:scale-95 text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px] rounded-[20px] transition-all flex justify-center items-center cursor-pointer shadow-sm"
          >
            Encerrar
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#151622] w-full max-w-[320px] rounded-[28px] p-6 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA] mb-2">Tem certeza?</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">O progresso atual será salvo, mas você está encerrando antes do tempo.</p>
            
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 hover:bg-[#DBDBE5]/60 dark:bg-[#2A2B3D]/60 text-[#21222D] dark:text-[#F8F9FA] font-bold text-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handleFinish(false);
                }}
                className="flex-1 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
              >
                Encerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
