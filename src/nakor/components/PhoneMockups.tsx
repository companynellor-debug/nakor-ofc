import { useT } from '../lib/i18n';
import { Lock, Check, ChevronRight, ArrowLeft, Pencil, Circle, X, Eye, Home, BarChart3, CheckSquare, User } from 'lucide-react';

export function PhoneMockups() {
  const t = useT();
  return (
    <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 py-12">
      
      {/* PHONE 1: Antes - "Nova Atividade" */}
      <div className="w-[260px] h-[520px] rounded-[40px] bg-neutral-900 p-3 shadow-2xl border-4 border-neutral-800 relative animate-float-1 hover:scale-105 transition-all duration-500 z-10 shrink-0">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800" />
          <div className="w-10 h-1 bg-neutral-850 rounded-full ml-3" />
        </div>
        
        {/* Internal Screen Content */}
        <div className="w-full h-full rounded-[28px] bg-[#000000] overflow-hidden p-4 flex flex-col text-left relative select-none">
          {/* Header */}
          <div className="pt-6 flex items-center justify-between">
            <button className="p-1 rounded-full bg-[#16181E] text-white">
              <ArrowLeft size={14} />
            </button>
            <h4 className="text-xs font-bold text-white font-sans">{t('Nova Atividade')}</h4>
            <div className="w-6" /> {/* Spacer */}
          </div>

          {/* Activity Name Input */}
          <div className="bg-[#16181E] border border-neutral-800/80 rounded-xl px-3 py-2.5 flex items-center gap-2 mt-4">
            <Pencil size={13} className="text-neutral-500 dark:text-neutral-400 shrink-0" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{t('Nome da atividade')}</span>
          </div>

          {/* Duration Section */}
          <div className="mt-4">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Duração
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <div className="bg-[#16181E] border border-neutral-800 text-neutral-400 text-[10px] font-bold py-2 rounded-lg text-center">
                25min
              </div>
              <div className="bg-[#34117E] text-white text-[10px] font-bold py-2 rounded-lg text-center shadow-[0_0_10px_rgba(52,17,126,0.2)]">
                45min
              </div>
              <div className="bg-[#16181E] border border-neutral-800 text-neutral-400 text-[10px] font-bold py-2 rounded-lg text-center">
                60min
              </div>
              <div className="bg-[#16181E] border border-neutral-800 text-neutral-400 text-[10px] font-bold py-2 rounded-lg text-center">
                90min
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="bg-[#16181E] rounded-2xl p-3 border border-neutral-800/40 mt-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <CheckSquare size={11} className="text-[#958CE8]" />
                Subtarefas
              </span>
              <span className="text-[#958CE8] text-[9px] font-extrabold cursor-pointer">
                + Adicionar
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-neutral-600" />
                <span className="text-[10px] text-neutral-300 font-medium">{t('Revisar conteúdo teórico')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-neutral-600" />
                <span className="text-[10px] text-neutral-300 font-medium">{t('Fazer exercícios práticos')}</span>
              </div>
            </div>

            <div className="border border-dashed border-neutral-800 bg-[#000000]/40 rounded-lg py-1.5 text-center text-neutral-500 dark:text-neutral-400 text-[9px] font-semibold flex items-center justify-center gap-1">
              <span>{t('+ nova subtarefa')}</span>
            </div>
          </div>

          {/* Antes section */}
          <div className="bg-[#16181E] rounded-2xl p-3 border border-neutral-800/40 mt-3 flex flex-col justify-between h-[82px] relative">
            <span className="text-[8px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider block">
              Antes
            </span>
            <div className="space-y-1 my-auto">
              <p className="text-[9px] text-neutral-400 font-medium leading-relaxed">
                O que você espera dessa atividade?
              </p>
              <p className="text-[9px] text-neutral-400 font-medium leading-relaxed border-t border-neutral-800/60 pt-1">
                Qual é sua meta agora?
              </p>
            </div>
            <span className="text-neutral-600 text-[8px] font-mono absolute bottom-2 right-3">
              0/300
            </span>
          </div>

          {/* Start Button */}
          <button className="w-full bg-[#34117E] hover:bg-[#260b61] text-white py-2.5 rounded-full text-xs font-bold text-center mt-auto shadow-lg shadow-[#34117E]/15 flex items-center justify-center gap-1.5">
            <span>{t('Iniciar')}</span>
          </button>
        </div>
      </div>

      {/* PHONE 2: Durante - "Trabalho Focado" */}
      <div className="w-[260px] h-[520px] rounded-[40px] bg-neutral-900 p-3 shadow-2xl border-4 border-neutral-800 relative animate-float-2 hover:scale-105 transition-all duration-500 z-20 shrink-0 md:-translate-y-8">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800" />
          <div className="w-10 h-1 bg-neutral-850 rounded-full ml-3" />
        </div>

        {/* Internal Screen Content */}
        <div className="w-full h-full rounded-[28px] bg-[#000000] overflow-hidden p-4 flex flex-col text-left relative select-none">
          {/* Header */}
          <div className="pt-6 flex items-center justify-between">
            <button className="p-1 rounded-full bg-[#16181E] text-neutral-400">
              <X size={13} />
            </button>
            <h4 className="text-xs font-bold text-white font-sans">{t('Trabalho Focado')}</h4>
            <div className="bg-[#16181E] border border-neutral-800 px-2 py-0.5 rounded-full shrink-0">
              <span className="text-[8px] font-bold text-neutral-400 font-mono">{t('2 saídas')}</span>
            </div>
          </div>

          {/* Timer Circle */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer SVG Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" className="stroke-neutral-850 fill-transparent" strokeWidth="4.5" />
                <circle cx="50" cy="50" r="44" className="stroke-[#34117E] fill-transparent" strokeWidth="4.5" strokeDasharray="276" strokeDashoffset="65" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 0px 4px rgba(52,17,126,0.3))' }} />
              </svg>
              {/* Timer metrics */}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display font-black text-white tracking-tight">24:59</span>
                <span className="text-[8px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mt-0.5">{t('Restantes')}</span>
              </div>
            </div>

            {/* Subtasks Progress Card */}
            <div className="bg-[#16181E]/90 border border-neutral-800/80 rounded-2xl p-3 mt-4 w-full flex justify-between items-center text-left">
              <span className="text-[9px] text-neutral-300 font-semibold">{t('1 de 3 subtarefas concluídas')}</span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34117E]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              </div>
            </div>

            {/* Custom feedback quote */}
            <p className="text-[10px] italic text-neutral-500 dark:text-neutral-400 font-medium text-center mt-3.5 max-w-[180px]">
              "você já passou da metade. não para agora."
            </p>

            {/* Monitoring distractions status */}
            <div className="flex justify-center mt-3">
              <div className="inline-flex items-center gap-1.5 bg-[#16181E] border border-neutral-800/60 px-3 py-1 rounded-full">
                <Eye size={10} className="text-neutral-400" />
                <span className="text-[8px] font-bold text-neutral-400 font-sans">{t('monitorando distrações')}</span>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex gap-2 mt-auto pb-1 w-full">
            <button className="flex-1 bg-[#16181E] hover:bg-neutral-800 border border-neutral-800 text-white font-bold py-2 px-3 rounded-xl text-[11px] text-center">
              Pausar
            </button>
            <button className="flex-1 bg-[#16181E] hover:bg-neutral-800 border border-neutral-800 text-neutral-400 font-bold py-2 px-3 rounded-xl text-[11px] text-center">
              Encerrar
            </button>
          </div>
        </div>
      </div>

      {/* PHONE 3: Depois - "Atividade concluída" */}
      <div className="w-[260px] h-[520px] rounded-[40px] bg-neutral-900 p-3 shadow-2xl border-4 border-neutral-800 relative animate-float-3 hover:scale-105 transition-all duration-500 z-10 shrink-0">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800" />
          <div className="w-10 h-1 bg-neutral-850 rounded-full ml-3" />
        </div>

        {/* Internal Screen Content */}
        <div className="w-full h-full rounded-[28px] bg-[#000000] overflow-hidden p-4 flex flex-col text-left relative select-none">
          {/* Header */}
          <div className="pt-6 flex justify-between items-center">
            <div className="w-4" /> {/* Spacer */}
            <h4 className="text-xs font-bold text-white font-sans text-center">{t('Atividade concluída')}</h4>
            <span className="text-xs text-neutral-400 shrink-0">🎉</span>
          </div>

          {/* Metric Bar Card */}
          <div className="grid grid-cols-3 gap-1 bg-[#16181E] border border-neutral-800/40 rounded-xl p-2.5 mt-3 text-center shrink-0">
            <div>
              <span className="text-[10px] font-black text-white font-sans block">45min</span>
              <span className="text-[7px] text-neutral-500 dark:text-neutral-400 font-medium uppercase block tracking-wider mt-0.5">{t('duração')}</span>
            </div>
            <div className="border-x border-neutral-800">
              <span className="text-[10px] font-bold text-[#958CE8] font-sans block">8.7</span>
              <span className="text-[7px] text-neutral-500 dark:text-neutral-400 font-medium uppercase block tracking-wider mt-0.5">{t('sua nota')}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-white font-sans block">{t('1 saída')}</span>
              <span className="text-[7px] text-neutral-500 dark:text-neutral-400 font-medium uppercase block tracking-wider mt-0.5">{t('distrações')}</span>
            </div>
          </div>

          {/* Large Grade Card */}
          <div className="bg-[#16181E] border border-neutral-800/60 rounded-2xl p-3.5 mt-3 text-center flex flex-col items-center">
            <span className="text-[8px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider mb-0.5">{t('sua nota')}</span>
            <span className="text-3xl font-extrabold text-white tracking-tighter">8.7</span>
            <p className="text-[9px] text-neutral-300 font-medium leading-relaxed mt-2.5">
              Você cumpriu o planejado e saiu apenas uma vez. Consistência assim vira resultado.
            </p>
            <span className="text-[7px] text-neutral-500 dark:text-neutral-400 font-mono mt-2 block">
              gerado por IA com base no seu relato
            </span>
          </div>

          {/* Overlapping Cards Stack visual */}
          <div className="mt-3 relative h-[78px] w-full shrink-0">
            <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">
              Seus cards
            </span>
            
            {/* Visual deck layers */}
            <div className="absolute top-4 left-0 w-full h-[46px] bg-[#16181E]/40 border border-neutral-900 rounded-xl border-l-2 border-l-neutral-700/30 opacity-40 transform scale-[0.93] translate-y-2.5" />
            
            <div className="absolute top-4 left-0 w-full h-[46px] bg-[#16181E]/70 border border-neutral-800/60 rounded-xl border-l-2 border-l-neutral-600/60 opacity-80 transform scale-[0.97] translate-y-1.5" />
            
            <div className="absolute top-4 left-0 w-full bg-[#1A1D24] border-l-4 border-l-[#34117E] rounded-xl p-2 h-[46px] border border-neutral-800 flex items-center shadow-lg">
              <p className="text-[8px] font-bold text-white leading-normal">
                8.7 - isso aí 😎, daqui uns dias é muito champanhe e caviar
              </p>
            </div>
          </div>

          {/* Share button and action footer */}
          <div className="mt-auto pb-1 w-full flex flex-col items-center">
            <button className="w-full bg-[#34117E] hover:brightness-105 text-white font-bold py-2.5 rounded-full text-xs text-center shadow-md">
              Copiar cards
            </button>
            <span className="text-[8px] text-neutral-500 dark:text-neutral-400 font-semibold mt-1.5">
              cole direto nos seus stories
            </span>
          </div>

          {/* Bottom Bar Navigation */}
          <div className="bg-[#000000] border-t border-neutral-900/60 px-5 py-1.5 flex justify-between items-center -mx-4 -mb-4 mt-3">
            <Home size={11} className="text-neutral-600" />
            <BarChart3 size={11} className="text-neutral-600" />
            <CheckSquare size={11} className="text-[#958CE8]" />
            <User size={11} className="text-neutral-600" />
          </div>
        </div>
      </div>

    </div>
  );
}
