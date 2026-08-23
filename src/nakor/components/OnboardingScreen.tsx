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
import { useT } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CARD_MODELS, renderCardModel } from './cards/registry';
import { CARD_SIZES } from './cards/CardPrimitives';
import { ScaleToFit } from './cards/ScaleToFit';
import { useCardData } from '../hooks/useCardData';
import { buildCardTheme, saveCardPreferences } from '../services/cardTheme';


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

/** Prévia real do card de resultado (mesmos componentes usados após a atividade). */
function ResultCardPreview({ modelId, color }: { modelId: string; color: string }) {
  const data = useCardData();
  const theme = buildCardTheme(color);
  return (
    <div className="w-full max-w-[240px] mx-auto pointer-events-none">
      <ScaleToFit width={CARD_SIZES.normal.width}>
        {renderCardModel(modelId, { theme, variant: 'normal', data })}
      </ScaleToFit>
    </div>
  );
}


export function OnboardingScreen({ onComplete, onBackToLanding, userEmail }: OnboardingScreenProps) {
  const t = useT();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Answers state
  const [useCase, setUseCase] = useState<string>(''); // Step 1: Singleselect
  const [biggestChallenge, setBiggestChallenge] = useState<string>(''); // Step 2: Singleselect
  const [focusHours, setFocusHours] = useState<string>(''); // Step 3: Singleselect
  const [productiveTime, setProductiveTime] = useState<string>(''); // Step 4: Singleselect
  const [hour, setHour] = useState(8); // Step 5: Drum picker hours (0-23)
  const [minute, setMinute] = useState(0); // Step 5: Drum picker minutes (0-59)
  const [cardLayout, setCardLayout] = useState<string>('session'); // Step 6
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
    saveCardPreferences({ selectedModelId: cardLayout, selectedColor: cardColor });

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
    { id: 'Estudos', label: t('Estudos'), desc: t('Organizar meus estudos e materiais'), icon: <BookOpen size={26} strokeWidth={2} /> },
    { id: 'Trabalho', label: t('Trabalho'), desc: t('Gerenciar tarefas e projetos'), icon: <Briefcase size={26} strokeWidth={2} /> },
    { id: 'Leitura', label: t('Leitura'), desc: t('Acompanhar minhas leituras'), icon: <BookOpenText size={26} strokeWidth={2} /> },
    { id: 'Múltiplos objetivos', label: t('Múltiplos objetivos'), desc: t('Diferentes áreas da vida'), icon: <Target size={26} strokeWidth={2} /> }
  ];

  const step2Options: GridOption[] = [
    { id: 'Fico no celular sem querer', label: t('Fico no celular'), desc: t('Perco tempo em redes sociais'), emoji: '📱' },
    { id: 'Procrastino muito', label: t('Procrastino muito'), desc: t('Adio tarefas importantes'), emoji: '😵' },
    { id: 'Perco o foco rápido', label: t('Perco o foco'), desc: t('Difícil concentrar profundo'), emoji: '🧠' },
    { id: 'Não consigo manter uma rotina', label: t('Sem rotina'), desc: t('Falta de constância no dia'), emoji: '🕐' }
  ];

  const step3Options: GridOption[] = [
    { id: '5h', label: t('5 horas'), desc: t('Menos de 1h por dia'), badge: '5h' },
    { id: '10h', label: t('10 horas'), desc: t('Cerca de 1.5h por dia'), badge: '10h' },
    { id: '15h', label: t('15 horas'), desc: t('Cerca de 2h por dia'), badge: '15h' },
    { id: '20h+', label: t('20h ou mais'), desc: t('Foco intenso diário'), badge: '20h+' }
  ];

  const step4Options: GridOption[] = [
    { id: 'Manhã', label: t('Manhã'), desc: t('Antes do meio-dia'), emoji: '🌅' },
    { id: 'Tarde', label: t('Tarde'), desc: t('Entre 12h e 18h'), emoji: '☀️' },
    { id: 'Noite', label: t('Noite'), desc: t('Após as 18h'), emoji: '🌙' },
    { id: 'Varia muito', label: t('Varia muito'), desc: t('Sem horário fixo'), emoji: '🔀' }
  ];

  const cardColors = [
    { name: t('Roxo'), hex: '#7C3AED' },
    { name: t('Azul'), hex: '#2563EB' },
    { name: t('Verde Limão'), hex: '#A5CE00' },
    { name: t('Azul Metálico'), hex: '#0CB6D7' },
    { name: t('Rosa Vibrante'), hex: '#EC4899' },
    { name: t('Branco'), hex: '#FFFFFF' }
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
      <div className="relative z-50 shrink-0 px-4 sm:px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 bg-transparent grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 sm:gap-3 max-w-lg mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="p-2.5 bg-white/80 hover:bg-white text-text-primary rounded-full transition-all cursor-pointer shrink-0 border border-brand-border shadow-sm-layered backdrop-blur-md"
          aria-label={t('Voltar')}
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
          {t('{n} de 6', { n: currentStep + 1 })}
        </span>
        <LanguageSwitcher />
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
                  {t('Para que você')} <br />{t('vai usar o')} <span className="text-brand-purple-500">Nakor?</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  {t('Selecione uma opção')}
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
                  {t('Qual é o seu')} <br />{t('maior')} <span className="text-brand-purple-500">{t('desafio')}</span> {t('hoje?')}
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  {t('Selecione uma opção')}
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
                  {t('Quantas horas por')} <br />{t('semana quer')} <span className="text-brand-purple-500">{t('focar?')}</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  {t('Você pode ajustar isso depois')}
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
                  {t('Quando você')} <br />{t('costuma ser')} <span className="text-brand-purple-500">{t('produtivo?')}</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium">
                  {t('Selecione uma opção')}
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
                  {t('Que horas quer')} <br />{t('receber o')} <span className="text-brand-purple-500">{t('lembrete?')}</span>
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium leading-normal">
                  {t('O Nakor vai te chamar pro foco todo dia nesse horário')}
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
                  {t('você pode mudar isso quando quiser')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(5)}
              className="w-full bg-brand-purple-500 hover:bg-brand-purple-600 hover:brightness-110 active:scale-[0.98] text-white font-semibold py-4 rounded-full text-[15px] transition-all shadow-[0_4px_30px_rgba(46,46,184,0.25)] cursor-pointer"
            >
              {t('Continuar')}
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
                  {t('Personalize o seu')} <br /><span className="text-brand-purple-500">{t('card')}</span> {t('de resultado')}
                </h2>
                <p className="text-[13px] text-text-secondary mt-2 font-medium leading-normal">
                  {t('Escolha o modelo e a cor — pode mudar depois nas configurações')}
                </p>
              </div>

              {/* Prévia real do card */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {t('Prévia')}
                </p>
                <div className="rounded-[22px] p-4 bg-brand-card border border-brand-border/60 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.12)] flex items-center justify-center">
                  <ResultCardPreview modelId={cardLayout} color={cardColor} />
                </div>
                <p className="text-[10.5px] text-text-secondary text-center">
                  {t(CARD_MODELS.find((m) => m.id === cardLayout)?.description || '')}
                </p>
              </div>

              {/* Modelo */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {t('Modelo')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {CARD_MODELS.map((opt) => {
                    const isSelected = cardLayout === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        onClick={() => setCardLayout(opt.id)}
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
                        <p
                          className={`text-[13px] font-semibold leading-tight ${
                            isSelected ? 'text-text-primary' : 'text-text-primary/60'
                          }`}
                        >
                          {opt.name}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{t(opt.description)}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Cor */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {t('Cor de destaque')}
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
              {t('Começar agora')}
            </button>
          </div>
        </section>


      </div>
      </div>

    </div>
  );
}
