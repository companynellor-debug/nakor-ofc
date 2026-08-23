import { DesktopSidebar } from './DesktopSidebar';
import { useT } from '../lib/i18n';
import { useActivities } from '../hooks/useActivities';
import { useProjects } from '../hooks/useProjects';
import { useProgress } from '../hooks/useProgress';
import { useCardPreferences } from '../hooks/useCardPreferences';
import { WeeklyWorkCard } from './cards/WeeklyWorkCard';
import { MonthlyWorkCard } from './cards/MonthlyWorkCard';
import { copyCardToClipboard } from '../utils/cardExport';
import { Copy, Check, Loader2 } from 'lucide-react';


import React,

 { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  ClipboardList, 
  BarChart2, 
  User, 
  Book, 
  Dumbbell, 
  Code, 
  Pencil, 
  Laptop, 
  Activity,
  SlidersHorizontal
} from 'lucide-react';

interface HistoryScreenProps {
  onboardingData?: any;
  onNavigate: (view: string) => void;
  onViewHistoricActivity?: (activity: any) => void;
}

export function HistoryScreen({ onboardingData, onNavigate, onViewHistoricActivity }: HistoryScreenProps) {
  const t = useT();
  const userName = onboardingData?.name || localStorage.getItem('nakor_user') || 'Alex';
  const userEmail = onboardingData?.email || localStorage.getItem('nakor_user_email') || 'alex@email.com';

  const [history, setHistory] = useState<any[]>([]);
  const { updateActivity, deleteActivity } = useActivities();
  const { projects, createProject } = useProjects();
  const [editing, setEditing] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  // Cards compartilháveis (semana / mês) gerados a partir do progresso real
  const { theme } = useCardPreferences();
  const { summary: weekSummary } = useProgress('week');
  const { summary: monthSummary } = useProgress('month');
  const weekCardRef = React.useRef<HTMLDivElement>(null);
  const monthCardRef = React.useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<{ id: 'week' | 'month'; state: 'loading' | 'done' } | null>(null);

  const copyPeriodCard = async (id: 'week' | 'month') => {
    setCopyState({ id, state: 'loading' });
    const node = id === 'week' ? weekCardRef.current : monthCardRef.current;
    const result = await copyCardToClipboard(node, `nakor-${id === 'week' ? 'semana' : 'mes'}.png`);
    if (result === 'error') {
      setCopyState(null);
      return;
    }
    setCopyState({ id, state: 'done' });
    setTimeout(() => setCopyState(null), 1800);
  };

  const CopyCardButton = ({ id }: { id: 'week' | 'month' }) => {
    const active = copyState?.id === id ? copyState.state : 'idle';
    return (
      <button
        onClick={() => copyPeriodCard(id)}
        disabled={active === 'loading'}
        className="h-8 px-3 rounded-full bg-[#34117E] dark:bg-[#7C3AED] text-white text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-70 cursor-pointer shrink-0"
      >
        {active === 'loading' ? (
          <Loader2 size={13} className="animate-spin" />
        ) : active === 'done' ? (
          <Check size={13} />
        ) : (
          <Copy size={13} />
        )}
        {active === 'done' ? t('Copiado!') : t('Copiar card')}
      </button>
    );
  };

  const loadHistory = () => {
    const raw = localStorage.getItem('nakor_historico');
    if (!raw) {
      setHistory([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  };

  useEffect(() => {
    loadHistory();
    const handler = () => loadHistory();
    window.addEventListener('nakor_activities_updated', handler);
    return () => window.removeEventListener('nakor_activities_updated', handler);
  }, []);

  const openEditor = (item: any) => {
    setEditing(item);
    setEditName(item.nome || '');
    setEditProjectId(item.projeto_id ?? null);
    setNewProjectName('');
  };

  const saveEditor = async () => {
    if (!editing) return;
    let projectId = editProjectId;
    let projectName = projects.find((p) => p.id === projectId)?.name ?? null;

    if (newProjectName.trim()) {
      const created = await createProject(newProjectName);
      if (created) {
        projectId = created.id;
        projectName = created.name;
      }
    }

    await updateActivity(String(editing.id ?? editing.timestamp), {
      title: editName.trim() || t('Atividade'),
      projectId: projectId ?? null,
      projectName: projectId ? projectName : null,
    });
    setEditing(null);
    loadHistory();
  };

  const removeActivity = async () => {
    if (!editing) return;
    await deleteActivity(String(editing.id ?? editing.timestamp));
    setEditing(null);
    loadHistory();
  };


  const getCategoryIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('estudo') || n.includes('livro')) return <Book size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('treino') || n.includes('academia') || n.includes('exerc')) return <Dumbbell size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('code') || n.includes('projeto') || n.includes('program')) return <Code size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('escrever') || n.includes('redação') || n.includes('texto') || n.includes('leitura')) return <Pencil size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    if (n.includes('trabalho') || n.includes('reunião')) return <Laptop size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
    return <Activity size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />;
  };

  // Streak calculation (same as HomeScreen/ProfileScreen)
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

  // Process data for Weekly Chart (S M T Q Q S S - Sunday to Saturday)
  const weeklyData = useMemo(() => {
    const days = [
      { label: 'S', name: t('Domingo'), hours: 0 },
      { label: 'M', name: t('Segunda'), hours: 0 },
      { label: 'T', name: t('Terça'), hours: 0 },
      { label: 'Q', name: t('Quarta'), hours: 0 },
      { label: 'Q', name: t('Quinta'), hours: 0 },
      { label: 'S', name: t('Sexta'), hours: 0 },
      { label: 'S', name: t('Sábado'), hours: 0 },
    ];

    if (history.length === 0) {
      return {
        days,
        totalHours: 0,
        maxHours: 0,
        average: '0.0',
        bestDayName: t('-'),
      };
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    let totalHours = 0;
    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
        const dayIdx = itemDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        const h = (item.duracao_real || 0) / 3600;
        days[dayIdx].hours += h;
        totalHours += h;
      }
    });

    const maxHours = Math.max(...days.map(d => d.hours), 0);

    // Best day of this week
    let bestDayObj: any = null;
    let maxDayHours = 0;
    days.forEach(d => {
      if (d.hours > maxDayHours) {
        maxDayHours = d.hours;
        bestDayObj = d;
      }
    });
    const bestDayName = bestDayObj ? (bestDayObj as any).name : t('-');

    // Average score of notes for entire history
    const sumScores = history.reduce((acc, item) => acc + (item.nota || 0), 0);
    const average = history.length > 0 ? (sumScores / history.length).toFixed(1) : '0.0';

    return {
      days,
      totalHours,
      maxHours,
      average,
      bestDayName,
    };
  }, [history, t]);

  // Heatmap Data (Last 30 Days)
  const heatmapData = useMemo(() => {
    const days: { date: Date; hours: number }[] = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Calculate focus hours for each of the last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        hours: 0,
      });
    }
    
    history.forEach(item => {
      const itemDate = new Date(item.timestamp);
      const itemDayStart = new Date(itemDate);
      itemDayStart.setHours(0, 0, 0, 0);
      
      const idx = days.findIndex(d => d.date.getTime() === itemDayStart.getTime());
      if (idx !== -1) {
        days[idx].hours += (item.duracao_real || 0) / 3600;
      }
    });
    
    return days;
  }, [history]);

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex flex-col md:flex-row relative">
      <DesktopSidebar currentView="history" onNavigate={onNavigate} userName={userName} userEmail={userEmail} />
      
      <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto select-none">
        <div className="w-full max-w-[390px] md:max-w-[800px] md:p-10 px-6 pt-12 flex flex-col items-center">

        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#21222D] dark:text-[#F8F9FA]">{t('Suas atividades')}</h1>
          <button
            onClick={() => onNavigate('progress')}
            className="h-10 px-4 bg-white dark:bg-[#151622] rounded-[16px] flex items-center gap-2 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:border-[#34117E]/40 active:scale-95 transition-all cursor-pointer shadow-sm-layered"
          >
            <BarChart2 size={18} className="text-[#34117E] dark:text-[#C4B5FD]" />
            <span className="text-xs font-bold text-[#21222D] dark:text-[#F8F9FA]">{t('Progresso')}</span>
          </button>
        </div>

        {/* Card gráfico semanal */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 mb-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
          <div className="flex justify-between items-center mb-6">
            <span className="text-neutral-500 dark:text-neutral-400 text-sm font-bold">{t('Esta semana')}</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">
                {weeklyData.totalHours.toFixed(1)}h
              </span>
              <CopyCardButton id="week" />
            </div>
          </div>

          {/* Barras verticais */}
          <div className="flex justify-between items-end h-[110px] mb-6 px-1 gap-2">
            {weeklyData.days.map((d, i) => {
              const heightPercent = weeklyData.maxHours > 0 && d.hours > 0 
                ? Math.max((d.hours / weeklyData.maxHours) * 100, 15) 
                : 0;

              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-bold block h-4">
                    {d.hours > 0 ? `${d.hours.toFixed(1)}h` : '\u00A0'}
                  </span>
                  
                  <div className="w-full max-w-[20px] h-[72px] bg-[#DBDBE5]/25 dark:bg-[#2A2B3D]/25 rounded-t-[6px] relative flex items-end">
                    {d.hours > 0 && (
                      <div 
                        className="w-full bg-[#34117E] rounded-t-[6px] transition-all duration-500 shadow-[0_0_12px_rgba(52,17,126,0.25)]" 
                        style={{ height: `${heightPercent}%` }} 
                      />
                    )}
                  </div>

                  <span className="text-[11px] text-neutral-400 font-bold mt-1">{d.label}</span>
                </div>
              );
            })}
          </div>

          {/* Linha divisória */}
          <div className="w-full border-t border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 my-5" />

          {/* 3 stats em colunas */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">{t('média')}</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA]">{weeklyData.average}</span>
            </div>
            
            <div className="border-l border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 flex flex-col items-center">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">{t('melhor dia')}</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA] truncate max-w-full px-1">{weeklyData.bestDayName}</span>
            </div>

            <div className="border-l border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 flex flex-col items-center">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">{t('sequência')}</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA] flex items-center gap-1 justify-center">
                {t('{n} dias', { n: streak })} {streak > 0 && <span className="text-sm">🔥</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap 30 dias */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 mb-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-500 dark:text-neutral-400 text-sm font-bold">{t('Últimos 30 dias')}</span>
            <CopyCardButton id="month" />
          </div>
          
          {/* Grid of 30 squares (10 cols x 3 rows) */}
          <div className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-2 mb-4">
            {heatmapData.map((day, i) => {
              let bg = '#DBDBE5';
              if (day.hours > 0 && day.hours <= 1) bg = '#7c6bc1';
              else if (day.hours > 1 && day.hours <= 2) bg = '#5a459e';
              else if (day.hours > 2 && day.hours <= 3) bg = '#34117E';
              else if (day.hours > 3) bg = '#210656';
              
              return (
                <div 
                  key={i} 
                  className="aspect-square rounded-[4px] transition-all duration-300 shadow-sm"
                  style={{ backgroundColor: bg }}
                  title={`${day.date.toLocaleDateString('pt-BR')}: ${day.hours.toFixed(1)}h`}
                />
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-medium font-mono">
            <span>{t('menos')}</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#DBDBE5] dark:bg-[#2A2B3D]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#7c6bc1]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#5a459e]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#34117E]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#210656]" />
            </div>
            <span>{t('mais')}</span>
          </div>
        </div>

        {/* Lista Recentes */}
        <div className="w-full text-left">
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3.5 block pl-1">
            {t('Recentes')}
          </span>

          <div className="space-y-4">
            {history.length === 0 ? (
              /* Estado vazio se sem histórico */
              <div className="w-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 rounded-[28px] py-14 px-6 flex flex-col items-center justify-center text-center shadow-sm-layered">
                <ClipboardList className="text-neutral-300 mb-3.5 animate-pulse" size={40} strokeWidth={1.5} />
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-[200px]">
                  {t('Nenhuma atividade recente registrada.')}
                </p>
              </div>
            ) : (
              /* Cards de atividades */
              history.map((item, i) => {
                const date = new Date(item.timestamp);
                const day = date.getDate();
                const months = [t('jan'), t('fev'), t('mar'), t('abr'), t('mai'), t('jun'), t('jul'), t('ago'), t('set'), t('out'), t('nov'), t('dez')];
                const month = months[date.getMonth()];
                const formattedDate = `${day} ${month}`;

                const durReal = item.duracao_real || 0;
                const h = Math.floor(durReal / 3600);
                const m = Math.floor((durReal % 3600) / 60);
                
                // Avoid using raw < inside JSX block to prevent JSX parser confusion
                const formattedMinutes = m >= 10 ? String(m) : '0' + m;
                const durationStr = h > 0 ? `${h}h ${formattedMinutes}min` : `${m}min`;

                const nota = item.nota || 0;

                return (
                  <div 
                    key={item.id || i}
                    onClick={() => onViewHistoricActivity?.(item)}
                    className="w-full bg-white dark:bg-[#151622] rounded-[20px] p-5 flex items-center justify-between border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:border-[#34117E]/30 hover:shadow-md-layered cursor-pointer active:scale-[0.99] relative overflow-hidden transition-all shadow-sm-layered"
                  >
                    {/* Borda esquerda 4px se nota >= 8 */}
                    {nota >= 8 && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#34117E] rounded-l-[20px]" />
                    )}

                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pl-1">
                      {/* Ícone genérico thin line em quadrado */}
                      <div className="w-11 h-11 bg-[#DBDBE5]/15 dark:bg-[#2A2B3D]/15 rounded-[16px] flex items-center justify-center shrink-0 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25">
                        {getCategoryIcon(item.nome || '')}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight truncate">
                          {item.nome || t('Atividade')}
                        </span>
                        <span className="text-xs text-neutral-400 font-semibold mt-0.5 truncate">
                          {formattedDate} • {durationStr}
                          {item.projeto_nome ? ` • ${item.projeto_nome}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Nota e mensagem da IA */}
                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight leading-none mb-1">
                          {nota.toFixed(1)}
                        </span>
                        <span className="text-neutral-400 text-[10px] italic font-bold max-w-[120px] truncate">
                          {item.mensagem_card || t('concluído')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditor(item);
                        }}
                        aria-label={t('Editar atividade')}
                        className="w-9 h-9 rounded-[12px] flex items-center justify-center border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/60 text-neutral-400 hover:text-[#34117E] dark:hover:text-[#C4B5FD] hover:border-[#34117E]/40 transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal size={16} />
                      </button>
                    </div>

                  </div>

                );
              })
            )}
          </div>
        </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-6 md:pb-0">
          <div className="w-full max-w-[390px] bg-white dark:bg-[#151622] rounded-[28px] p-6 border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/60 shadow-xl">
            <h2 className="text-lg font-extrabold mb-5">{t('Editar atividade')}</h2>

            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {t('Nome')}
            </label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full mt-2 mb-5 h-12 px-4 rounded-[16px] bg-[#F5F5F7] dark:bg-[#0D0F14] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/60 text-sm font-semibold outline-none focus:border-[#34117E]"
            />

            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {t('Projeto')}
            </label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              <button
                onClick={() => setEditProjectId(null)}
                className={`px-3.5 h-9 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  editProjectId === null
                    ? 'bg-[#34117E] text-white border-transparent'
                    : 'border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {t('Sem projeto')}
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setEditProjectId(p.id)}
                  className={`px-3.5 h-9 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    editProjectId === p.id
                      ? 'bg-[#34117E] text-white border-transparent'
                      : 'border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder={t('Novo projeto')}
              className="w-full mb-6 h-11 px-4 rounded-[16px] bg-[#F5F5F7] dark:bg-[#0D0F14] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/60 text-sm font-semibold outline-none focus:border-[#34117E]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 h-12 rounded-[16px] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/60 text-sm font-bold cursor-pointer"
              >
                {t('Cancelar')}
              </button>
              <button
                onClick={saveEditor}
                className="flex-1 h-12 rounded-[16px] bg-[#34117E] text-white text-sm font-bold shadow-[0_8px_20px_rgba(52,17,126,0.3)] cursor-pointer"
              >
                {t('Salvar')}
              </button>
            </div>

            <button
              onClick={removeActivity}
              className="w-full mt-3 h-11 rounded-[16px] text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              {t('Excluir atividade')}
            </button>
          </div>
        </div>
      )}

      {/* Cards renderizados fora da tela apenas para exportar imagem */}
      <div aria-hidden className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <WeeklyWorkCard ref={weekCardRef} theme={theme} summary={weekSummary} />
        <MonthlyWorkCard ref={monthCardRef} theme={theme} summary={monthSummary} />
      </div>
    </div>

  );
}