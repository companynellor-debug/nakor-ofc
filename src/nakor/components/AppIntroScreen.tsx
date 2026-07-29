import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import intro1 from '../../assets/intro-1.png.asset.json';
import intro2 from '../../assets/intro-2.png.asset.json';
import intro3 from '../../assets/intro-3.png.asset.json';


interface AppIntroScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const slides = [
  {
    title: "Desbloqueie seu Foco",
    description: "Concentre-se no que realmente importa e atinja seus objetivos diários com eficiência.",
    image: intro1.url
  },
  {
    title: "Planejamento Rápido",
    description: "Crie atividades e estabeleça metas claras para manter o ritmo ao longo do dia.",
    image: intro2.url
  },
  {
    title: "Acompanhe seu Progresso",
    description: "Receba feedbacks por IA e visualize seu desempenho para manter a consistência.",
    image: intro3.url
  }
];


export function AppIntroScreen({ onStart, onLogin }: AppIntroScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0D0F14] font-sans overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 relative flex items-center justify-center pt-6 pb-8 px-4 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#34117E]/40 blur-[120px] mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ACD1FD]/20 blur-[100px] mix-blend-overlay" />

          <div className="relative z-10 w-full max-w-[360px] h-full max-h-[640px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </AnimatePresence>
          </div>

        </div>


        {/* Bottom Part: Dark Card with Info */}
        <div className="bg-[#000000] rounded-t-[32px] sm:rounded-t-[40px] px-6 py-8 pb-12 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 w-full max-w-sm"
            >
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans px-4">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex gap-2 mb-8">
            {slides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-[#34117E]' : 'w-1.5 bg-neutral-800'
                }`}
              />
            ))}
          </div>

          {/* Primary CTA */}
          <button 
            onClick={onStart}
            className="w-full max-w-xs bg-[#34117E] hover:bg-[#260b61] active:scale-[0.98] text-white font-bold py-4 px-8 rounded-full text-[15px] transition-all shadow-[0_4px_20px_rgba(52,17,126,0.3)] mb-4"
          >
            Criar conta
          </button>
          
          {/* Secondary Link */}
          <button 
            onClick={onLogin}
            className="text-xs text-neutral-500 hover:text-neutral-300 font-bold transition-colors"
          >
            Já tem uma conta? <span className="text-white">Fazer login</span>
          </button>

          {/* Footer links */}
          <div className="flex gap-4 mt-8 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-neutral-400 transition-colors">Termos de Uso</span>
            <span className="cursor-pointer hover:text-neutral-400 transition-colors">Privacidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
