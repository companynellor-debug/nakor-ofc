import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Play, Pause, Lock } from 'lucide-react';

export function HeroVisual() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(1500); // 25:00

  // Standard task state so they are interactive!
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Estudar capítulo 5', completed: true },
    { id: 2, text: 'Revisar anotações', completed: true },
    { id: 3, text: 'Leitura', completed: false },
    { id: 4, text: 'Exercícios', completed: false },
  ]);

  // Toggle tasks
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG circular properties
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (seconds / 1500) * circumference;

  return (
    <div className="relative w-full max-w-2xl h-[560px] flex items-center justify-center select-none overflow-visible">
      
      {/* BACKGROUND CONCENTRIC RADAR RINGS (From Photo 1) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
        {/* Radar Ring 1 */}
        <div className="absolute w-[280px] h-[280px] rounded-full border border-white/[0.03] flex items-center justify-center">
          {/* Radar Ring 2 */}
          <div className="absolute w-[380px] h-[380px] rounded-full border border-[#34117E]/[0.12] border-dashed flex items-center justify-center">
            {/* Radar Ring 3 */}
            <div className="absolute w-[480px] h-[480px] rounded-full border border-white/[0.02] flex items-center justify-center">
              {/* Radar Ring 4 */}
              <div className="absolute w-[580px] h-[580px] rounded-full border border-[#34117E]/[0.06] border-dashed" />
            </div>
          </div>
        </div>
        
        {/* Ambient purple spotlight behind the main card */}
        <div className="absolute w-[320px] h-[320px] rounded-full bg-[#34117E]/12 blur-[90px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#10367D]/15 blur-[120px] translate-x-12 translate-y-6" />
        
        {/* Radar axis lines */}
        <div className="absolute w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-12" />
        <div className="absolute w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#34117E]/[0.08] to-transparent -rotate-45" />
      </div>

      {/* 1. LEFT-TOP CARD: FOCO DE HOJE (Foto 3 Layout) */}
      <div className="absolute left-[-20px] top-[10px] md:left-[10px] md:top-[30px] w-[180px] bg-[#0A0A0A]/90 border border-white/10 p-4 rounded-[20px] shadow-2xl shadow-black/60 backdrop-blur-md transform -rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 group animate-float-1">
        <span className="text-[8px] font-mono tracking-wider text-neutral-400 block uppercase mb-1">
          FOCO DE HOJE
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-display font-bold text-white tracking-tight">3h 45m</span>
        </div>
        <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block mb-3">Tempo focado</span>
        
        {/* Spark Bar Chart */}
        <div className="flex items-end justify-between gap-1.5 h-12 pt-1">
          <div className="w-2 bg-[#34117E]/20 rounded-full h-[40%] group-hover:bg-[#34117E]/30 transition-colors" />
          <div className="w-2 bg-[#34117E]/30 rounded-full h-[65%]" />
          <div className="w-2 bg-[#34117E]/20 rounded-full h-[30%]" />
          <div className="w-2 bg-[#34117E]/50 rounded-full h-[80%]" />
          <div className="w-2 bg-[#34117E] rounded-full h-[100%] shadow-[0_0_8px_rgba(52,17,126,0.5)]" />
          <div className="w-2 bg-[#34117E]/40 rounded-full h-[55%]" />
          <div className="w-2 bg-[#34117E]/30 rounded-full h-[45%]" />
        </div>
      </div>

      {/* 2. LEFT-BOTTOM CARD: META DIÁRIA (Foto 3 Layout) */}
      <div className="absolute left-[-10px] bottom-[30px] md:left-[25px] md:bottom-[60px] w-[170px] bg-[#0A0A0A]/90 border border-white/10 p-4 rounded-[20px] shadow-2xl shadow-black/60 backdrop-blur-md transform -rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 animate-float-3">
        <span className="text-[8px] font-mono tracking-wider text-neutral-400 block uppercase mb-1">
          META DIÁRIA
        </span>
        <span className="text-2xl font-display font-black text-white block mb-2">80%</span>
        
        {/* Micro slider progress */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5 border border-white/5">
          <div className="bg-gradient-to-r from-[#34117E] to-[#958CE8] h-full rounded-full" style={{ width: '80%' }} />
        </div>
        
        <span className="text-[9px] font-mono text-neutral-400 block">
          4h de 5h
        </span>
      </div>

      {/* 3. CENTER: CORE MAIN TIMER CARD (From Photos) */}
      <div className="relative w-[240px] md:w-[260px] bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A] border border-[#34117E]/30 rounded-[28px] p-5 shadow-[0_0_50px_rgba(52,17,126,0.15)] shadow-black/90 z-20 flex flex-col justify-between transition-transform duration-500 hover:scale-[1.03]">
        {/* Card Header with Dropdown */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Foco</span>
            <ChevronDown size={10} className="text-white/60 ml-0.5" />
          </div>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative flex flex-col items-center justify-center py-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Outer track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-white/5 fill-transparent"
                strokeWidth="4"
              />
              {/* Purple Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#34117E] fill-transparent transition-all duration-300"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0px 0px 8px rgba(52, 17, 126, 0.7))'
                }}
              />
              {/* Slider thumb dot that follows progress */}
              <circle
                cx="92"
                cy="50"
                r="2.5"
                className="fill-white stroke-[#34117E] stroke-[1.5] transition-all duration-300"
                style={{
                  transformOrigin: '50px 50px',
                  transform: `rotate(${(seconds / 1500) * 360}deg)`
                }}
              />
            </svg>
            
            {/* Timer numbers */}
            <div className="flex flex-col items-center z-10">
              <span className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight tabular-nums">
                {formatTime(seconds)}
              </span>
              
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsActive(!isActive)}
                className="mt-3 w-10 h-10 rounded-full bg-[#34117E] text-white flex items-center justify-center shadow-lg shadow-[#34117E]/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                aria-label={isActive ? "Pausar" : "Iniciar"}
              >
                {isActive ? (
                  <Pause size={14} className="fill-current" />
                ) : (
                  <Play size={14} className="fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom tracker bar */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
            <span>1 ciclo</span>
            <span>4 ciclos</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="bg-[#34117E] h-full rounded-full transition-all duration-500" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      {/* 4. RIGHT-TOP CARD: TAREFAS (Foto 3 Layout) */}
      <div className="absolute right-[-15px] top-[20px] md:right-[15px] md:top-[40px] w-[185px] bg-[#0A0A0A]/90 border border-white/10 p-4 rounded-[20px] shadow-2xl shadow-black/60 backdrop-blur-md transform rotate-6 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 animate-float-2">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[8px] font-mono tracking-wider text-neutral-400 block uppercase">
            TAREFAS
          </span>
          <span className="text-[10px] font-mono font-bold text-[#958CE8] bg-[#34117E]/20 px-1.5 py-0.5 rounded border border-[#34117E]/25">
            {completedCount}/4
          </span>
        </div>
        
        {/* Interactive task list */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-2 cursor-pointer group/task"
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-gradient-to-br from-[#34117E] to-[#958CE8] text-white shadow-[0_0_6px_rgba(52,17,126,0.4)]'
                  : 'border border-white/20 bg-white/5 group-hover/task:border-[#34117E]/50'
              }`}>
                {task.completed && <Check size={8} strokeWidth={4} />}
              </div>
              <span className={`text-[10px] font-medium tracking-tight truncate transition-colors ${
                task.completed ? 'text-neutral-300 line-through decoration-white/20' : 'text-neutral-400 group-hover/task:text-white'
              }`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RIGHT-BOTTOM CARD: PROGRESSO (Foto 3 Layout) */}
      <div className="absolute right-[-10px] bottom-[20px] md:right-[20px] md:bottom-[50px] w-[170px] bg-[#0A0A0A]/90 border border-white/10 p-4 rounded-[20px] shadow-2xl shadow-black/60 backdrop-blur-md transform rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30 animate-float-1">
        <div className="flex justify-between items-start mb-1">
          <div>
            <span className="text-[8px] font-mono tracking-wider text-neutral-400 block uppercase">
              PROGRESSO
            </span>
            <span className="text-2xl font-display font-black text-white block mt-0.5">87%</span>
          </div>
          
          {/* Glowing Pill badge */}
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold shadow-[0_0_8px_rgba(16,185,129,0.15)]">
            <span>↑ 12%</span>
          </div>
        </div>
        
        {/* SVG Sparkline Sparkline (Custom Wavy path from photos) */}
        <div className="w-full h-10 pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
            <defs>
              <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34117E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#34117E" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Gradient fill */}
            <path
              d="M 0,25 C 20,20 25,28 40,15 C 55,2 70,25 85,10 C 92,3 95,8 100,5 L 100,30 L 0,30 Z"
              fill="url(#sparklineGradient)"
            />
            {/* Glowing line */}
            <path
              d="M 0,25 C 20,20 25,28 40,15 C 55,2 70,25 85,10 C 92,3 95,8 100,5"
              fill="none"
              stroke="#34117E"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0px 0px 4px rgba(52,17,126,0.5))'
              }}
            />
          </svg>
        </div>
      </div>

    </div>
  );
}
