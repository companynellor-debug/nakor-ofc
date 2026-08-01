import { DesktopSidebar } from './DesktopSidebar';

import React,

 { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  ChevronRight, 
  Star, 
  ClipboardList, 
  X,
  Plus,
  Target,
  Lock,
  Clock
} from 'lucide-react';

interface Task {
  id: string;
  nome: string;
  duracao: string;
  concluida: boolean;
  criadaEm: string;
}

interface TasksScreenProps {
  onboardingData?: any;
  onNavigate?: (view: any) => void;
}

// Custom Premium Hexagon Coin Icon matching the design exactly
const CoinIcon = ({ className = "w-5 h-5 text-[#34117E] dark:text-[#C4B5FD]" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" className="fill-transparent" />
    <polygon points="12 6 17 9.5 17 14.5 12 18 7 14.5 7 9.5" className="fill-current" />
  </svg>
);

// High-fidelity stacked coins representation in SVG and pure CSS
const StackedCoins = () => (
  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
    {/* Coin 1 - Back */}
    <div className="absolute w-10 h-6 bg-[#35298A] rounded-full border border-[#5A4FAF] shadow-md transform -translate-y-2 -translate-x-1 rotate-[-12deg] flex items-center justify-center">
      <div className="w-8 h-4 bg-[#34117E] rounded-full flex items-center justify-center border border-white/10">
        <span className="text-[9px] font-black text-white leading-none font-mono">N</span>
      </div>
    </div>
    {/* Coin 2 - Middle */}
    <div className="absolute w-10 h-6 bg-[#35298A] rounded-full border border-[#5A4FAF] shadow-md transform translate-y-1 translate-x-2 rotate-[8deg] flex items-center justify-center">
      <div className="w-8 h-4 bg-[#34117E] rounded-full flex items-center justify-center border border-white/10">
        <span className="text-[9px] font-black text-white leading-none font-mono">N</span>
      </div>
    </div>
    {/* Coin 3 - Front */}
    <div className="absolute w-10 h-6 bg-[#5A4FAF] rounded-full border border-[#34117E] shadow-lg transform translate-y-4 -translate-x-2 rotate-[-5deg] flex items-center justify-center">
      <div className="w-8 h-4 bg-[#34117E] rounded-full flex items-center justify-center border border-white/10">
        <span className="text-[9px] font-black text-white leading-none font-mono">N</span>
      </div>
    </div>
  </div>
);

export function TasksScreen({ onboardingData, onNavigate }: TasksScreenProps) {
  const userName = onboardingData?.name || localStorage.getItem('nakor_user') || 'Alex';
  const userEmail = onboardingData?.email || localStorage.getItem('nakor_user_email') || 'alex@email.com';

  // Load tasks from localStorage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('30min');

  // Tabs navigation states
  const [activeMainTab, setActiveMainTab] = useState<'tarefas' | 'desafios'>('tarefas');
  const [activeSubTab, setActiveSubTab] = useState<'diarios' | 'semanais'>('diarios');
  
  // Real history list for calculating challenges progress
  const [history, setHistory] = useState<any[]>([]);

  // Reload history whenever user accesses the challenges view
  useEffect(() => {
    const raw = localStorage.getItem('nakor_historico');
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, [activeMainTab]);

  // Dynamic countdown to midnight (23:59:59) for daily challenge
  const [timeLeftToday, setTimeLeftToday] = useState('23:59:59');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeftToday('00:00:00');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeLeftToday(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time remaining for weekly challenge
  const timeLeftWeekly = useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date(today);
    // End of week: next Saturday 23:59:59
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const diff = endOfWeek.getTime() - today.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `Termina em ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `Termina em ${hours}h`;
  }, []);

  // Calculate real progress from history (NO FAKE DATA)
  const todayFocusMinutes = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    const todaySessions = history.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startOfToday && itemDate <= endOfToday;
    });
    
    const totalSeconds = todaySessions.reduce((acc, item) => acc + (item.duracao_real || 0), 0);
    return Math.floor(totalSeconds / 60);
  }, [history]);

  const weeklyFocusHours = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    let totalSeconds = 0;
    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
        totalSeconds += (item.duracao_real || 0);
      }
    });
    return totalSeconds / 3600;
  }, [history]);

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

  useEffect(() => {
    const saved = localStorage.getItem('nakor_tarefas');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    } else {
      // Initialize empty array if none exists
      localStorage.setItem('nakor_tarefas', JSON.stringify([]));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('nakor_tarefas', JSON.stringify(newTasks));
  };

  // Date formatting matching "5 de julho, domingo"
  const dateDisplay = useMemo(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });
    const formattedDateParts = formatter.formatToParts(date);
    const weekday = formattedDateParts.find(p => p.type === 'weekday')?.value || '';
    const day = formattedDateParts.find(p => p.type === 'day')?.value || '';
    const month = formattedDateParts.find(p => p.type === 'month')?.value || '';
    return `${day} de ${month}, ${weekday}`;
  }, []);

  // Calculate meta states
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.concluida).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Circle configuration for meta progress SVG
  const radius = 22;
  const strokeDasharray = radius * 2 * Math.PI;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent / 100);

  // Smart Tip Text based on onboardingData
  const productiveTip = useMemo(() => {
    const savedOnboarding = onboardingData || JSON.parse(localStorage.getItem('nakor_onboarding') || '{}');
    const time = savedOnboarding?.productiveTime || 'Manhã';
    
    if (time.toLowerCase().includes('noite')) {
      return "Você costuma ser mais produtivo à noite. Que tal começar agora?";
    } else if (time.toLowerCase().includes('tarde')) {
      return "Você costuma ser mais produtivo à tarde. Que tal começar agora?";
    } else {
      return "Você costuma ser mais produtivo de manhã. Que tal começar agora?";
    }
  }, [onboardingData]);

  // Durations choices
  const durations = ['15min', '30min', '45min', '60min', '90min', '2h'];

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, concluida: !t.concluida };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      nome: taskName.trim(),
      duracao: selectedDuration,
      concluida: false,
      criadaEm: new Date().toISOString()
    };

    const updated = [...tasks, newTask];
    saveTasks(updated);
    
    // Reset form & close modal
    setTaskName('');
    setSelectedDuration('30min');
    setIsModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex flex-col md:flex-row relative">
      <DesktopSidebar currentView="tasks" onNavigate={onNavigate} userName={userName} userEmail={userEmail} />
      
      <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto select-none">
        <div className="w-full max-w-[390px] md:max-w-[1000px] md:p-10 px-6 pt-10 flex flex-col items-center">

        
        {/* Main Navigation Tabs */}
        <div className="w-full max-w-[400px] bg-[#DBDBE5]/35 dark:bg-[#2A2B3D]/35 p-1.5 rounded-full flex mb-10 select-none shrink-0 self-center md:self-start">
          <button 
            onClick={() => setActiveMainTab('tarefas')}
            className={`flex-1 py-2.5 text-center font-bold text-sm tracking-tight transition-all rounded-full cursor-pointer ${
              activeMainTab === 'tarefas' 
                ? 'bg-white dark:bg-[#151622] text-[#34117E] dark:text-[#C4B5FD] shadow-sm-layered' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA]'
            }`}
          >
            Tarefas
          </button>
          <button 
            onClick={() => setActiveMainTab('desafios')}
            className={`flex-1 py-2.5 text-center font-bold text-sm tracking-tight transition-all rounded-full cursor-pointer ${
              activeMainTab === 'desafios' 
                ? 'bg-white dark:bg-[#151622] text-[#34117E] dark:text-[#C4B5FD] shadow-sm-layered' 
                : 'text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA]'
            }`}
          >
            Desafios
          </button>
        </div>

        {activeMainTab === 'tarefas' ? (
          <div className="w-full flex flex-col">
            {/* Header */}
            <div className="w-full flex justify-between items-center gap-4 mb-10 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 shrink-0">
                <h1 className="text-3xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">Tarefas</h1>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-[#34117E] hover:bg-[#250b61] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(52,17,126,0.3)] hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Adicionar Tarefa"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
              <div className="bg-white dark:bg-[#151622] px-4 py-2 rounded-full border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm-layered whitespace-nowrap shrink-0">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold capitalize whitespace-nowrap">{dateDisplay}</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              {/* Left Column (Tasks Checklist) */}
              <div className="md:col-span-2 space-y-6 w-full flex flex-col">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider pl-1">
                  Hoje
                </span>

                {/* Checklist Container */}
                <div className="w-full space-y-4">
                  {tasks.length === 0 ? (
                    /* Estado vazio */
                    <div className="w-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 rounded-[28px] py-14 px-6 flex flex-col items-center justify-center text-center shadow-sm-layered">
                      <ClipboardList className="text-neutral-300 mb-3.5 animate-pulse" size={40} strokeWidth={1.5} />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-[200px]">
                        Nenhuma tarefa ainda. Adicione sua primeira!
                      </p>
                    </div>
                  ) : (
                    /* Tasks List */
                    tasks.map(task => (
                      <div 
                        key={task.id}
                        className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 flex items-center justify-between border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:border-[#34117E]/30 shadow-sm-layered hover:shadow-md-layered transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Checkbox circular */}
                          <button 
                            onClick={() => handleToggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              task.concluida 
                                ? 'bg-[#34117E] border-[#34117E] text-white' 
                                : 'border-[#DBDBE5] dark:border-[#2A2B3D] hover:border-[#34117E]/60 text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={3} className={task.concluida ? 'block' : 'opacity-0'} />
                          </button>
                          
                          {/* Nome e duração */}
                          <div className="flex flex-col min-w-0" onClick={() => handleToggleTask(task.id)}>
                            <span className={`text-[15px] font-bold tracking-tight truncate cursor-pointer transition-all ${
                              task.concluida 
                                ? 'line-through text-neutral-400' 
                                : 'text-[#21222D] dark:text-[#F8F9FA]'
                            }`}>
                              {task.nome}
                            </span>
                            <span className="text-xs text-neutral-400 font-bold mt-0.5">
                              {task.duracao}
                            </span>
                          </div>
                        </div>

                        {/* Seta › */}
                        <ChevronRight size={18} className="text-[#21222D]/40 dark:text-[#F8F9FA]/40 shrink-0 ml-2" />
                      </div>
                    ))
                  )}
                </div>

                {/* Botão Adicionar tarefa */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-[#34117E] hover:bg-[#250b61] text-white text-[15px] font-extrabold rounded-[20px] shadow-[0_10px_25px_-5px_rgba(52,17,126,0.35)] hover:shadow-[0_14px_30px_-5px_rgba(52,17,126,0.45)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2.5 cursor-pointer mt-4 border border-[#34117E]/10"
                >
                  <Plus size={18} strokeWidth={3} className="text-white" />
                  <span>Adicionar Nova Tarefa</span>
                </button>
              </div>

              {/* Right Column (Goal and Tip Widget) */}
              <div className="space-y-6 w-full flex flex-col">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider pl-1 hidden md:block opacity-0">
                  Resumo
                </span>

                {/* Card meta de hoje */}
                <div className="w-full bg-[#21222D] rounded-[28px] p-7 shadow-lg-layered flex flex-col relative overflow-hidden text-white">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <span className="text-xs text-white/60 font-bold uppercase tracking-wider block mb-1">
                        Meta de hoje
                      </span>
                      <span className="text-lg font-bold text-white">
                        {completedTasks} de {totalTasks} atividades
                      </span>
                    </div>
                    
                    {/* SVG Progress Circle */}
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                           cx="28"
                           cy="28"
                           r={radius}
                           className="fill-transparent stroke-white/[0.06]"
                           strokeWidth="3.5"
                        />
                        <circle
                           cx="28"
                           cy="28"
                           r={radius}
                           className="fill-transparent stroke-[#34117E] transition-all duration-500"
                           strokeWidth="3.5"
                           strokeLinecap="round"
                           strokeDasharray={strokeDasharray}
                           strokeDashoffset={strokeDashoffset}
                        />
                      </svg>
                      <span className="text-white font-extrabold text-[13px] z-10">
                        {progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#34117E] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Card dica inteligente */}
                <div className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 border-l-4 border-l-[#34117E] flex items-start gap-3 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
                  <Star className="text-[#34117E] dark:text-[#C4B5FD] fill-none shrink-0 mt-0.5" size={20} strokeWidth={2} />
                  <p className="text-[#21222D] dark:text-[#F8F9FA] text-sm font-semibold leading-relaxed">
                    {productiveTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            {/* Header Desafios */}
            <div className="w-full flex justify-between items-center mb-5">
              <h1 className="text-3xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">Desafios</h1>
            </div>

            {/* Sub-abas */}
            <div className="w-full max-w-[320px] bg-[#DBDBE5]/35 dark:bg-[#2A2B3D]/35 p-1 rounded-full flex mb-8 select-none self-start">
              <button 
                onClick={() => setActiveSubTab('diarios')}
                className={`flex-1 py-2 text-center font-bold text-xs transition-all rounded-full cursor-pointer ${
                  activeSubTab === 'diarios' 
                    ? 'bg-white dark:bg-[#151622] text-[#34117E] dark:text-[#C4B5FD] shadow-sm-layered' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA]'
                }`}
              >
                Diários
              </button>
              <button 
                onClick={() => setActiveSubTab('semanais')}
                className={`flex-1 py-2 text-center font-bold text-xs transition-all rounded-full cursor-pointer ${
                  activeSubTab === 'semanais' 
                    ? 'bg-white dark:bg-[#151622] text-[#34117E] dark:text-[#C4B5FD] shadow-sm-layered' 
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA]'
                }`}
              >
                Semanais
              </button>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              {/* Left Column (Challenges List) */}
              <div className="md:col-span-2 space-y-5 w-full">
                {activeSubTab === 'diarios' ? (
                  <div className="space-y-5">
                    {/* Card 1: Destaque */}
                    <div className="w-full bg-[#21222D] rounded-[28px] p-7 shadow-lg-layered flex flex-col relative overflow-hidden text-left text-white border border-white/[0.04]">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                           <Target size={22} className="text-[#C4B5FD]" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C4B5FD]/15 text-[#C4B5FD] text-[9px] font-extrabold uppercase tracking-wider mb-1.5 border border-[#C4B5FD]/30">
                            DESAFIO DIÁRIO
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-tight tracking-tight">
                            Foque por 1h sem sair do app
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(196,181,253,0.5)]"
                            style={{ width: `${Math.min((todayFocusMinutes / 60) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <span className="text-xs font-bold text-white/60">
                            <span className="text-[#C4B5FD]">{todayFocusMinutes}</span> / 60 min
                          </span>
                        </div>
                      </div>


                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                          <Clock size={13} className="text-white/50" />
                          <span>Termina em {timeLeftToday}</span>
                        </div>
                        <button 
                          onClick={() => onNavigate?.('new_activity')}
                          className="bg-[#5B34C7] hover:bg-[#4A2AA8] text-white font-extrabold text-xs px-5 py-2.5 rounded-[16px] transition-all shadow-md-layered cursor-pointer"
                        >
                          Iniciar
                        </button>

                      </div>
                    </div>

                    {/* Card 2: Concluído */}
                    <div className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered flex items-center justify-between text-left">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full border border-[#34117E]/30 bg-[#34117E]/5 flex items-center justify-center shrink-0">
                          <Check size={22} className="text-[#34117E] dark:text-[#C4B5FD]" strokeWidth={3} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#34117E]/10 text-[#34117E] dark:text-[#C4B5FD] text-[9px] font-extrabold uppercase tracking-wider mb-1.5">
                            DESAFIO DIÁRIO
                          </span>
                          <h3 className="text-sm font-bold text-neutral-400 line-through leading-tight tracking-tight">
                            Complete 5 tarefas hoje
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-[#34117E]/10 px-3 py-1.5 rounded-xl border border-[#34117E]/20 shrink-0">
                        <CoinIcon className="w-4 h-4 text-[#34117E] dark:text-[#C4B5FD]" />
                        <span className="text-sm font-extrabold text-[#34117E] dark:text-[#C4B5FD]">+60</span>
                      </div>
                    </div>

                    {/* Card 3: Bloqueado */}
                    <div className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-sm-layered flex items-center justify-between text-left opacity-50">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center shrink-0 border border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60">
                          <Lock size={18} className="text-neutral-500 dark:text-neutral-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 text-neutral-500 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-wider mb-1.5">
                            DESAFIO DIÁRIO
                          </span>
                          <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 leading-tight tracking-tight">
                            Use o modo foco por 2h
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 px-3 py-1.5 rounded-xl shrink-0">
                        <CoinIcon className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-extrabold text-neutral-400">+100</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Card 1: Destaque */}
                    <div className="w-full bg-[#21222D] rounded-[28px] p-7 shadow-lg-layered flex flex-col relative overflow-hidden text-left text-white border border-white/[0.04]">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.08]">
                          <Target size={22} className="text-[#34117E] dark:text-[#C4B5FD]" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#34117E]/15 text-[#34117E] dark:text-[#C4B5FD] text-[9px] font-extrabold uppercase tracking-wider mb-1.5 border border-[#34117E]/30">
                            DESAFIO SEMANAL
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-tight tracking-tight">
                            Acumule 10h de foco essa semana
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#34117E] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,17,126,0.4)]"
                            style={{ width: `${Math.min((weeklyFocusHours / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <span className="text-xs font-bold text-white/60">
                            <span className="text-[#34117E] dark:text-[#C4B5FD]">{weeklyFocusHours.toFixed(1)}h</span> / 10h
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                          <Clock size={13} className="text-white/50" />
                          <span>{timeLeftWeekly}</span>
                        </div>
                        <button 
                          onClick={() => onNavigate?.('new_activity')}
                          className="bg-[#34117E] hover:bg-[#260b61] text-white font-extrabold text-xs px-5 py-2.5 rounded-[16px] transition-all shadow-md-layered cursor-pointer"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Streak */}
                    <div className="w-full bg-[#34117E] rounded-[28px] p-7 shadow-lg-layered flex flex-col text-left text-white">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 text-center">
                          <span className="text-xl">🔥</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[9px] font-bold uppercase tracking-wider mb-1.5">
                            DESAFIO SEMANAL
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-tight tracking-tight">
                            Mantenha streak por 7 dias
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-1">
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                            style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-white/70">
                            <span className="text-white">{Math.min(streak, 7)}</span> / 7 dias
                          </span>
                          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/20">
                            <CoinIcon className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-extrabold text-white">+300 coins</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Bloqueado (Média) */}
                    <div className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-sm-layered flex flex-col text-left opacity-50">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center shrink-0 border border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60">
                          <Lock size={18} className="text-neutral-500 dark:text-neutral-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 text-neutral-400 text-[9px] font-bold uppercase tracking-wider mb-1.5">
                            DESAFIO SEMANAL
                          </span>
                          <h3 className="text-base font-extrabold text-[#21222D] dark:text-[#F8F9FA] leading-tight tracking-tight">
                            Atinja nota média 9.0
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-1">
                        <div className="w-full h-2 bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white/[0.05] rounded-full transition-all duration-500"
                            style={{ width: `0%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-neutral-400">
                            <span>0.0</span> / 9.0
                          </span>
                          <div className="flex items-center gap-1.5 bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 px-3 py-1 rounded-xl">
                            <CoinIcon className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-xs font-extrabold text-neutral-400">+500 coins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Rewards Banner & Stats) */}
              <div className="space-y-6 w-full flex flex-col">
                {/* Banner moedas */}
                <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered flex flex-col items-center text-center">
                  <StackedCoins />
                  <div className="text-center mt-4">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">
                      Recompensas Ativas
                    </p>
                    <p className="text-2xl font-extrabold text-[#34117E] dark:text-[#C4B5FD] tracking-tight mt-1.5">
                      +680 coins
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mt-2.5 max-w-[200px] mx-auto">
                      Conclua seus desafios diários e semanais para acumular moedas e resgatar prêmios incríveis na Loja Nakor!
                    </p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="w-full bg-[#34117E]/10 rounded-[20px] p-5 border border-[#34117E]/20 flex flex-col text-left shadow-sm-layered">
                  <span className="text-xs text-[#34117E] dark:text-[#C4B5FD] font-bold uppercase tracking-widest mb-2 block">DICA DE SUCESSO</span>
                  <p className="text-[#21222D]/80 dark:text-[#F8F9FA]/80 text-xs font-semibold leading-relaxed">
                    Sua meta semanal de foco pode ser atingida com apenas duas sessões de 45 minutos por dia. Mantenha a consistência!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal Bottom Sheet with slide up style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-[390px] bg-white dark:bg-[#151622] rounded-t-[32px] border-t border-[#DBDBE5] dark:border-[#2A2B3D] p-6 pb-12 z-10 shadow-2xl flex flex-col transform translate-y-0 transition-transform duration-300">
            {/* Header / Drag Indicator */}
            <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-5" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">Nova tarefa</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-[#DBDBE5]/60 dark:bg-[#2A2B3D]/60 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-6">
              {/* Nome da tarefa */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Nome da tarefa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Estudar Matemática"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-white dark:bg-[#151622] border border-[#DBDBE5] dark:border-[#2A2B3D] focus:border-[#34117E] text-[#21222D] dark:text-[#F8F9FA] text-sm rounded-[16px] px-4 py-4 outline-none transition-all placeholder:text-neutral-400 font-bold"
                  required
                  autoFocus
                />
              </div>

              {/* Duração */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Duração estimada
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-3 text-xs font-bold rounded-[16px] border transition-all cursor-pointer ${
                        selectedDuration === dur
                           ? 'bg-[#34117E] border-[#34117E] text-white shadow-sm-layered'
                           : 'bg-white dark:bg-[#151622] border-[#DBDBE5]/60 dark:border-[#2A2B3D]/60 text-[#21222D] dark:text-[#F8F9FA] hover:bg-neutral-50 shadow-sm-layered'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                className="w-full bg-[#34117E] hover:bg-[#260b61] active:scale-95 text-white font-bold py-4 rounded-[16px] text-sm transition-all shadow-md-layered mt-2 cursor-pointer flex justify-center items-center"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}