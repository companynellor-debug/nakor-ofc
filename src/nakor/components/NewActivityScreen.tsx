import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Pencil, CheckSquare, Plus, Circle, ChevronUp, ChevronDown, FolderOpen, X } from 'lucide-react';
import { useT } from '../lib/i18n';
import { useProjects } from '../hooks/useProjects';

interface TimePickerProps {
  value: number; // total minutes
  onChange: (value: number) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const t = useT();
  const hContainerRef = useRef<HTMLDivElement>(null);
  const mContainerRef = useRef<HTMLDivElement>(null);
  
  const currentHours = Math.floor(value / 60);
  const currentMinutes = value % 60;
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);

  // Sync scroll position when value changes from outside (or on mount)
  useEffect(() => {
    if (isScrollingRef.current) return;
    
    if (hContainerRef.current) {
      hContainerRef.current.scrollTop = currentHours * 48;
    }
    if (mContainerRef.current) {
      mContainerRef.current.scrollTop = currentMinutes * 48;
    }
  }, [currentHours, currentMinutes]);

  const handleScroll = (type: 'hours' | 'minutes', e: React.UIEvent<HTMLDivElement>) => {
    isScrollingRef.current = true;
    const target = e.currentTarget;
    
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    scrollTimeoutRef.current = setTimeout(() => {
      const itemHeight = 48;
      const index = Math.round(target.scrollTop / itemHeight);
      
      // Snap to exact item position
      target.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
      
      if (type === 'hours') {
        const h = Math.min(23, Math.max(0, index));
        let total = h * 60 + currentMinutes;
        if (total === 0) total = 5; // minimum 5 mins
        onChange(total);
      } else {
        const m = Math.min(59, Math.max(0, index));
        let total = currentHours * 60 + m;
        if (total === 0) total = 5; // minimum 5 mins
        onChange(total);
      }
      
      // Release scrolling flag after a small delay to allow state sync
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 50);
    }, 150); // wait 150ms after scroll stop to snap and update
  };

  const handleItemClick = (type: 'hours' | 'minutes', index: number) => {
    if (type === 'hours') {
      let total = index * 60 + currentMinutes;
      if (total === 0) total = 5;
      onChange(total);
      if (hContainerRef.current) {
        hContainerRef.current.scrollTo({ top: index * 48, behavior: 'smooth' });
      }
    } else {
      let total = currentHours * 60 + index;
      if (total === 0) total = 5;
      onChange(total);
      if (mContainerRef.current) {
        mContainerRef.current.scrollTo({ top: index * 48, behavior: 'smooth' });
      }
    }
  };

  const incrementHours = () => {
    const nextH = (currentHours + 1) % 24;
    let total = nextH * 60 + currentMinutes;
    if (total === 0) total = 5;
    onChange(total);
  };

  const decrementHours = () => {
    const nextH = (currentHours - 1 + 24) % 24;
    let total = nextH * 60 + currentMinutes;
    if (total === 0) total = 5;
    onChange(total);
  };

  const incrementMinutes = () => {
    const nextM = (currentMinutes + 1) % 60;
    let total = currentHours * 60 + nextM;
    if (total === 0) total = 5;
    onChange(total);
  };

  const decrementMinutes = () => {
    const nextM = (currentMinutes - 1 + 60) % 60;
    let total = currentHours * 60 + nextM;
    if (total === 0) total = 5;
    onChange(total);
  };

  // Human-readable portuguese description of duration
  const getDurationText = () => {
    if (currentHours === 0 && currentMinutes === 0) return t('Duração mínima de 5 minutos');
    const hText = currentHours > 0 ? `${currentHours} ${currentHours === 1 ? t('hora') : t('horas')}` : '';
    const mText = currentMinutes > 0 ? `${currentMinutes} ${currentMinutes === 1 ? t('minuto') : t('minutos')}` : '';
    
    if (hText && mText) return t('A atividade durará por {h} e {m}', { h: hText, m: mText });
    if (hText) return t('A atividade durará por {h}', { h: hText });
    return t('A atividade durará por {m}', { m: mText });
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-4 animate-in fade-in zoom-in duration-300 w-full">
      {/* Subtitle / Descriptive text */}
      <span className="text-neutral-500 dark:text-neutral-400 text-xs font-bold mb-6 uppercase tracking-wider text-center bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 px-4 py-2 rounded-full shadow-sm">
        {getDurationText()}
      </span>

      <div className="flex items-center gap-8 relative justify-center">
        
        {/* HOURS COLUMN */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[2px] mb-2">H</span>
          
          {/* Up arrow */}
          <button 
            onClick={decrementHours}
            type="button"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-neutral-50 mb-1 cursor-pointer transition-all active:scale-90 shadow-sm"
          >
            <ChevronUp size={16} />
          </button>

          {/* Roller Wheel Container */}
          <div className="relative w-20 h-[144px] bg-white dark:bg-[#151622] rounded-2xl border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 overflow-hidden shadow-inner">
            {/* 3D cylindrical fade effect */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
            
            {/* Selected item highlight frame */}
            <div className="absolute top-[48px] left-2 right-2 h-12 border-y border-[#34117E]/30 bg-[#34117E]/[0.02] rounded-lg pointer-events-none" />

            {/* Scrollable list */}
            <div 
              ref={hContainerRef}
              onScroll={(e) => handleScroll('hours', e)}
              className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none py-12"
              style={{ scrollBehavior: 'smooth' }}
            >
              {hours.map((h, i) => {
                const isSelected = i === currentHours;
                return (
                  <div 
                    key={h}
                    onClick={() => handleItemClick('hours', i)}
                    className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none ${
                      isSelected 
                        ? 'text-[#34117E] dark:text-[#C4B5FD] font-black text-2xl scale-110 drop-shadow-[0_0_10px_rgba(52,17,126,0.3)]' 
                        : 'text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] font-bold text-base'
                    }`}
                  >
                    {String(h).padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Down arrow */}
          <button 
            onClick={incrementHours}
            type="button"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-neutral-50 mt-1 cursor-pointer transition-all active:scale-90 shadow-sm"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* COLON SEPARATOR */}
        <div className="text-3xl font-bold text-neutral-300 mt-6 select-none">:</div>

        {/* MINUTES COLUMN */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[2px] mb-2">M</span>
          
          {/* Up arrow */}
          <button 
            onClick={decrementMinutes}
            type="button"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-neutral-50 mb-1 cursor-pointer transition-all active:scale-90 shadow-sm"
          >
            <ChevronUp size={16} />
          </button>

          {/* Roller Wheel Container */}
          <div className="relative w-20 h-[144px] bg-white dark:bg-[#151622] rounded-2xl border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 overflow-hidden shadow-inner">
            {/* 3D cylindrical fade effect */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
            
            {/* Selected item highlight frame */}
            <div className="absolute top-[48px] left-2 right-2 h-12 border-y border-[#34117E]/30 bg-[#34117E]/[0.02] rounded-lg pointer-events-none" />

            {/* Scrollable list */}
            <div 
              ref={mContainerRef}
              onScroll={(e) => handleScroll('minutes', e)}
              className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none py-12"
              style={{ scrollBehavior: 'smooth' }}
            >
              {minutes.map((m, i) => {
                const isSelected = i === currentMinutes;
                return (
                  <div 
                    key={m}
                    onClick={() => handleItemClick('minutes', i)}
                    className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none ${
                      isSelected 
                        ? 'text-[#34117E] dark:text-[#C4B5FD] font-black text-2xl scale-110 drop-shadow-[0_0_10px_rgba(52,17,126,0.3)]' 
                        : 'text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] font-bold text-base'
                    }`}
                  >
                    {String(m).padStart(2, '0')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Down arrow */}
          <button 
            onClick={incrementMinutes}
            type="button"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#151622] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-neutral-50 mt-1 cursor-pointer transition-all active:scale-90 shadow-sm"
          >
            <ChevronDown size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

interface NewActivityScreenProps {
  onNavigate: (view: string) => void;
}

export function NewActivityScreen({ onNavigate }: NewActivityScreenProps) {
  const t = useT();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(25);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [beforeText, setBeforeText] = useState('');

  const { projects, createProject } = useProjects();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const selectedProject = projects.find((p) => p.id === projectId) || null;

  const handleCreateProject = async () => {
    const created = await createProject(newProjectName);
    if (created) setProjectId(created.id);
    setNewProjectName('');
    setIsCreatingProject(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() && subtasks.length < 5) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
      setIsAddingSubtask(false);
    } else if (!newSubtask.trim()) {
      setIsAddingSubtask(false);
    }
  };

  const handleStart = () => {
    if (!name.trim()) return;

    const activityData = {
      nome: name,
      duracao: duration,
      subtarefas: subtasks,
      texto_antes: beforeText,
      projeto_id: selectedProject?.id ?? null,
      projeto_nome: selectedProject?.name ?? null,
      timestamp_inicio: Date.now()
    };
    
    localStorage.setItem('nakor_atividade_atual', JSON.stringify(activityData));
    onNavigate('foco');
  };

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
          <h1 className="text-[18px] font-bold text-[#21222D] dark:text-[#F8F9FA]">{t('Nova Atividade')}</h1>
          <div className="w-6" /> {/* Spacer to center the title exactly */}
        </div>

        {/* Name Input */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 p-4 flex items-center gap-3 mb-8 shadow-sm">
          <Pencil size={20} className="text-neutral-400 stroke-2" />
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('Nome da atividade')}
            className="bg-transparent border-none outline-none text-[#21222D] dark:text-[#F8F9FA] w-full placeholder:text-neutral-400 font-bold"
          />
        </div>

        {/* Project (opcional) */}
        <div className="w-full mb-8">
          <label className="text-[#21222D]/70 dark:text-[#F8F9FA]/70 text-sm font-bold mb-3 block pl-1">
            {t('PROJETO')} <span className="font-semibold opacity-60">({t('opcional')})</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProjectId(null)}
              className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                projectId === null
                  ? 'bg-[#34117E] text-white shadow-md'
                  : 'bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 text-[#21222D]/80 dark:text-[#F8F9FA]/80 shadow-sm'
              }`}
            >
              {t('Sem projeto')}
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setProjectId(p.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 max-w-full ${
                  projectId === p.id
                    ? 'bg-[#34117E] text-white shadow-md'
                    : 'bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 text-[#21222D]/80 dark:text-[#F8F9FA]/80 shadow-sm'
                }`}
              >
                <FolderOpen size={14} />
                <span className="truncate">{p.name}</span>
              </button>
            ))}

            {isCreatingProject ? (
              <div className="w-full bg-white dark:bg-[#151622] rounded-full border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 px-4 py-2 flex items-center gap-2 shadow-sm">
                <input
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  placeholder={t('Nome do projeto')}
                  className="bg-transparent outline-none border-none text-sm font-bold w-full text-[#21222D] dark:text-[#F8F9FA] placeholder:text-neutral-400"
                />
                <button
                  onClick={handleCreateProject}
                  className="text-[#34117E] dark:text-[#C4B5FD] text-xs font-bold cursor-pointer shrink-0"
                >
                  {t('Salvar')}
                </button>
                <button
                  onClick={() => { setIsCreatingProject(false); setNewProjectName(''); }}
                  className="text-neutral-400 cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingProject(true)}
                className="px-4 py-2.5 rounded-full text-sm font-bold bg-[#EEEEF9] dark:bg-[#2B2A48] text-[#34117E] dark:text-[#C4B5FD] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus size={14} /> {t('Novo projeto')}
              </button>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="w-full mb-8">
          <label className="text-[#21222D]/70 dark:text-[#F8F9FA]/70 text-sm font-bold mb-3 block pl-1">{t('DURAÇÃO')}</label>
          <div className="flex flex-wrap gap-2">
            {[25, 45, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => { setDuration(d); setIsCustomTime(false); }}
                className={`flex-1 min-w-[60px] py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  duration === d && !isCustomTime
                    ? 'bg-[#34117E] text-white shadow-md' 
                    : 'bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 text-[#21222D]/80 dark:text-[#F8F9FA]/80 hover:bg-neutral-50 shadow-sm'
                }`}
              >
                {d}min
              </button>
            ))}
            <button
              onClick={() => setIsCustomTime(true)}
              className={`flex-[2] min-w-[120px] py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
                isCustomTime
                  ? 'bg-[#34117E] text-white shadow-md' 
                  : 'bg-white dark:bg-[#151622] border border-[#DBDBE5]/50 dark:border-[#2A2B3D]/50 text-[#21222D]/80 dark:text-[#F8F9FA]/80 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              {t('Personalizado')}
            </button>
          </div>
          
          {isCustomTime && (
            <TimePicker 
              value={duration} 
              onChange={setDuration} 
            />
          )}
        </div>

        {/* Subtasks */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-[#21222D] dark:text-[#F8F9FA]" />
              <h3 className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-base">{t('Subtarefas')}</h3>
            </div>
            <button 
              onClick={() => setIsAddingSubtask(true)}
              className="text-[#34117E] dark:text-[#C4B5FD] text-sm font-bold flex items-center gap-1 hover:brightness-110 disabled:opacity-50 cursor-pointer"
              disabled={subtasks.length >= 5}
            >
              <Plus size={16} /> {t('Adicionar')}
            </button>
          </div>

          <div className="space-y-0">
            {subtasks.map((task, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 py-3 first:pt-0">
                <Circle size={20} className="text-[#21222D]/40 dark:text-[#F8F9FA]/40 shrink-0" />
                <span className="text-[#21222D] dark:text-[#F8F9FA] text-sm font-medium">{task}</span>
              </div>
            ))}

            {isAddingSubtask && subtasks.length < 5 && (
              <div className="flex items-center gap-3 py-3 border-b border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 last:border-0">
                <Circle size={20} className="text-[#21222D]/40 dark:text-[#F8F9FA]/40 shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSubtask();
                  }}
                  onBlur={handleAddSubtask}
                  placeholder={t('Nova subtarefa...')}
                  className="bg-transparent border-none outline-none text-[#21222D] dark:text-[#F8F9FA] w-full text-sm placeholder:text-neutral-400 font-bold"
                />
              </div>
            )}

            {!isAddingSubtask && subtasks.length < 5 && (
              <button 
                onClick={() => setIsAddingSubtask(true)}
                className={`w-full py-3 rounded-2xl border border-dashed border-[#DBDBE5] dark:border-[#2A2B3D] text-neutral-500 dark:text-neutral-400 text-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors cursor-pointer ${subtasks.length > 0 ? 'mt-4' : ''}`}
              >
                <Plus size={16} /> {t('nova subtarefa')}
              </button>
            )}
          </div>
        </div>

        {/* Notes (Antes) */}
        <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 p-5 shadow-sm">
          <label className="text-[#21222D]/70 dark:text-[#F8F9FA]/70 text-sm font-bold mb-3 block">{t('ANTES')}</label>
          <div className="relative">
            <textarea
              value={beforeText}
              onChange={(e) => setBeforeText(e.target.value.slice(0, 300))}
              placeholder={t('O que você espera dessa atividade?\nQual é sua meta agora?')}
              className="w-full bg-transparent border-none outline-none text-[#21222D] dark:text-[#F8F9FA] text-sm placeholder:text-neutral-400 resize-none h-32 leading-6 font-medium"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(33,34,45,0.03) 24px)',
                backgroundAttachment: 'local'
              }}
            />
            
            <div className="text-right text-neutral-400 text-xs mt-2 font-mono">
              {beforeText.length}/300
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent pb-safe pt-6 px-6 z-50 flex justify-center">
        <button 
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full max-w-[342px] h-[56px] mb-8 bg-[#34117E] hover:bg-[#250b61] active:scale-95 disabled:opacity-50 disabled:hover:bg-[#34117E] disabled:active:scale-100 text-white font-bold text-base rounded-full flex justify-center items-center transition-all shadow-[0_4px_25px_rgba(52,17,126,0.25)] cursor-pointer"
        >
          {t('Iniciar')}
        </button>
      </div>
    </div>
  );
}
