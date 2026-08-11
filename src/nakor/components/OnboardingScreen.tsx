import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Briefcase, 
  BookOpenText, 
  Target, 
  ChevronUp, 
  ChevronDown,
  Brain,
  Flame,
  Sun,
  Clock,
  Sparkles,
  ArrowLeft,
  Check

} from 'lucide-react';
import { AuraDomeCard } from './AuraDomeCard';
import { WidgetStackCard } from './WidgetStackCard';
import { CARD_LAYOUTS, LayoutThumb, type CardLayoutId } from './CardLayoutThumbs';


interface OnboardingScreenProps {
  onComplete: (data: any) => void;
  onBackToLanding?: () => void;
  userEmail?: string;
}

type GridOption = {
  id: string;
  label: string;
  desc: string;
  icon?: React.ReactNode;
  emoji?: string;
  badge?: string;
};

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: GridOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <motion.button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-hidden text-left rounded-[22px] p-4 min-h-[150px] flex flex-col justify-between transition-all duration-300 cursor-pointer border ${
              isSelected
                ? 'bg-white border-brand-purple-300/80 shadow-[0_0_0_2px_rgba(91,52,199,0.12),0_18px_40px_-14px_rgba(91,52,199,0.35)]'
                : 'bg-white/60 border-brand-purple-200/50 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_22px_-14px_rgba(91,52,199,0.18)] hover:bg-white/85 hover:border-brand-purple-300/70'
            }`}
          >
            {/* soft inner sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-brand-purple-100/30" />
            {isSelected && (
              <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-brand-purple-100/70 blur-2xl" />
            )}

            <div className="relative z-10">
              {opt.icon ? (
                <div
                  className={`transition-all ${
                    isSelected
                      ? 'text-brand-purple-500 drop-shadow-[0_0_12px_rgba(46,46,184,0.55)]'
                      : 'text-brand-purple-500/70 drop-shadow-[0_0_8px_rgba(46,46,184,0.3)]'
                  }`}
                >
                  {opt.icon}
                </div>
              ) : opt.emoji ? (
                <span
                  className={`text-[26px] leading-none block transition-all ${
                    isSelected
                      ? 'drop-shadow-[0_0_12px_rgba(46,46,184,0.45)]'
                      : 'opacity-80'
                  }`}
                >
                  {opt.emoji}
                </span>
              ) : (
                <span
                  className={`font-display font-extrabold text-[24px] leading-none block transition-all ${
                    isSelected
                      ? 'text-brand-purple-500 drop-shadow-[0_0_12px_rgba(46,46,184,0.5)]'
                      : 'text-brand-purple-500/70'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </div>

            <div className="relative z-10">
              <p
                className={`text-[14px] font-semibold leading-tight ${
                  isSelected ? 'text-text-primary' : 'text-text-primary/85'
                }`}
              >
                {opt.label}
              </p>
              <p className="text-[11px] text-text-secondary mt-1 leading-snug">
                {opt.desc}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  let c = (hex || '#7C3AED').replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Prévia real do card de resultado (mesma ideia da tela de Cores dos cards). */
function ResultCardPreview({ layout, color }: { layout: CardLayoutId; color: string }) {
  if (layout === 'aura' || layout === 'widget') {
    const props = {
      accentColor: color,
      title: 'Estudar',
      minutes: 25,
      plannedMinutes: 30,
      score: 8.7,
      exits: 0,
      streak: 3,
      message: 'isso aí 😎',
    };
    return (
      <div className="w-full max-w-[210px] mx-auto">
        {layout === 'aura' ? <AuraDomeCard {...props} /> : <WidgetStackCard {...props} />}
      </div>
    );
  }

  if (layout === 'trio') {
    const cards: Array<{ tag: string; text?: string; nota?: string }> = [
      { tag: 'ANTES', text: 'Estava cansado e sem foco...' },
      { tag: 'DEPOIS', text: 'Consegui terminar tudo!' },
      { tag: 'NOTA', nota: '8.7' },
    ];
    return (
      <div className="flex gap-2 items-stretch w-full">
        {cards.map((c) => (
          <div
            key={c.tag}
            className="flex-1 relative overflow-hidden flex flex-col justify-between p-2"
            style={{
              borderRadius: '14px',
              aspectRatio: '4 / 5',
              backgroundColor: '#0D0F14',
              backgroundImage: `linear-gradient(180deg, ${hexToRgba(color, 0.85)} 0%, ${hexToRgba(color, 0.25)} 45%, #0D0F14 100%)`,
              boxShadow: `0 10px 24px -12px ${hexToRgba(color, 0.55)}`,
            }}
          >
            <div className="flex items-center justify-between opacity-70">
              <span className="text-[4.5px] font-mono tracking-widest text-white uppercase">SESSÃO FOCO</span>
              <span className="text-[5.5px] font-bold tracking-tight text-white">Nakor</span>
            </div>
            {c.nota ? (
              <div className="flex flex-col items-center my-auto">
                <span className="text-[4.5px] font-mono tracking-widest text-white/60">NOTA</span>
                <span className="text-white font-extrabold text-[26px] leading-none tracking-tighter">{c.nota}</span>
                <span className="text-white/75 text-[6px] mt-1">isso aí 😎</span>
              </div>
            ) : (
              <div
                className="my-auto w-full p-1.5 flex flex-col items-center"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.30)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <span className="text-[4.5px] font-mono tracking-widest text-white/60 mb-1">{c.tag}</span>
                <p className="text-white text-[6px] italic leading-snug m-0 text-center">"{c.text}"</p>
              </div>
            )}
            <div className="flex justify-between text-[4.5px] font-mono text-white/70 pt-1 border-t border-white/10">
              <span>25MIN</span>
              <span>14:30</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden w-full max-w-[210px] mx-auto p-3.5 flex flex-col justify-between"
      style={{
        aspectRatio: '1 / 1',
        borderRadius: '32px',
        backgroundColor: '#0A0A0C',
        backgroundImage: `radial-gradient(120% 85% at 50% 108%, ${hexToRgba(color, 0.95)} 0%, ${hexToRgba(color, 0.5)} 38%, ${hexToRgba(color, 0.1)} 66%, rgba(10,10,12,0) 85%)`,
        boxShadow: `0 18px 40px -16px ${hexToRgba(color, 0.5)}, inset 0 0 0 1px rgba(255,255,255,0.07)`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
        />
        <div>
          <p className="text-white font-bold text-[10px] leading-none m-0">Estudar</p>
          <p className="text-white/60 text-[7px] leading-none m-0 mt-1">3 dias de foco</p>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        {[
          { v: '25', l: 'min' },
          { v: '8.7', l: 'nota' },
          { v: '0', l: 'saídas' },
        ].map((s) => (
          <div key={s.l} className="flex flex-col">
            <span className="text-white font-bold text-[13px] leading-none">{s.v}</span>
            <span className="text-white/55 text-[7px] mt-0.5">{s.l}</span>
          </div>
        ))}
      </div>
      <div
        className="w-full mt-2 relative overflow-hidden"
        style={{ height: '22px', borderRadius: '9px', backgroundColor: 'rgba(255,255,255,0.16)' }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '78%',
            borderRadius: '9px',
            backgroundColor: hexToRgba(color, 0.95),
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.26) 0px, rgba(255,255,255,0.26) 6px, rgba(255,255,255,0.02) 6px, rgba(255,255,255,0.02) 14px)',
          }}
        />
      </div>
      <div className="flex items-end justify-between mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-[30px] leading-none tracking-tight">25</span>
          <span className="text-white/70 text-[8px] font-medium">min focados</span>
        </div>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.28)',
          }}
        >
          <span className="text-white font-extrabold text-[12px] leading-none">8.7</span>
          <span className="text-white/75 text-[5.5px] mt-0.5 font-semibold uppercase">nota</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[5.5px] font-mono tracking-wider text-white/70">
        <span>nakor.com.br</span>
        <span>SESSÃO FOCO</span>
      </div>
    </div>
  );
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
  const [cardLayout, setCardLayout] = useState<CardLayoutId>('trio'); // Step 6
  const [cardColor, setCardColor] = useState('#7C3AED'); // Step 6

  const TOTAL_STEPS = 6;

  // Auto-advance with a slight delay so they can see their selection feedback beautifully
  const autoAdvance = () => {
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
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
      cardLayout,
      cardColor,
      userEmail: userEmail || 'anonymous',
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('nakor_onboarding', JSON.stringify(answers));

    // Salva o estilo dos cards escolhido aqui, para já ficar na conta do usuário
    try {
      const savedRaw = localStorage.getItem('nakor_estilo_cards');
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      localStorage.setItem(
        'nakor_estilo_cards',
        JSON.stringify({ ...saved, layout: cardLayout, accentColor: cardColor }),
      );
    } catch {
      localStorage.setItem(
        'nakor_estilo_cards',
        JSON.stringify({ layout: cardLayout, accentColor: cardColor }),
      );
    }

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
  const step1Options: GridOption[] = [
    { id: 'Estudos', label: 'Estudos', desc: 'Organizar meus estudos e materiais', icon: <BookOpen size={26} strokeWidth={2} /> },
    { id: 'Trabalho', label: 'Trabalho', desc: 'Gerenciar tarefas e projetos', icon: <Briefcase size={26} strokeWidth={2} /> },
    { id: 'Leitura', label: 'Leitura', desc: 'Acompanhar minhas leituras', icon: <BookOpenText size={26} strokeWidth={2} /> },
    { id: 'Múltiplos objetivos', label: 'Múltiplos objetivos', desc: 'Diferentes áreas da vida', icon: <Target size={26} strokeWidth={2} /> }
  ];

  const step2Options: GridOption[] = [
    { id: 'Fico no celular sem querer', label: 'Fico no celular', desc: 'Perco tempo em redes sociais', emoji: '📱' },
    { id: 'Procrastino muito', label: 'Procrastino muito', desc: 'Adio tarefas importantes', emoji: '😵' },
    { id: 'Perco o foco rápido', label: 'Perco o foco', desc: 'Difícil concentrar profundo', emoji: '🧠' },
    { id: 'Não consigo manter uma rotina', label: 'Sem rotina', desc: 'Falta de constância no dia', emoji: '🕐' }
  ];

  const step3Options: GridOption[] = [
    { id: '5h', label: '5 horas', desc: 'Menos de 1h por dia', badge: '5h' },
    { id: '10h', label: '10 horas', desc: 'Cerca de 1.5h por dia', badge: '10h' },
    { id: '15h', label: '15 horas', desc: 'Cerca de 2h por dia', badge: '15h' },
    { id: '20h+', label: '20h ou mais', desc: 'Foco intenso diário', badge: '20h+' }
  ];

  const step4Options: GridOption[] = [
    { id: 'Manhã', label: 'Manhã', desc: 'Antes do meio-dia', emoji: '🌅' },
    { id: 'Tarde', label: 'Tarde', desc: 'Entre 12h e 18h', emoji: '☀️' },
    { id: 'Noite', label: 'Noite', desc: 'Após as 18h', emoji: '🌙' },
    { id: 'Varia muito', label: 'Varia muito', desc: 'Sem horário fixo', emoji: '🔀' }
  ];

  const cardColors = [
    { name: 'Roxo', hex: '#7C3AED' },
    { name: 'Azul', hex: '#2563EB' },
    { name: 'Verde Limão', hex: '#A5CE00' },
    { name: 'Azul Metálico', hex: '#0CB6D7' },
    { name: 'Rosa Vibrante', hex: '#EC4899' },
    { name: 'Branco', hex: '#FFFFFF' }
  ];



  return (
    <div className="w-full h-screen bg-brand-bg text-text-primary font-sans overflow-hidden flex flex-col relative select-none">
      
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-bg to-brand-bg" />
        <div className="absolute top-[-15%] left-[-20%] w-[90%] h-[70%] rounded-full bg-brand-purple-100/60 blur-[140px]" />
        <div className="absolute top-[35%] right-[-25%] w-[70%] h-[60%] rounded-full bg-brand-purple-100/40 blur-[120px]" />
        <div className="absolute inset-0 brand-dot-grid opacity-60" />
      </div>
      
      {/* HEADER */}
      <div className="relative z-50 shrink-0 px-4 sm:px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 bg-transparent grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 max-w-lg mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="p-2.5 bg-white/80 hover:bg-white text-text-primary rounded-full transition-all cursor-pointer shrink-0 border border-brand-border shadow-sm-layered backdrop-blur-md"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Progress Bar */}
        <div className="flex min-w-0 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((stepIdx) => (
            <div 
              key={stepIdx} 
              className={`h-1.5 flex-1 min-w-0 rounded-full transition-all duration-300 ${
                stepIdx <= currentStep ? 'bg-brand-purple-500' : 'bg-brand-border'
              }`}
            />
          ))}
        </div>
        {/* Step Indicator */}
        <span className="text-xs font-medium text-text-secondary shrink-0 tabular-nums">
          {currentStep + 1} de 6
        </span>
      </div>

      {/* SLIDER */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
      <div 
        className="w-full h-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col"
        style={{ transform: `translateY(-${currentStep * 100}%)` }}
      >

        
        {/* --- ETAPA 1 --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Target size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Para que você <br />vai usar o <span className="text-brand-purple-500">Nakor?</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              <OptionGrid options={step1Options} selected={useCase} onSelect={handleSelectUseCase} />

            </div>
          </div>
        </section>

        {/* --- ETAPA 2 --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Brain size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Qual é o seu <br />maior <span className="text-brand-purple-500">desafio</span> hoje?
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              <OptionGrid options={step2Options} selected={biggestChallenge} onSelect={handleSelectChallenge} />

            </div>
          </div>
        </section>

        {/* --- ETAPA 3 --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Flame size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Quantas horas por <br />semana quer <span className="text-brand-purple-500">focar?</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  Você pode ajustar isso depois
                </p>
              </div>

              <OptionGrid options={step3Options} selected={focusHours} onSelect={handleSelectHours} />

            </div>
          </div>
        </section>

        {/* --- ETAPA 4 --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Sun size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Quando você <br />costuma ser <span className="text-brand-purple-500">produtivo?</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  Selecione uma opção
                </p>
              </div>

              <OptionGrid options={step4Options} selected={productiveTime} onSelect={handleSelectProductiveTime} />

            </div>
          </div>
        </section>

        {/* --- ETAPA 5: DRUM PICKER --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col h-full max-h-[520px] justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Clock size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Que horas quer <br />receber o <span className="text-brand-purple-500">lembrete?</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium leading-normal">
                  O Nakor vai te chamar pro foco todo dia nesse horário
                </p>
              </div>

              <div className="bg-brand-bg border border-brand-border rounded-[24px] p-4 flex items-center justify-center relative overflow-hidden select-none h-40">
                <div className="absolute inset-x-4 top-[35%] bottom-[35%] border-y border-brand-purple-100 bg-brand-purple-50/50 pointer-events-none rounded-lg" />
                
                <div 
                  onWheel={handleHourWheel}
                  className="flex flex-col items-center w-24 relative z-10 py-1 cursor-ns-resize"
                >
                  <button onClick={decrementHour} className="text-text-placeholder hover:text-brand-purple-500 transition-colors p-0.5 shrink-0">
                    <ChevronUp size={14} />
                  </button>

                  <div className="flex flex-col items-center -space-y-1 my-0.5">
                    <span className="text-xs font-bold text-text-placeholder">
                      {((hour - 1 + 24) % 24).toString().padStart(2, '0')}
                    </span>
                    <span className="text-4xl font-display font-extrabold text-text-primary leading-tight">
                      {hour.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-text-placeholder">
                      {((hour + 1) % 24).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button onClick={incrementHour} className="text-text-placeholder hover:text-brand-purple-500 transition-colors p-0.5 shrink-0">
                    <ChevronDown size={14} />
                  </button>
                </div>

                <span className="text-4xl font-display font-extrabold text-brand-purple-500 mx-3 animate-pulse select-none">
                  :
                </span>

                <div 
                  onWheel={handleMinuteWheel}
                  className="flex flex-col items-center w-24 relative z-10 py-1 cursor-ns-resize"
                >
                  <button onClick={decrementMinute} className="text-text-placeholder hover:text-brand-purple-500 transition-colors p-0.5 shrink-0">
                    <ChevronUp size={14} />
                  </button>

                  <div className="flex flex-col items-center -space-y-1 my-0.5">
                    <span className="text-xs font-bold text-text-placeholder">
                      {((minute - 5 + 60) % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-4xl font-display font-extrabold text-text-primary leading-tight">
                      {minute.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-text-placeholder">
                      {((minute + 5) % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <button onClick={incrementMinute} className="text-text-placeholder hover:text-brand-purple-500 transition-colors p-0.5 shrink-0">
                    <ChevronDown size={14} />
                  </button>
                </div>
                
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-brand-card/95 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-brand-card/95 to-transparent pointer-events-none" />
              </div>

              <div className="text-center">
                <p className="text-[11px] font-medium text-text-secondary">
                  você pode mudar isso quando quiser
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(5)}
              className="w-full bg-brand-purple-500 hover:bg-brand-purple-600 hover:brightness-110 active:scale-[0.98] text-white font-semibold py-4 rounded-full text-[15px] transition-all shadow-[0_4px_30px_rgba(46,46,184,0.25)] cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </section>

        {/* --- ETAPA 6: PERSONALIZAR O CARD --- */}
        <section className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col justify-center items-center px-4 sm:px-5 py-4">
          <div className="w-full max-w-md bg-brand-card backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 border border-brand-border shadow-lg-layered flex flex-col">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-full bg-brand-purple-50 border border-brand-purple-100 flex items-center justify-center">
                <Sparkles size={22} className="text-brand-purple-500" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-text-primary tracking-tight leading-[1.1]">
                  Personalize o seu <br /><span className="text-brand-purple-500">card</span> de resultado
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium leading-normal">
                  Escolha o modelo e a cor — pode mudar depois nas configurações
                </p>
              </div>

              {/* Prévia real do card */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Prévia
                </p>
                <div className="rounded-[22px] p-4 bg-brand-card border border-brand-border/60 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.12)] flex items-center justify-center">
                  <ResultCardPreview layout={cardLayout} color={cardColor} />
                </div>
                <p className="text-[10.5px] text-text-secondary text-center">
                  {CARD_LAYOUTS.find((l) => l.id === cardLayout)?.hint}
                </p>
              </div>

              {/* Modelo */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Modelo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(['trio', 'unificado'] as const).map((model) => {
                    const isSelected = cardLayout === model;
                    return (
                      <motion.button
                        key={model}
                        onClick={() => setCardLayout(model)}
                        whileTap={{ scale: 0.97 }}
                        animate={{ scale: isSelected ? 1.02 : 1 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                        className="relative overflow-hidden text-left rounded-[22px] p-3 pt-3 transition-all duration-300 cursor-pointer bg-white"
                        style={{
                          border: `2px solid ${isSelected ? cardColor : 'rgba(219,219,229,0.7)'}`,
                          boxShadow: isSelected
                            ? `0 0 0 4px ${hexToRgba(cardColor, 0.14)}, 0 18px 36px -16px ${hexToRgba(cardColor, 0.5)}`
                            : '0 1px 2px rgba(0,0,0,0.04)',
                        }}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-10"
                            style={{ backgroundColor: cardColor, border: '1px solid rgba(255,255,255,0.6)' }}
                          >
                            <Check size={12} strokeWidth={3.5} color={cardColor === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />
                          </div>
                        )}
                        {model === 'trio' ? (
                          <div className="flex gap-1.5 mb-2.5">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-[6px]"
                                style={{
                                  aspectRatio: '4 / 5',
                                  background: `linear-gradient(180deg, ${cardColor} 0%, #0D0F14 75%)`,
                                  opacity: isSelected ? 1 : 0.5,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="w-full rounded-[10px] mb-2.5"
                            style={{
                              aspectRatio: '5 / 4',
                              background: `radial-gradient(circle at 50% 110%, ${cardColor} 0%, #0D0F14 70%)`,
                              opacity: isSelected ? 1 : 0.5,
                            }}
                          />
                        )}
                        <p
                          className={`text-[13px] font-semibold leading-tight ${
                            isSelected ? 'text-text-primary' : 'text-text-primary/60'
                          }`}
                        >
                          {model === 'trio' ? '3 cards alinhados' : 'Card único'}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                          {model === 'trio' ? 'Antes • Depois • Nota' : 'Fundo escuro com glow'}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Cor */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Cor de destaque
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {cardColors.map((c) => {
                    const isSelected = cardColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        onClick={() => setCardColor(c.hex)}
                        aria-label={c.name}
                        className="w-10 h-10 rounded-full cursor-pointer transition-all flex items-center justify-center hover:scale-105"
                        style={{
                          backgroundColor: c.hex,
                          border: isSelected ? '3px solid #21222D' : '1px solid rgba(219,219,229,0.9)',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: isSelected ? `0 0 0 4px ${hexToRgba(c.hex, 0.22)}` : 'none',
                        }}
                      >
                        {isSelected && (
                          <Check size={14} strokeWidth={3.5} color={c.hex === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <button
              onClick={handleComplete}
              className="mt-6 w-full bg-brand-purple-500 hover:bg-brand-purple-600 hover:brightness-110 active:scale-[0.98] text-white font-semibold py-4 rounded-full text-[15px] transition-all shadow-[0_4px_30px_rgba(46,46,184,0.25)] cursor-pointer"
            >
              Começar agora
            </button>
          </div>
        </section>


      </div>
      </div>

    </div>
  );
}
