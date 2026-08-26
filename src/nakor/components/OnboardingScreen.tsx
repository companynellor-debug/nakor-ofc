import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  GraduationCap,
  Rocket,
  CalendarCheck,
  Laptop,
  BookOpenText,
  PenTool,
  Users,
  Timer,
  Hourglass,
  Waves,
  Shuffle,
  Sunrise,
  Sun,
  Moon,
  Smartphone,
  Hourglass as HourglassIcon,
  Brain,
  Repeat,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Check,
  Sparkles,
  Clock,
  Palette,
  Target,
} from 'lucide-react';
import { useT } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CARD_MODELS, renderCardModel } from './cards/registry';
import { CARD_SIZES } from './cards/CardPrimitives';
import { ScaleToFit } from './cards/ScaleToFit';
import { useCardData } from '../hooks/useCardData';
import { buildCardTheme, saveCardPreferences, hexToRgba } from '../services/cardTheme';
import { LoadingPreparation } from './LoadingPreparation';

interface OnboardingScreenProps {
  onComplete: (data: any) => void;
  onBackToLanding?: () => void;
  userEmail?: string;
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

type Option = {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
};

const CARD_COLORS = [
  { name: 'Roxo', hex: '#7C3AED' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Verde Limão', hex: '#84CC16' },
  { name: 'Azul Metálico', hex: '#38BDF8' },
  { name: 'Rosa Vibrante', hex: '#EC4899' },
  { name: 'Branco', hex: '#FFFFFF' },
];

/* ---------------- Sub-componentes ---------------- */

function StepShell({
  eyebrow,
  title,
  highlight,
  subtitle,
  accent,
  children,
  footer,
}: {
  icon?: React.ReactNode;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  accent: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.26em] text-white/30">{eyebrow}</p>
        <h2 className="font-display text-[28px] sm:text-[32px] font-medium text-white leading-[1.14] tracking-[-0.01em]">
          {title}
          {highlight ? <> {highlight}</> : null}
        </h2>
        {subtitle && <p className="text-[13.5px] text-white/45 font-normal leading-relaxed">{subtitle}</p>}
      </div>

      {children}

      {footer}
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
  accent,
}: {
  options: Option[];
  selected: string;
  onSelect: (id: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-col border-t border-white/[0.07]">
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="group relative w-full text-left border-b border-white/[0.07] py-4 pl-4 pr-3 flex items-center gap-4 cursor-pointer transition-colors"
            style={{ background: active ? hexToRgba(accent, 0.07) : 'transparent' }}
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity"
              style={{ background: accent, opacity: active ? 1 : 0 }}
            />
            <span className="flex-1 min-w-0">
              <span className={`block text-[15.5px] leading-tight ${active ? 'text-white font-medium' : 'text-white/75 font-normal'}`}>
                {opt.label}
              </span>
              <span className="block text-[12.5px] text-white/35 mt-1 leading-snug">{opt.desc}</span>
            </span>
            <span
              className="w-[18px] h-[18px] rounded-full border shrink-0 flex items-center justify-center transition-colors"
              style={{
                borderColor: active ? accent : 'rgba(255,255,255,0.18)',
                background: active ? accent : 'transparent',
              }}
            >
              {active && <Check size={11} strokeWidth={3} color={accent === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  accent,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  accent: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[15px] rounded-full text-[14.5px] font-medium transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      style={{
        background: accent,
        color: accent === '#FFFFFF' ? '#0B0B12' : '#FFFFFF',
      }}
    >
      {children}
    </button>
  );
}

/** Prévia real do card de resultado (mesmos componentes usados após a atividade). */
function ResultCardPreview({ modelId, color }: { modelId: string; color: string }) {
  const data = useCardData();
  const theme = useMemo(() => buildCardTheme(color), [color]);
  return (
    <div className="w-full max-w-[220px] mx-auto pointer-events-none">
      <ScaleToFit width={CARD_SIZES.normal.width}>
        {renderCardModel(modelId, { theme, variant: 'normal', data })}
      </ScaleToFit>
    </div>
  );
}


/* ---------------- Tela principal ---------------- */

export function OnboardingScreen({ onComplete, onBackToLanding, userEmail, onThemeChange }: OnboardingScreenProps) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [preparing, setPreparing] = useState(false);

  // Respostas
  const [goal, setGoal] = useState('');
  const [workType, setWorkType] = useState('');
  const [focusHours, setFocusHours] = useState('');
  const [sessionStyle, setSessionStyle] = useState('');
  const [productiveTime, setProductiveTime] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [cardLayout, setCardLayout] = useState('session');
  const [cardColor, setCardColor] = useState('#7C3AED');
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('dark');

  const accent = cardColor;

  // 0 = boas-vindas, 1..10 = etapas, 11 = resumo
  const TOTAL = 12;
  const SEGMENTS = 11; // etapas 1..11

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(TOTAL - 1, next)));
  };

  const advance = () => go(step + 1);
  const autoAdvance = () => setTimeout(() => go(step + 1), 340);

  const handleBack = () => {
    if (step > 0) go(step - 1);
    else onBackToLanding?.();
  };

  const answers = () => ({
    goal,
    workType,
    // mantém a chave legada usada em outras telas
    useCase: workType,
    focusHours,
    sessionStyle,
    productiveTime,
    biggestChallenge: obstacle,
    reminderTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    cardLayout,
    cardColor,
    theme: appTheme,
    userEmail: userEmail || 'anonymous',
    completedAt: new Date().toISOString(),
  });

  const startPreparing = () => {
    const data = answers();
    localStorage.setItem('nakor_onboarding', JSON.stringify(data));
    saveCardPreferences({ selectedModelId: cardLayout, selectedColor: cardColor, bgOpacity: 100 });
    localStorage.setItem('nakor_theme', appTheme);
    onThemeChange?.(appTheme);
    setPreparing(true);
  };

  const finish = () => onComplete(answers());

  const adjust = (setter: (fn: (v: number) => number) => void, delta: number, mod: number) =>
    setter((v) => (v + delta + mod) % mod);

  /* ------- opções ------- */
  const goalOptions: Option[] = [
    { id: 'deliver', label: t('Entregar mais no trabalho'), desc: t('Foco em resultado real'), icon: <Briefcase size={22} /> },
    { id: 'study', label: t('Estudar com constância'), desc: t('Rotina de estudo sólida'), icon: <GraduationCap size={22} /> },
    { id: 'build', label: t('Criar meus projetos'), desc: t('Tirar ideias do papel'), icon: <Rocket size={22} /> },
    { id: 'routine', label: t('Organizar minha rotina'), desc: t('Dias mais previsíveis'), icon: <CalendarCheck size={22} /> },
  ];

  const workTypeOptions: Option[] = [
    { id: 'work', label: t('Trabalho'), desc: t('Tarefas e projetos'), icon: <Laptop size={22} /> },
    { id: 'studies', label: t('Estudos'), desc: t('Provas e matérias'), icon: <BookOpenText size={22} /> },
    { id: 'personal', label: t('Projeto pessoal'), desc: t('Algo seu, do zero'), icon: <PenTool size={22} /> },
    { id: 'freelance', label: t('Freelance'), desc: t('Clientes e entregas'), icon: <Users size={22} /> },
  ];

  const hoursOptions: Option[] = [
    { id: '5h', label: t('5 horas'), desc: t('Menos de 1h por dia'), icon: <Timer size={22} /> },
    { id: '10h', label: t('10 horas'), desc: t('Cerca de 1.5h por dia'), icon: <Hourglass size={22} /> },
    { id: '15h', label: t('15 horas'), desc: t('Cerca de 2h por dia'), icon: <Waves size={22} /> },
    { id: '20h+', label: t('20h ou mais'), desc: t('Foco intenso diário'), icon: <Target size={22} /> },
  ];

  const sessionOptions: Option[] = [
    { id: '25', label: t('Sessões curtas'), desc: t('25 minutos por bloco'), icon: <Timer size={22} /> },
    { id: '50', label: t('Sessões médias'), desc: t('50 minutos por bloco'), icon: <HourglassIcon size={22} /> },
    { id: '90', label: t('Sessões longas'), desc: t('90 minutos de imersão'), icon: <Waves size={22} /> },
    { id: 'varies', label: t('Depende do dia'), desc: t('Sem duração fixa'), icon: <Shuffle size={22} /> },
  ];

  const timeOptions: Option[] = [
    { id: 'morning', label: t('Manhã'), desc: t('Antes do meio-dia'), icon: <Sunrise size={22} /> },
    { id: 'afternoon', label: t('Tarde'), desc: t('Entre 12h e 18h'), icon: <Sun size={22} /> },
    { id: 'night', label: t('Noite'), desc: t('Após as 18h'), icon: <Moon size={22} /> },
    { id: 'varies', label: t('Varia muito'), desc: t('Sem horário fixo'), icon: <Shuffle size={22} /> },
  ];

  const obstacleOptions: Option[] = [
    { id: 'phone', label: t('Fico no celular'), desc: t('Perco tempo em redes sociais'), icon: <Smartphone size={22} /> },
    { id: 'procrastination', label: t('Procrastino muito'), desc: t('Adio tarefas importantes'), icon: <HourglassIcon size={22} /> },
    { id: 'shallow', label: t('Perco o foco'), desc: t('Difícil concentrar profundo'), icon: <Brain size={22} /> },
    { id: 'routine', label: t('Sem rotina'), desc: t('Falta de constância no dia'), icon: <Repeat size={22} /> },
  ];

  const summaryRows = [
    { label: t('Objetivo'), value: goalOptions.find((o) => o.id === goal)?.label || '—' },
    { label: t('Tipo de work'), value: workTypeOptions.find((o) => o.id === workType)?.label || '—' },
    { label: t('Meta semanal'), value: hoursOptions.find((o) => o.id === focusHours)?.label || '—' },
    { label: t('Sessões'), value: sessionOptions.find((o) => o.id === sessionStyle)?.label || '—' },
    { label: t('Melhor horário'), value: timeOptions.find((o) => o.id === productiveTime)?.label || '—' },
    { label: t('Maior desafio'), value: obstacleOptions.find((o) => o.id === obstacle)?.label || '—' },
    { label: t('Lembrete'), value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` },
  ];

  /* ------- render de cada etapa ------- */
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-5">
            <div
              className="w-16 h-16 rounded-[24px] flex items-center justify-center border border-white/10"
              style={{ background: hexToRgba(accent, 0.18), color: accent, boxShadow: `0 0 40px ${hexToRgba(accent, 0.4)}` }}
            >
              <Sparkles size={28} />
            </div>
            <h1 className="font-display text-[32px] font-bold text-white leading-[1.08] tracking-tight">
              {t('Vamos montar a sua')} <span style={{ color: accent }}>{t('Nakor')}</span>
            </h1>
            <p className="text-[14px] text-white/55 font-medium leading-relaxed max-w-[330px]">
              {t('Poucas perguntas rápidas sobre o seu work para deixar o app do seu jeito. Dá menos de 1 minuto.')}
            </p>
            <div className="w-full mt-2">
              <PrimaryButton onClick={advance} accent={accent}>
                {t('Começar')}
              </PrimaryButton>
            </div>
          </div>
        );

      case 1:
        return (
          <StepShell icon={<Target size={20} />} eyebrow={t('Seu objetivo')} title={t('O que você quer')} highlight={t('conquistar?')} accent={accent}>
            <OptionGrid options={goalOptions} selected={goal} accent={accent} onSelect={(id) => { setGoal(id); autoAdvance(); }} />
          </StepShell>
        );

      case 2:
        return (
          <StepShell icon={<Briefcase size={20} />} eyebrow={t('Tipo de work')} title={t('Qual é o seu')} highlight={t('work principal?')} accent={accent}>
            <OptionGrid options={workTypeOptions} selected={workType} accent={accent} onSelect={(id) => { setWorkType(id); autoAdvance(); }} />
          </StepShell>
        );

      case 3:
        return (
          <StepShell
            icon={<Timer size={20} />}
            eyebrow={t('Meta semanal')}
            title={t('Quantas horas por semana de')}
            highlight={t('work?')}
            subtitle={t('Você pode ajustar isso depois')}
            accent={accent}
          >
            <OptionGrid options={hoursOptions} selected={focusHours} accent={accent} onSelect={(id) => { setFocusHours(id); autoAdvance(); }} />
          </StepShell>
        );

      case 4:
        return (
          <StepShell icon={<Hourglass size={20} />} eyebrow={t('Ritmo')} title={t('Como você prefere')} highlight={t('focar?')} accent={accent}>
            <OptionGrid options={sessionOptions} selected={sessionStyle} accent={accent} onSelect={(id) => { setSessionStyle(id); autoAdvance(); }} />
          </StepShell>
        );

      case 5:
        return (
          <StepShell icon={<Sun size={20} />} eyebrow={t('Melhor horário')} title={t('Quando você')} highlight={t('produz mais?')} accent={accent}>
            <OptionGrid options={timeOptions} selected={productiveTime} accent={accent} onSelect={(id) => { setProductiveTime(id); autoAdvance(); }} />
          </StepShell>
        );

      case 6:
        return (
          <StepShell icon={<Brain size={20} />} eyebrow={t('Desafio')} title={t('O que mais te')} highlight={t('atrapalha hoje?')} accent={accent}>
            <OptionGrid options={obstacleOptions} selected={obstacle} accent={accent} onSelect={(id) => { setObstacle(id); autoAdvance(); }} />
          </StepShell>
        );

      case 7:
        return (
          <StepShell
            icon={<Clock size={20} />}
            eyebrow={t('Lembrete diário')}
            title={t('Que horas quer')}
            highlight={t('lembrar do work?')}
            subtitle={t('O Nakor vai te chamar pro foco todo dia nesse horário')}
            accent={accent}
            footer={<PrimaryButton onClick={advance} accent={accent}>{t('Continuar')}</PrimaryButton>}
          >
            <div className="rounded-[26px] border border-white/10 bg-white/5 h-40 flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-x-5 top-[34%] bottom-[34%] rounded-xl border-y pointer-events-none"
                style={{ borderColor: hexToRgba(accent, 0.4), background: hexToRgba(accent, 0.12) }}
              />
              {[
                { value: hour, mod: 24, set: setHour, stepBy: 1 },
                { value: minute, mod: 60, set: setMinute, stepBy: 5 },
              ].map((col, i) => (
                <React.Fragment key={i}>
                  {i === 1 && (
                    <span className="font-display text-4xl font-extrabold mx-3 relative z-10" style={{ color: accent }}>
                      :
                    </span>
                  )}
                  <div
                    className="flex flex-col items-center w-24 relative z-10 cursor-ns-resize select-none"
                    onWheel={(e) => {
                      e.preventDefault();
                      adjust(col.set as any, e.deltaY > 0 ? col.stepBy : -col.stepBy, col.mod);
                    }}
                  >
                    <button onClick={() => adjust(col.set as any, -col.stepBy, col.mod)} className="text-white/40 hover:text-white p-0.5">
                      <ChevronUp size={15} />
                    </button>
                    <div className="flex flex-col items-center -space-y-1 my-0.5">
                      <span className="text-xs font-bold text-white/30">
                        {String((col.value - col.stepBy + col.mod) % col.mod).padStart(2, '0')}
                      </span>
                      <span className="font-display text-4xl font-extrabold text-white leading-tight tabular-nums">
                        {String(col.value).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-white/30">
                        {String((col.value + col.stepBy) % col.mod).padStart(2, '0')}
                      </span>
                    </div>
                    <button onClick={() => adjust(col.set as any, col.stepBy, col.mod)} className="text-white/40 hover:text-white p-0.5">
                      <ChevronDown size={15} />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-white/40 text-center font-medium">{t('você pode mudar isso quando quiser')}</p>
          </StepShell>
        );

      case 8:
        return (
          <StepShell
            icon={<Sparkles size={20} />}
            eyebrow={t('Seu card')}
            title={t('Escolha o modelo do seu')}
            highlight={t('card de work')}
            subtitle={t('Escolha o modelo e a cor — pode mudar depois nas configurações')}
            accent={accent}
            footer={<PrimaryButton onClick={advance} accent={accent}>{t('Continuar')}</PrimaryButton>}
          >
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 flex items-center justify-center">
              <ResultCardPreview modelId={cardLayout} color={cardColor} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CARD_MODELS.map((m) => {
                const active = cardLayout === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setCardLayout(m.id)}
                    className="relative text-left rounded-[20px] p-3 border transition-colors cursor-pointer"
                    style={{
                      background: active ? hexToRgba(accent, 0.14) : 'rgba(255,255,255,0.05)',
                      borderColor: active ? hexToRgba(accent, 0.7) : 'rgba(255,255,255,0.09)',
                    }}
                  >
                    {active && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: accent }}>
                        <Check size={12} strokeWidth={3.5} color={accent === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />
                      </div>
                    )}
                    <p className={`text-[13px] font-semibold pr-6 ${active ? 'text-white' : 'text-white/75'}`}>{m.name}</p>
                    <p className="text-[11px] text-white/40 mt-0.5 leading-snug">{t(m.description)}</p>
                  </button>
                );
              })}
            </div>
          </StepShell>
        );

      case 9:
        return (
          <StepShell
            icon={<Palette size={20} />}
            eyebrow={t('Cor de destaque')}
            title={t('Qual cor combina com o')}
            highlight={t('seu work?')}
            accent={accent}
            footer={<PrimaryButton onClick={advance} accent={accent}>{t('Continuar')}</PrimaryButton>}
          >
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 flex items-center justify-center">
              <ResultCardPreview modelId={cardLayout} color={cardColor} />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {CARD_COLORS.map((c) => {
                const active = cardColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() => setCardColor(c.hex)}
                    aria-label={t(c.name)}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer"
                    style={{
                      backgroundColor: c.hex,
                      transform: active ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: active ? `0 0 0 3px rgba(255,255,255,0.85), 0 0 26px ${hexToRgba(c.hex, 0.8)}` : 'none',
                    }}
                  >
                    {active && <Check size={15} strokeWidth={3.5} color={c.hex === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />}
                  </button>
                );
              })}
            </div>
          </StepShell>
        );

      case 10:
        return (
          <StepShell
            icon={<Moon size={20} />}
            eyebrow={t('Aparência')}
            title={t('Prefere o Nakor')}
            highlight={t('claro ou escuro?')}
            subtitle={t('você pode mudar isso quando quiser')}
            accent={accent}
            footer={<PrimaryButton onClick={advance} accent={accent}>{t('Continuar')}</PrimaryButton>}
          >
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'light' as const, label: t('Claro'), desc: t('Limpo e luminoso'), icon: <Sun size={22} />, bg: '#FFFFFF', fg: '#16131F' },
                { id: 'dark' as const, label: t('Escuro'), desc: t('Foco total, sem brilho'), icon: <Moon size={22} />, bg: '#12111A', fg: '#FFFFFF' },
              ]).map((opt) => {
                const active = appTheme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAppTheme(opt.id)}
                    className="relative rounded-[22px] p-4 border text-left cursor-pointer transition-colors"
                    style={{
                      background: active ? hexToRgba(accent, 0.14) : 'rgba(255,255,255,0.05)',
                      borderColor: active ? hexToRgba(accent, 0.7) : 'rgba(255,255,255,0.09)',
                    }}
                  >
                    <div
                      className="h-16 rounded-[14px] mb-3 flex items-center justify-center border border-white/10"
                      style={{ background: opt.bg, color: opt.fg }}
                    >
                      {opt.icon}
                    </div>
                    <p className={`text-[14px] font-semibold ${active ? 'text-white' : 'text-white/80'}`}>{opt.label}</p>
                    <p className="text-[11px] text-white/45 mt-0.5">{opt.desc}</p>
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: accent }}>
                        <Check size={12} strokeWidth={3.5} color={accent === '#FFFFFF' ? '#0B0B12' : '#FFFFFF'} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </StepShell>
        );

      case 11:
      default:
        return (
          <StepShell
            icon={<Check size={20} />}
            eyebrow={t('Resumo')}
            title={t('Tudo certo com a')}
            highlight={t('sua Nakor?')}
            subtitle={t('Revise e confirme — dá para mudar tudo depois')}
            accent={accent}
            footer={<PrimaryButton onClick={startPreparing} accent={accent}>{t('Criar minha Nakor')}</PrimaryButton>}
          >
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] divide-y divide-white/[0.07]">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-white/40">{row.label}</span>
                  <span className="text-[13px] font-semibold text-white text-right min-w-0 truncate">{row.value}</span>
                </div>
              ))}
            </div>
          </StepShell>
        );
    }
  };

  if (preparing) {
    return <LoadingPreparation accent={accent} onDone={finish} />;
  }

  return (
    <div className="relative h-[100dvh] w-full bg-[#08070E] overflow-hidden font-sans flex flex-col">
      {/* glows de fundo */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[120%] h-[55%] rounded-full blur-[130px] opacity-60 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${hexToRgba(accent, 0.45)}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[45%] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${hexToRgba(accent, 0.35)}, transparent 70%)` }}
      />

      {/* Header */}
      <div className="relative z-20 shrink-0 pt-[max(1rem,env(safe-area-inset-top))] px-5">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label={t('Voltar')}
          >
            <ArrowLeft size={17} />
          </button>

          <div className="flex-1 min-w-0 flex gap-1.5">
            {Array.from({ length: SEGMENTS }).map((_, i) => {
              const done = step >= i + 1;
              return (
                <div key={i} className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ background: accent, boxShadow: `0 0 12px ${hexToRgba(accent, 0.9)}` }}
                  />
                </div>
              );
            })}
          </div>

          <LanguageSwitcher variant="dark" />
        </div>
        <div className="max-w-md mx-auto mt-2 text-[11px] font-semibold text-white/35 pl-12">
          {step === 0 ? t('Configuração inicial') : t('{n} de {total}', { n: Math.min(step, SEGMENTS), total: SEGMENTS })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-5 py-6 flex items-start sm:items-center">
        <div className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -30 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
