import React, { useMemo } from 'react';
import { Flame, Book, Briefcase, Dumbbell, Activity, Bell, Settings, Clock, Plus, ChevronRight, ClipboardList, Check } from 'lucide-react';
import { DesktopSidebar } from './DesktopSidebar';
import { FocusCircle } from './FocusCircle';
import { motion } from 'motion/react';

function StatCard({ icon, value, label, bgColor, textColor, iconColor }: { icon: React.ReactNode; value: string; label: string; bgColor?: string; textColor?: string; iconColor?: string }) {
  return (
    <div className={`rounded-[20px] p-5 flex flex-col items-start transition-all shadow-sm-layered ${bgColor || 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'} hover:brightness-[0.98] border border-black/[0.02] dark:border-white/10`}>
      <div className={`mb-3.5 ${iconColor || 'text-[#21222D]/60 dark:text-[#F8F9FA]/60'}`}>
        {icon}
      </div>
      <span className={`font-mono font-bold text-sm leading-none tracking-tight mb-1 ${textColor || 'text-[#21222D] dark:text-[#F8F9FA]'}`}>{value}</span>
      <span className="text-neutral-500 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-wider leading-none">{label}</span>
    </div>
  );
}

function DailyProgressBar({ 
  tasks, 
  onNavigate,
  activeDays = new Set<number>()
}: { 
  tasks: any[]; 
  onNavigate?: (view: string) => void;
  activeDays?: Set<number>;
}) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.concluida).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 180, damping: 20 }}
      className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-5 mb-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered relative overflow-hidden"
    >
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex gap-1 shrink-0 bg-[#F3F4F6] p-2 rounded-xl border border-neutral-200/60 shadow-inner">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full shadow-sm ${activeDays.has(i) ? 'bg-[#4F46E5]' : 'bg-[#D1D5DB]'}`}
              />
            ))}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#21222D] dark:text-[#F8F9FA] block truncate leading-tight">Progresso do Dia</span>
            {totalTasks > 0 ? (
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 block truncate">
                {completedTasks} de {totalTasks} tarefas concluídas
              </span>
            ) : (
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 block truncate">
                Nenhuma tarefa para hoje
              </span>
            )}
          </div>
        </div>
        
        {totalTasks > 0 ? (
          <div className="text-right shrink-0">
            <span className="font-mono font-extrabold text-sm text-[#34117E] dark:text-[#C4B5FD] tracking-tight">
              {percent}%
            </span>
          </div>
        ) : (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate?.('tasks')}
            className="text-[10px] bg-[#34117E] hover:bg-[#2C0E6B] text-white font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.3)]"
          >
            <span>Criar tarefa</span>
            <Plus size={11} strokeWidth={2.5} />
          </motion.button>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="relative mt-4">
          {/* Main Progress Bar Container */}
          <div className="w-full h-2.5 bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 rounded-full overflow-hidden relative">
            {/* Animated filling bar */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="h-full bg-gradient-to-r from-[#34117E] to-[#5A4FAF] rounded-full relative"
            />
          </div>
          
          {/* Perfect 100% completion celebration message */}
          {percent === 100 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 flex items-center gap-1.5 text-[#21C55D] text-[10px] font-bold animate-pulse"
            >
              <div className="w-4.5 h-4.5 rounded-full bg-[#21C55D]/15 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </div>
              <span>Sensacional! Todas as tarefas de hoje foram concluídas!</span>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

interface HomeScreenProps {
  onboardingData?: any;
  onNavigate?: (view: string) => void;
  onViewHistoricActivity?: (activity: any) => void;
}

export function HomeScreen({ onboardingData, onNavigate, onViewHistoricActivity }: HomeScreenProps) {
  const userName = onboardingData?.name || localStorage.getItem('nakor_user') || 'Alex';
  const userEmail = onboardingData?.email || localStorage.getItem('nakor_user_email') || 'alex@email.com';

  // Current time/date logic
  const date = new Date();
  const hours = date.getHours();
  let greeting = 'Bom dia';
  if (hours >= 12 && hours < 18) {
    greeting = 'Boa tarde';
  } else if (hours >= 18 || hours < 5) {
    greeting = 'Boa noite';
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    weekday: 'long',
  });
  const formattedDateParts = formatter.formatToParts(date);
  const weekday = formattedDateParts.find(p => p.type === 'weekday')?.value || '';
  const day = formattedDateParts.find(p => p.type === 'day')?.value || '';
  let month = formattedDateParts.find(p => p.type === 'month')?.value || '';
  if (month.endsWith('.')) month = month.slice(0, -1);
  
  const dateDisplay = `${day} ${month} · ${weekday}`.toUpperCase();

  // Load real history for dynamic rendering
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

  // Load tasks for progress calculation
  const tasks = useMemo(() => {
    const saved = localStorage.getItem('nakor_tarefas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    }
    return [];
  }, []);

  // Calculate streak
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

  // Today's total seconds
  const todaySeconds = useMemo(() => {
    const today = new Date();
    return history
      .filter(item => {
        const d = new Date(item.timestamp);
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
      })
      .reduce((acc, item) => acc + (item.duracao_real || 0), 0);
  }, [history]);

  const displayHours = Math.floor(todaySeconds / 3600);
  const displayMinutes = Math.floor((todaySeconds % 3600) / 60);

  const totalHistorySeconds = useMemo(() => {
    return history.reduce((acc, item) => acc + (item.duracao_real || 0), 0);
  }, [history]);
  const displayTotalHistoryHours = Math.floor(totalHistorySeconds / 3600);

  // Average score
  const avgToday = useMemo(() => {
    const today = new Date();
    const todayItems = history.filter(item => {
      const d = new Date(item.timestamp);
      return d.getDate() === today.getDate() &&
             d.getMonth() === today.getMonth() &&
             d.getFullYear() === today.getFullYear();
    });
    
    if (todayItems.length === 0) return '0.0';
    const sum = todayItems.reduce((acc, item) => acc + (item.nota || 0), 0);
    return (sum / todayItems.length).toFixed(1);
  }, [history]);

  // Weekly stats
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const weekItems = history.filter(item => new Date(item.timestamp) >= startOfWeek);
    const totalSecs = weekItems.reduce((acc, item) => acc + (item.duracao_real || 0), 0);
    const totalHours = totalSecs / 3600;

    const activeDays = new Set<number>();
    weekItems.forEach(item => {
      const d = new Date(item.timestamp);
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      activeDays.add(dayIdx);
    });

    return {
      totalHours,
      activeDays
    };
  }, [history]);

  const goalHours = 15;
  const displayWeekHours = parseFloat(weeklyStats.totalHours.toFixed(1));

  const daysOfWeek = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
  const todayIndex = (date.getDay() + 6) % 7;

  const isDayActive = (idx: number) => {
    return weeklyStats.activeDays.has(idx);
  };

  const getCategoryIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('estudo') || n.includes('matemática')) return <Book size={18} strokeWidth={1.5} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('treino') || n.includes('academia') || n.includes('exerc')) return <Dumbbell size={18} strokeWidth={1.5} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('projeto') || n.includes('trabalho') || n.includes('code')) return <Briefcase size={18} strokeWidth={1.5} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    return <Activity size={18} strokeWidth={1.5} className="text-[#34117E] dark:text-[#C4B5FD]" />;
  };

  const activitiesList = useMemo(() => {
    if (history.length > 0) {
      return history.slice(0, 3).map(item => {
        const durReal = item.duracao_real || 0;
        const h = Math.floor(durReal / 3600);
        const m = Math.floor((durReal % 3600) / 60);
        const durationStr = h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
        
        const d = new Date(item.timestamp);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        let dateLabel = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
          dateLabel = 'Hoje';
        } else if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) {
          dateLabel = 'Ontem';
        }
        
        const timeLabel = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        const dateTimeStr = `${dateLabel}, ${timeLabel}`;

        return {
          name: item.nome || 'Foco',
          duration: durationStr,
          score: item.nota || 0,
          dateTimeStr,
          rawItem: item,
        };
      });
    }
    return [];
  }, [history]);

  // Progress percentage for the focus circle (8h daily goal)
  const progressPercent = Math.min((todaySeconds / (8 * 3600)), 1);


  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex flex-col md:flex-row relative z-20">
      {/* Background Texture */}
      <div 
        className="absolute inset-x-0 top-0 h-[50vh] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
      />
      
      {/* --- MOBILE CONTAINER --- */}
      <div className="md:hidden w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex justify-center pb-32 relative overflow-y-auto">
        <div className="w-full max-w-[390px] px-6 pt-10 flex flex-col items-stretch">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <span className="text-[10px] text-[#34117E] dark:text-[#C4B5FD] font-mono tracking-widest uppercase mb-1.5 block font-bold">Início / Nakor</span>
              <h1 className="text-2xl font-bold tracking-tight text-[#21222D] dark:text-[#F8F9FA]">{greeting}, {userName}</h1>
              <p className="text-[#6B7280] dark:text-neutral-400 text-[11px] mt-1 font-mono tracking-[1.5px] uppercase">{dateDisplay}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full shadow-sm-layered shrink-0 ${streak >= 1 ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]' : 'bg-[#F3F4F6]'}`}>
              <Flame size={14} strokeWidth={2} className={streak >= 1 ? 'text-white' : 'text-[#9CA3AF] dark:text-neutral-400'} />
              <span className={`font-mono font-bold text-xs ${streak >= 1 ? 'text-white' : 'text-[#9CA3AF] dark:text-neutral-400'}`}>{streak}d</span>
            </div>
          </div>

          {/* Daily Progress Bar */}
          <DailyProgressBar tasks={tasks} onNavigate={onNavigate} activeDays={weeklyStats.activeDays} />

          {/* Hero Chronometer Card */}
          <div className="w-full flex flex-col items-center mb-12 relative overflow-visible">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-mono uppercase tracking-widest mb-6 z-10 font-bold">tempo focado hoje</span>
            
            <FocusCircle
              todaySeconds={todaySeconds}
              displayHours={displayHours}
              displayMinutes={displayMinutes}
              avgToday={avgToday}
              progressPercent={progressPercent}
              size={260}
              variant="mobile"
            />
          </div>

          {/* Weekly Goal Card */}
          <div className="bg-[#34117E] rounded-[28px] p-7 mb-10 shadow-lg-layered text-white relative overflow-hidden">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-xs font-bold tracking-wider text-white/80 uppercase">Meta semanal</h3>
              <span className="text-white text-xs font-bold font-mono">{displayWeekHours}h <span className="text-white/60">/ {goalHours}h</span></span>
            </div>
            
            <div className="w-full h-1.5 bg-white/25 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                style={{ width: `${Math.min((weeklyStats.totalHours / goalHours) * 100, 100)}%` }} 
              />
            </div>

            <div className="flex justify-between items-center px-1">
              {daysOfWeek.map((day, idx) => {
                const active = isDayActive(idx);
                const isTodayDay = idx === todayIndex;
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        active 
                          ? 'bg-white' 
                          : 'bg-white/30'
                      } ${
                        isTodayDay
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#34117E]' 
                          : ''
                      }`} 
                    />
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isTodayDay ? 'text-white font-bold' : 'text-white/60'}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mb-10">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-[#21222D]/70 dark:text-[#F8F9FA]/70 text-xs font-bold uppercase tracking-wider pl-1">Atividades recentes</h3>
              <button 
                onClick={() => onNavigate?.('history')}
                className="text-[#34117E] dark:text-[#C4B5FD] text-xs font-bold hover:text-[#21222D] dark:hover:text-[#F8F9FA] transition-all cursor-pointer flex items-center gap-0.5"
              >
                Ver todas <ChevronRight size={12} strokeWidth={2} />
              </button>
            </div>
            
            <div className="space-y-4">
              {activitiesList.length === 0 ? (
                <div className="w-full text-center py-10 bg-white dark:bg-[#151622] rounded-[28px] border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 text-xs text-neutral-500 dark:text-neutral-400 font-medium shadow-sm-layered">
                  Nenhuma atividade registrada ainda.
                </div>
              ) : (
                activitiesList.map((act, i) => (
                  <div 
                    key={i} 
                    onClick={() => onViewHistoricActivity?.(act.rawItem)}
                    className="w-full bg-white dark:bg-[#151622] p-5 rounded-[20px] flex items-center justify-between border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:border-[#34117E]/40 shadow-md-layered transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[16px] bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center shrink-0 text-[#21222D]/80 dark:text-[#F8F9FA]/80">
                        {getCategoryIcon(act.name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#21222D] dark:text-[#F8F9FA] text-sm tracking-tight">{act.name}</h4>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium mt-0.5">{act.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{act.dateTimeStr.split(',')[0]}</span>
                      <div className="h-6 px-2.5 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                        <span className="text-[#34117E] dark:text-[#C4B5FD] font-mono font-bold text-xs">{act.score.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New Activity button inside scroll view */}
          <button 
            onClick={() => onNavigate?.('new_activity')}
            className="w-full h-[56px] bg-[#34117E] hover:bg-[#260b61] active:scale-95 text-white font-bold text-[16px] rounded-[16px] flex justify-center items-center gap-2 transition-all cursor-pointer shadow-md-layered mb-8"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Nova Atividade</span>
          </button>

        </div>
      </div>

      <DesktopSidebar currentView="home" onNavigate={onNavigate} userName={userName} userEmail={userEmail} />

      {/* --- DESKTOP MAIN CONTENT --- */}
      <div className="hidden md:flex w-full md:pl-[240px] justify-start pb-10 relative overflow-y-auto min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14]">
        <div className="w-full max-w-[1180px] mx-auto p-10 xl:p-12 flex gap-10 items-start text-[#21222D] dark:text-[#F8F9FA]">
          
          {/* Middle Column (Main Content Area) */}
          <div className="flex-1 min-w-0 max-w-[620px] flex flex-col bg-transparent">

            
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="text-[10px] text-[#34117E] dark:text-[#C4B5FD] font-mono tracking-widest uppercase mb-1.5 block font-bold">PAINEL DE EVOLUÇÃO</span>
                <h1 className="text-3xl font-bold tracking-tight text-[#21222D] dark:text-[#F8F9FA]">
                  {greeting}, <span className="text-[#21222D]/80 dark:text-[#F8F9FA]/80">{userName}</span>
                </h1>
                <p className="text-[#6B7280] dark:text-neutral-400 text-[11px] mt-1 font-mono tracking-[1.5px] uppercase">{dateDisplay}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert('Configurações da Conta no menu Perfil.')} 
                  className="w-10 h-10 rounded-[16px] bg-white dark:bg-[#151622] border border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60 flex items-center justify-center text-[#21222D] dark:text-[#F8F9FA] hover:border-[#34117E]/40 hover:shadow-sm-layered transition-all cursor-pointer shadow-sm-layered"
                  title="Configurações"
                >
                  <Settings size={16} strokeWidth={2} />
                </button>
                <div className={`flex items-center gap-1.5 px-4 h-10 rounded-full shadow-sm-layered shrink-0 ${streak >= 1 ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]' : 'bg-[#F3F4F6]'}`}>
                  <Flame size={15} strokeWidth={2.5} className={streak >= 1 ? 'text-white' : 'text-[#9CA3AF] dark:text-neutral-400'} />
                  <span className={`font-mono font-bold text-sm ${streak >= 1 ? 'text-white' : 'text-[#9CA3AF] dark:text-neutral-400'}`}>{streak}d</span>
                </div>
              </div>
            </div>

            {/* Daily Progress Bar */}
            <DailyProgressBar tasks={tasks} onNavigate={onNavigate} activeDays={weeklyStats.activeDays} />

            {/* Desktop Hero Chronometer Card */}
            <div className="w-full flex flex-col items-center mb-10 relative overflow-hidden rounded-[32px] bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-md-layered py-10 px-8">
               <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-[#34117E]/[0.07] blur-[80px]" />

               <h3 className="relative text-xs font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase mb-8 z-10">Tempo de foco hoje</h3>

               <div className="relative z-10">
                 <FocusCircle
                    todaySeconds={todaySeconds}
                    displayHours={displayHours}
                    displayMinutes={displayMinutes}
                    avgToday={avgToday}
                    progressPercent={progressPercent}
                    size={280}
                    variant="desktop"
                  />
               </div>
            </div>


            {/* Recent Activities (Desktop) */}
            <div className="w-full bg-transparent">
              <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-xs font-bold tracking-wider text-[#21222D]/70 dark:text-[#F8F9FA]/70 uppercase pl-1">Atividades recentes</h3>
                <button 
                  onClick={() => onNavigate?.('history')} 
                  className="text-[#34117E] dark:text-[#C4B5FD] text-xs font-bold hover:text-[#21222D] dark:hover:text-[#F8F9FA] transition-all cursor-pointer flex items-center gap-0.5"
                >
                  Ver todas <ChevronRight size={12} strokeWidth={2} />
                </button>
              </div>
              
              <div className="space-y-4">
                {activitiesList.length === 0 ? (
                  <div className="w-full text-center py-14 bg-white dark:bg-[#151622] rounded-[28px] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 text-sm text-neutral-500 dark:text-neutral-400 font-medium shadow-sm-layered">
                    Nenhuma atividade registrada ainda.
                  </div>
                ) : (
                  activitiesList.map((act, i) => (
                    <div 
                      key={i} 
                      onClick={() => onViewHistoricActivity?.(act.rawItem)}
                      className="w-full bg-white dark:bg-[#151622] p-5 rounded-[20px] flex items-center justify-between border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:border-[#34117E]/40 hover:shadow-md-layered cursor-pointer transition-all shadow-sm-layered"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[16px] bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center shrink-0 text-[#21222D]/80 dark:text-[#F8F9FA]/80">
                          {getCategoryIcon(act.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#21222D] dark:text-[#F8F9FA] text-sm tracking-tight">{act.name}</h4>
                          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium mt-0.5">{act.dateTimeStr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">{act.duration}</span>
                        <div className="h-6 px-2.5 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                          <span className="text-[#34117E] dark:text-[#C4B5FD] font-mono font-bold text-xs">{act.score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column (Widgets) */}
          <div className="w-[300px] shrink-0 flex flex-col gap-8 bg-transparent">
            
            {/* Meta semanal (Desktop) */}
            <div className="w-full bg-[#34117E] rounded-[28px] p-8 shadow-lg-layered text-white relative overflow-hidden">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-xs font-bold tracking-wider text-white/80 uppercase">Meta semanal</h3>
                <span className="text-white text-xs font-bold font-mono">{displayWeekHours}h <span className="text-white/60">/ {goalHours}h</span></span>
              </div>
              
              <div className="w-full h-1.5 bg-white/25 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                  style={{ width: `${Math.min((weeklyStats.totalHours / goalHours) * 100, 100)}%` }} 
                />
              </div>

              <div className="flex justify-between items-center px-1">
                {daysOfWeek.map((day, idx) => {
                  const active = isDayActive(idx);
                  const isTodayDay = idx === todayIndex;
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          active ? 'bg-white' : 'bg-white/30'
                        } ${
                          isTodayDay
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#34117E]' 
                            : ''
                        }`} 
                      />
                      <span className={`text-[10px] font-mono tracking-wider uppercase ${isTodayDay ? 'text-white font-bold' : 'text-white/60'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estatísticas (Desktop) */}
            <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
              <h3 className="text-xs font-bold tracking-wider text-[#21222D]/70 dark:text-[#F8F9FA]/70 uppercase mb-5">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4.5">
                <StatCard 
                  icon={<Clock size={16} strokeWidth={2.5} />} 
                  value={`${displayHours}h ${displayMinutes}m`} 
                  label="Hoje" 
                  bgColor="bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40" 
                  textColor="text-[#21222D] dark:text-[#F8F9FA]" 
                  iconColor="text-[#21222D]/60 dark:text-[#F8F9FA]/60" 
                />
                <StatCard 
                  icon={<Flame size={16} strokeWidth={2.5} />} 
                  value={`${streak}`} 
                  label="Sequência" 
                  bgColor="bg-[#ACD1FD] dark:bg-[#2B2A48]" 
                  textColor="text-[#21222D] dark:text-[#F8F9FA]" 
                  iconColor="text-[#21222D]/60 dark:text-[#F8F9FA]/60" 
                />
                <StatCard 
                  icon={<Activity size={16} strokeWidth={2.5} />} 
                  value={`${avgToday}`} 
                  label="Média" 
                  bgColor="bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40" 
                  textColor="text-[#21222D] dark:text-[#F8F9FA]" 
                  iconColor="text-[#21222D]/60 dark:text-[#F8F9FA]/60" 
                />
                <StatCard 
                  icon={<Clock size={16} strokeWidth={2.5} />} 
                  value={`${displayTotalHistoryHours}h`} 
                  label="Tempo Total" 
                  bgColor="bg-[#ACD1FD] dark:bg-[#2B2A48]" 
                  textColor="text-[#21222D] dark:text-[#F8F9FA]" 
                  iconColor="text-[#21222D]/60 dark:text-[#F8F9FA]/60" 
                />
              </div>
            </div>
            
            {/* New Activity trigger button */}
            <button 
              onClick={() => onNavigate?.('new_activity')}
              className="w-full h-[56px] bg-[#34117E] hover:bg-[#260b61] active:scale-95 text-white font-bold text-[16px] rounded-[16px] flex justify-center items-center gap-2 transition-all cursor-pointer shadow-md-layered"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Nova Atividade</span>
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}
