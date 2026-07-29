import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Briefcase, 
  BookOpenText, 
  Target, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Brain,
  Flame,
  Sun,
  Clock,
  Check,
  ArrowLeft
} from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (data: any) => void;
  onBackToLanding?: () => void;
  userEmail?: string;
}

export function OnboardingScreen({ onComplete, onBackToLanding, userEmail }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Answers state
  const [useCase, setUseCase] = useState<string>(''); // Step 1: Singleselect
  const [biggestChallenge, setBiggestChallenge] = useState<string>(''); // Step 2: Singleselect
  const [focusHours, setFocusHours] = useState<string>(''); // Step 3: Singleselect
  const [productiveTime, setProductiveTime] = useState<string>(''); // Step 4: Singleselect
  const [hour, setHour] = useState(8); // Step 5: Drum picker hours (0-23)
  const [minute, setMinute] = useState(0); // Step 5: Drum picker minutes (0-59)

  // Auto-advance with a slight delay so they can see their selection feedback beautifully
  const autoAdvance = () => {
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }, 400);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (onBackToLanding) {
      onBackToLanding();
    }
  };

  const handleComplete = () => {
    const answers = {
      useCase,
      biggestChallenge,
      focusHours,
      productiveTime,
      reminderTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      userEmail: userEmail || 'anonymous',
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('nakor_onboarding', JSON.stringify(answers));
    onComplete(answers);
  };

  // Selection handlers with auto-advance for single-select steps
  const handleSelectUseCase = (optionId: string) => {
    setUseCase(optionId);
    autoAdvance();
  };

  const handleSelectChallenge = (optionId: string) => {
    setBiggestChallenge(optionId);
    autoAdvance();
  };

  const handleSelectHours = (option: string) => {
    setFocusHours(option);
    autoAdvance();
  };

  const handleSelectProductiveTime = (optionId: string) => {
    setProductiveTime(optionId);
    autoAdvance();
  };

  // Drum picker scroll helpers
  const incrementHour = () => setHour(prev => (prev + 1) % 24);
  const decrementHour = () => setHour(prev => (prev - 1 + 24) % 24);
  const incrementMinute = () => setMinute(prev => (prev + 5) % 60);
  const decrementMinute = () => setMinute(prev => (prev - 5 + 60) % 60);

  // Wheel scroll event handlers
  const handleHourWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      decrementHour();
    } else {
      incrementHour();
    }
  };

  const handleMinuteWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      decrementMinute();
    } else {
      incrementMinute();
    }
  };

  // Options Definitions with specific layout descriptions matching the exact style
  const step1Options = [
    { id: 'Estudos', label: 'Estudos', desc: 'Organizar meus estudos e materiais', icon: <BookOpen size={18} /> },
    { id: 'Trabalho', label: 'Trabalho', desc: 'Gerenciar tarefas e projetos', icon: <Briefcase size={18} /> },
    { id: 'Leitura', label: 'Leitura', desc: 'Acompanhar minhas leituras', icon: <BookOpenText size={18} /> },
    { id: 'Múltiplos objetivos', label: 'Múltiplos objetivos', desc: 'Usar para diferentes áreas da vida', icon: <Target size={18} /> }
  ];

  const step2Options = [
    { id: 'Fico no celular sem querer', label: 'Fico no celular sem querer', desc: 'Perder tempo em redes sociais e apps', emoji: '📱' },
    { id: 'Procrastino muito', label: 'Procrastino muito', desc: 'Adiar tarefas importantes para depois', emoji: '😵' },
    { id: 'Perco o foco rápido', label: 'Perco o foco rápido', desc: 'Dificuldade de concentração profunda', emoji: '🧠' },
    { id: 'Não consigo manter uma rotina', label: 'Não consigo manter uma rotina', desc: 'Falta de constância no dia a dia', emoji: '🕐' }
  ];

  const step3Options = [
    { id: '5h', label: '5 horas', desc: 'Menos de 1h por dia, super tranquilo' },
    { id: '10h', label: '10 horas', desc: 'Cerca de 1.5h por dia, ritmo moderado' },
    { id: '15h', label: '15 horas', desc: 'Cerca de 2h por dia, focado e consistente' },
    { id: '20h+', label: '20h ou mais', desc: 'Foco intenso diário, nível profissional' }
  ];

  const step4Options = [
    { id: 'Manhã', label: 'Manhã', desc: 'Antes do meio-dia, mente descansada', emoji: '🌅' },
    { id: 'Tarde', label: 'Tarde', desc: 'Entre 12h e 18h, jornada padrão', emoji: '☀️' },
    { id: 'Noite', label: 'Noite', desc: 'Após as 18h, silêncio e calma', emoji: '🌙' },
    { id: 'Varia muito', label: 'Varia muito', desc: 'Não tenho um horário fixo definido', emoji: '🔀' }
  ];

  return (
    <div className="w-full h-screen bg-[#0d0e15] text-[#FFFFFF] font-sans overflow-hidden flex flex-col relative select-none">
      
      {/* Immersive ambient glows & coordinate grid */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1c2b] via-[#11121d] to-[#0d0e15] opacity-95" />
        <div className="absolute top-[-25%] left-[-15%] w-[100%] h-[75%] rounded-full bg-gradient-to-br from-[#34117E]/[0.22] via-transparent to-transparent blur-[140px]" />
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#34117E]/[0.10] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,17,126,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,17,126,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>
      
      {/* HEADER: Floating progress bar overlay at the very top */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 bg-transparent flex items-center justify-between max-w-lg mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="mr-3.5 p-2 bg-white dark:bg-[#151622]/[0.04] hover:bg-white dark:bg-[#151622]/[0.08] text-neutral-300 hover:text-white rounded-full transition-colors cursor-pointer shrink-0 border border-white/[0.04]"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Progress Bar lines */}
        <div className="flex gap-1.5 flex-grow mr-6">
          {[0, 1, 2, 3, 4].map((stepIdx) => (
            <div 
              key={stepIdx} 
              className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${
                stepIdx <= currentStep ? 'bg-[#958CE8]' : 'bg-white dark:bg-[#151622]/[0.08]'
              }`}
            />
          ))}
        </div>
        {/* Step Indicator */}
        <span className="text-xs font-mono font-bold text-neutral-400 shrink-0">
          {currentStep + 1} de 5
        </span>
      </div>

      {/* WRAPPER: TikTok translation slider. 100% automated with zero scrollbars */}
      <div 
        className="w-full h-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col relative z-10"
        style={{ transform: `translateY(-${currentStep * 100}%)` }}
      >
        
        {/* --- ETAPA 1 --- */}
        <section className="w-full h-screen flex-shrink-0 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#13141C]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border-2 border-[#34117E]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(52,17,126,0.08)] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Icon in Circle */}
              <div className="w-12 h-12 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                <Target size={22} className="text-[#958CE8]" />
              </div>

              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  Para que você <br />vai usar o <span className="text-[#958CE8]">Nakor?</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step1Options.map((opt) => {
                  const isSelected = useCase === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectUseCase(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-[20px] text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#181a26] border-2 border-[#34117E] shadow-[0_0_15px_rgba(52,17,126,0.15)]' 
                          : 'bg-[#181a26]/40 border border-white/5 hover:bg-[#181a26]/70 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full border border-white/[0.04] bg-white dark:bg-[#151622]/[0.02] flex items-center justify-center text-[#958CE8]">
                          {opt.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#34117E] border-[#34117E] text-white' 
                          : 'border-white/[0.12] bg-transparent'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- ETAPA 2 --- */}
        <section className="w-full h-screen flex-shrink-0 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#13141C]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border-2 border-[#34117E]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(52,17,126,0.08)] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Icon in Circle */}
              <div className="w-12 h-12 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                <Brain size={22} className="text-[#958CE8]" />
              </div>

              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  Qual é o seu <br />maior <span className="text-[#958CE8]">desafio</span> hoje?
                </h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step2Options.map((opt) => {
                  const isSelected = biggestChallenge === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectChallenge(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-[20px] text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#181a26] border-2 border-[#34117E] shadow-[0_0_15px_rgba(52,17,126,0.15)]' 
                          : 'bg-[#181a26]/40 border border-white/5 hover:bg-[#181a26]/70 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full border border-white/[0.04] bg-white dark:bg-[#151622]/[0.02] flex items-center justify-center text-lg">
                          {opt.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#34117E] border-[#34117E] text-white' 
                          : 'border-white/[0.12] bg-transparent'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- ETAPA 3 --- */}
        <section className="w-full h-screen flex-shrink-0 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#13141C]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border-2 border-[#34117E]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(52,17,126,0.08)] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Icon in Circle */}
              <div className="w-12 h-12 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                <Flame size={22} className="text-[#958CE8]" />
              </div>

              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  Quantas horas por <br />semana quer <span className="text-[#958CE8]">focar?</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  Você pode ajustar isso depois
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step3Options.map((opt) => {
                  const isSelected = focusHours === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectHours(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-[20px] text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#181a26] border-2 border-[#34117E] shadow-[0_0_15px_rgba(52,17,126,0.15)]' 
                          : 'bg-[#181a26]/40 border border-white/5 hover:bg-[#181a26]/70 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full border border-white/[0.04] bg-white dark:bg-[#151622]/[0.02] flex items-center justify-center font-mono font-bold text-[#958CE8] text-sm">
                          {opt.id}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#34117E] border-[#34117E] text-white' 
                          : 'border-white/[0.12] bg-transparent'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- ETAPA 4 --- */}
        <section className="w-full h-screen flex-shrink-0 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#13141C]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border-2 border-[#34117E]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(52,17,126,0.08)] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header Icon in Circle */}
              <div className="w-12 h-12 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                <Sun size={22} className="text-[#958CE8]" />
              </div>

              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  Quando você <br />costuma ser <span className="text-[#958CE8]">produtivo?</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step4Options.map((opt) => {
                  const isSelected = productiveTime === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectProductiveTime(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-[20px] text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#181a26] border-2 border-[#34117E] shadow-[0_0_15px_rgba(52,17,126,0.15)]' 
                          : 'bg-[#181a26]/40 border border-white/5 hover:bg-[#181a26]/70 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full border border-white/[0.04] bg-white dark:bg-[#151622]/[0.02] flex items-center justify-center text-lg">
                          {opt.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{opt.label}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#34117E] border-[#34117E] text-white' 
                          : 'border-white/[0.12] bg-transparent'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* --- ETAPA 5: DRUM PICKER --- */}
        <section className="w-full h-screen flex-shrink-0 flex flex-col justify-center items-center px-4">
          <div className="w-full max-w-md bg-[#13141C]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border-2 border-[#34117E]/25 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(52,17,126,0.08)] flex flex-col h-full max-h-[500px] justify-between">
            <div className="space-y-5">
              {/* Header Icon in Circle */}
              <div className="w-12 h-12 rounded-full bg-[#34117E]/10 border border-[#34117E]/25 flex items-center justify-center">
                <Clock size={22} className="text-[#958CE8]" />
              </div>

              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  Que horas quer <br />receber o <span className="text-[#958CE8]">lembrete?</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium leading-normal">
                  O Nakor vai te chamar pro foco todo dia nesse horário
                </p>
              </div>

              {/* BEAUTIFUL DRUM PICKER (Scroll-wheel style exactly like the attachment mockup) */}
              <div className="bg-[#181a26]/40 border border-white/5 rounded-[20px] p-4 flex items-center justify-center relative overflow-hidden select-none h-36">
                
                {/* Horizontal center highlight overlay lines */}
                <div className="absolute inset-x-4 top-[35%] bottom-[35%] border-y border-[#34117E]/30 bg-[#34117E]/5 pointer-events-none rounded" />
                
                {/* Hour wheel column */}
                <div 
                  onWheel={handleHourWheel}
                  className="flex flex-col items-center w-24 relative z-10 py-1 cursor-ns-resize"
                >
                  <button onClick={decrementHour} className="text-neutral-600 hover:text-[#958CE8] transition-colors p-0.5 shrink-0">
                    <ChevronUp size={12} />
                  </button>

                  <div className="flex flex-col items-center -space-y-1.5 my-0.5">
                    {/* Previous Hour */}
                    <span className="text-xs font-bold text-neutral-600">
                      {((hour - 1 + 24) % 24).toString().padStart(2, '0')}
                    </span>
                    {/* Selected Hour */}
                    <span className="text-3xl font-display font-extrabold text-white leading-tight">
                      {hour.toString().padStart(2, '0')}
                    </span>
                    {/* Next Hour */}
                    <span className="text-xs font-bold text-neutral-600">
                      {((hour + 1) % 24).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button onClick={incrementHour} className="text-neutral-600 hover:text-[#958CE8] transition-colors p-0.5 shrink-0">
                    <ChevronDown size={12} />
                  </button>
                </div>

                {/* Colons separator */}
                <span className="text-3xl font-display font-extrabold text-[#958CE8] mx-3 animate-pulse select-none">
                  :
                </span>

                {/* Minute wheel column */}
                <div 
                  onWheel={handleMinuteWheel}
                  className="flex flex-col items-center w-24 relative z-10 py-1 cursor-ns-resize"
                >
                  <button onClick={decrementMinute} className="text-neutral-600 hover:text-[#958CE8] transition-colors p-0.5 shrink-0">
                    <ChevronUp size={12} />
                  </button>

                  <div className="flex flex-col items-center -space-y-1.5 my-0.5">
                    {/* Previous Minute */}
                    <span className="text-xs font-bold text-neutral-600">
                      {((minute - 5 + 60) % 60).toString().padStart(2, '0')}
                    </span>
                    {/* Selected Minute */}
                    <span className="text-3xl font-display font-extrabold text-white leading-tight">
                      {minute.toString().padStart(2, '0')}
                    </span>
                    {/* Next Minute */}
                    <span className="text-xs font-bold text-neutral-600">
                      {((minute + 5) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button onClick={incrementMinute} className="text-neutral-600 hover:text-[#958CE8] transition-colors p-0.5 shrink-0">
                    <ChevronDown size={12} />
                  </button>
                </div>
                
                {/* Drum gloss gradient overlays (TikTok / native wheel effect) */}
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#13141C]/90 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#13141C]/90 to-transparent pointer-events-none" />
              </div>

              <div className="text-center">
                <p className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                  você pode mudar isso quando quiser
                </p>
              </div>
            </div>

            {/* ONLY STEP 5 has a complete button! */}
            <button
              onClick={handleComplete}
              className="w-full bg-[#34117E] hover:brightness-110 active:scale-[0.98] text-white font-bold py-4 rounded-full text-sm transition-all shadow-[0_4px_25px_rgba(52,17,126,0.25)] cursor-pointer"
            >
              Começar agora
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
