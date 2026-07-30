import { DesktopSidebar } from './DesktopSidebar';

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
  const userName = onboardingData?.name || localStorage.getItem('nakor_user') || 'Alex';
  const userEmail = onboardingData?.email || localStorage.getItem('nakor_user_email') || 'alex@email.com';

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('nakor_historico');
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

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
      { label: 'S', name: 'Domingo', hours: 0 },
      { label: 'M', name: 'Segunda', hours: 0 },
      { label: 'T', name: 'Terça', hours: 0 },
      { label: 'Q', name: 'Quarta', hours: 0 },
      { label: 'Q', name: 'Quinta', hours: 0 },
      { label: 'S', name: 'Sexta', hours: 0 },
      { label: 'S', name: 'Sábado', hours: 0 },
    ];

    if (history.length === 0) {
      return {
        days,
        totalHours: 0,
        maxHours: 0,
        average: '0.0',
        bestDayName: '-',
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
    const bestDayName = bestDayObj ? (bestDayObj as any).name : '-';

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
  }, [history]);

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
          <h1 className="text-3xl font-extrabold tracking-tight text-[#21222D] dark:text-[#F8F9FA]">Suas atividades</h1>
          <button className="w-10 h-10 bg-white dark:bg-[#151622] rounded-[16px] flex items-center justify-center border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer shadow-sm-layered">
            <SlidersHorizontal size={18} className="text-[#21222D] dark:text-[#F8F9FA]" />
          </button>
        </div>

        {/* Card gráfico semanal */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 mb-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
          <div className="flex justify-between items-center mb-6">
            <span className="text-neutral-500 dark:text-neutral-400 text-sm font-bold">Esta semana</span>
            <span className="text-2xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">
              {weeklyData.totalHours.toFixed(1)}h
            </span>
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
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">média</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA]">{weeklyData.average}</span>
            </div>
            
            <div className="border-l border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 flex flex-col items-center">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">melhor dia</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA] truncate max-w-full px-1">{weeklyData.bestDayName}</span>
            </div>

            <div className="border-l border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 flex flex-col items-center">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider mb-0.5">sequência</span>
              <span className="text-base font-bold text-[#21222D] dark:text-[#F8F9FA] flex items-center gap-1 justify-center">
                {streak} dias {streak > 0 && <span className="text-sm">🔥</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap 30 dias */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[28px] p-7 mb-8 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered text-left">
          <span className="text-neutral-500 dark:text-neutral-400 text-sm font-bold block mb-4">Últimos 30 dias</span>
          
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
            <span>menos</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#DBDBE5] dark:bg-[#2A2B3D]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#7c6bc1]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#5a459e]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#34117E]" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#210656]" />
            </div>
            <span>mais</span>
          </div>
        </div>

        {/* Lista Recentes */}
        <div className="w-full text-left">
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3.5 block pl-1">
            Recentes
          </span>

          <div className="space-y-4">
            {history.length === 0 ? (
              /* Estado vazio se sem histórico */
              <div className="w-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 rounded-[28px] py-14 px-6 flex flex-col items-center justify-center text-center shadow-sm-layered">
                <ClipboardList className="text-neutral-300 mb-3.5 animate-pulse" size={40} strokeWidth={1.5} />
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-[200px]">
                  Nenhuma atividade recente registrada.
                </p>
              </div>
            ) : (
              /* Cards de atividades */
              history.map((item, i) => {
                const date = new Date(item.timestamp);
                const day = date.getDate();
                const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
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
                          {item.nome || 'Atividade'}
                        </span>
                        <span className="text-xs text-neutral-400 font-semibold mt-0.5">
                          {formattedDate} • {durationStr}
                        </span>
                      </div>
                    </div>

                    {/* Nota e mensagem da IA */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-xl font-extrabold text-[#21222D] dark:text-[#F8F9FA] tracking-tight leading-none mb-1">
                        {nota.toFixed(1)}
                      </span>
                      <span className="text-neutral-400 text-[10px] italic font-bold max-w-[120px] truncate">
                        {item.mensagem_card || 'concluído'}
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}