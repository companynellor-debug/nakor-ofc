import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import intro1 from '../../assets/intro-1.png';
import intro2 from '../../assets/intro-2.png';
import intro3 from '../../assets/intro-3.png';


interface AppIntroScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const slides = [
  {
    title: "Desbloqueie seu Foco",
    description: "Concentre-se no que realmente importa e atinja seus objetivos diários com eficiência.",
    image: intro1
  },
  {
    title: "Planejamento Rápido",
    description: "Crie atividades e estabeleça metas claras para manter o ritmo ao longo do dia.",
    image: intro2
  },
  {
    title: "Acompanhe seu Progresso",
    description: "Receba feedbacks por IA e visualize seu desempenho para manter a consistência.",
    image: intro3
  }
];


const REPEATS = 20;
const loopSlides = Array.from({ length: REPEATS }, () => slides).flat();

export function AppIntroScreen({ onStart, onLogin }: AppIntroScreenProps) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const currentSlide = index % slides.length;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        return next;
      });
      setAnimate(true);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Silent reset when nearing the end of the duplicated track (invisible jump)
  useEffect(() => {
    if (index >= slides.length * (REPEATS - 2)) {
      const id = requestAnimationFrame(() => {
        setAnimate(false);
        setIndex(index % slides.length);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [index]);

  const slideWidth = containerWidth * 0.55;
  const offset = containerWidth / 2 - (index * slideWidth + slideWidth / 2);



  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full flex flex-col bg-[#0D0F14] font-sans overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        <div className="flex-1 min-h-0 relative flex items-center justify-center pt-4 pb-4 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#34117E]/40 blur-[120px] mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ACD1FD]/20 blur-[100px] mix-blend-overlay" />
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[95%] h-[75%] rounded-full bg-[#4C1D95]/70 blur-[90px] pointer-events-none" />
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[80%] h-[55%] rounded-full bg-[#7C3AED]/40 blur-[60px] pointer-events-none" />

          {/* Horizontal carousel: current mockup centered, neighbours peeking */}
          <div ref={trackRef} className="relative z-10 w-full h-full flex items-center overflow-hidden">
            <motion.div
              className="flex items-center h-full"
              animate={{ x: offset }}
              transition={animate ? { type: 'spring', stiffness: 120, damping: 20 } : { duration: 0 }}
            >
              {loopSlides.map((slide, idx) => {
                const active = idx === index;
                return (
                  <motion.div
                    key={`${slide.title}-${idx}`}
                    className="shrink-0 h-full flex items-center justify-center px-2"
                    style={{ width: slideWidth || undefined }}
                    animate={{
                      scale: active ? 1 : 0.86,
                      opacity: active ? 1 : 0.45,
                      filter: active ? 'blur(0px)' : 'blur(1.5px)',
                    }}
                    transition={{ duration: 0.4 }}
                  >

                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-auto max-w-none mx-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>



        {/* Bottom Part: Glass Card with Info */}
        <div className="shrink-0 bg-white backdrop-blur-2xl rounded-t-[32px] sm:rounded-t-[40px] px-6 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-white/30 flex flex-col items-center text-center">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4 w-full max-w-sm"
            >
              <h2 className="text-xl sm:text-3xl font-display font-bold text-black mb-1.5">
                {slides[currentSlide].title}
              </h2>
              <p className="text-[13px] sm:text-sm text-neutral-700 leading-snug font-sans px-2">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex gap-2 mb-4">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-[#34117E]' : 'w-1.5 bg-neutral-300'
                }`}
              />
            ))}
          </div>

          {/* Primary CTA */}
          <button 
            onClick={onStart}
            className="w-full max-w-xs bg-gradient-to-br from-[#5B34C7] to-[#34117E] hover:from-[#4C2AB0] hover:to-[#2A0E68] shadow-[0_10px_26px_-10px_rgba(52,17,126,0.7)] active:scale-[0.98] text-white font-bold py-3.5 px-8 rounded-full text-[15px] transition-all mb-3"
          >
            Criar conta
          </button>
          
          {/* Secondary Link */}
          <button 
            onClick={onLogin}
            className="text-xs text-neutral-600 hover:text-neutral-900 font-bold transition-colors"
          >
            Já tem uma conta? <span className="text-[#34117E]">Fazer login</span>
          </button>

          {/* Footer links */}
          <div className="flex gap-4 mt-4 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-neutral-800 transition-colors">Termos de Uso</span>
            <span className="cursor-pointer hover:text-neutral-800 transition-colors">Privacidade</span>
          </div>

        </div>
      </div>
    </div>
  );
}
