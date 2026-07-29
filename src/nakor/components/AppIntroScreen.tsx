import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Flame, CheckSquare, ShoppingBag, User, Plus, Info, Lock, Pencil, Trophy, ShieldCheck, Home, ArrowUp, ArrowDown, Trash2, Upload } from 'lucide-react';

interface AppIntroScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const slides = [
  {
    title: "Desbloqueie seu Foco",
    description: "Concentre-se no que realmente importa e atinja seus objetivos diários com eficiência.",
    icon: <Play size={24} className="text-[#34117E] fill-[#34117E]" />
  },
  {
    title: "Planejamento Rápido",
    description: "Crie atividades e estabeleça metas claras para manter o ritmo ao longo do dia.",
    icon: <ShieldCheck size={24} className="text-[#34117E]" />
  },
  {
    title: "Acompanhe seu Progresso",
    description: "Receba feedbacks por IA e visualize seu desempenho para manter a consistência.",
    icon: <Trophy size={24} className="text-[#34117E]" />
  }
];

export function AppIntroScreen({ onStart, onLogin }: AppIntroScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [uploadedImages, setUploadedImages] = useState<{name: string, url: string}[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Files selected:", files);
    if (!files) return;
    
    const newImages = Array.from(files).map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setUploadedImages(prev => [...prev, ...newImages]);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        await fetch('/api/upload-mockup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64 })
        });
        console.log('Uploaded ' + file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...uploadedImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    // Swap
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setUploadedImages(newImages);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0D0F14] font-sans overflow-hidden md:flex-row">
      
        {/* TEMPORARY UPLOAD PANEL */}
        <div className="w-full md:w-80 bg-[#161824] p-5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4 z-50 shrink-0 overflow-y-auto max-h-[40vh] md:max-h-screen">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Upload size={14} className="text-[#34117E]" /> Gerenciador de Mockups
            </h3>
            <p className="text-[11px] text-neutral-400">Ordene e defina as imagens dos slides.</p>
          </div>

          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 hover:border-[#34117E] rounded-xl cursor-pointer transition-colors bg-white/5 hover:bg-white/10 text-center gap-1">
            <Upload size={18} className="text-neutral-400" />
            <span className="text-xs font-semibold text-white">Anexar Imagens</span>
            <span className="text-[9px] text-neutral-500">Selecione uma ou mais fotos</span>
            <input type="file" multiple onChange={handleUpload} className="hidden" accept="image/*" />
          </label>

          {uploadedImages.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Fila de Mockups ({uploadedImages.length})</div>
              <div className="flex flex-col gap-2 max-h-48 md:max-h-none overflow-y-auto pr-1">
                {uploadedImages.map((img, idx) => {
                  let slideLabel = "Slide Reserva";
                  if (idx === 0) slideLabel = "1º Slide (Início)";
                  if (idx === 1) slideLabel = "2º Slide (Foco)";
                  if (idx === 2) slideLabel = "3º Slide (Progresso)";

                  return (
                    <div key={idx} className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={img.url} alt={img.name} className="w-10 h-14 object-cover rounded border border-white/10 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-white truncate">{img.name}</p>
                          <span className="text-[9px] font-bold text-[#34117E] uppercase">{slideLabel}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => moveImage(idx, 'up')} 
                          disabled={idx === 0}
                          className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                          title="Mover para Cima"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          onClick={() => moveImage(idx, 'down')} 
                          disabled={idx === uploadedImages.length - 1}
                          className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                          title="Mover para Baixo"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button 
                          onClick={() => removeImage(idx)} 
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-neutral-500 italic text-center py-4">Nenhum mockup anexado ainda.</p>
          )}
        </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Part: Purple Background with Mockup */}
        <div className="flex-1 relative flex items-center justify-center pt-12 pb-10 px-4 overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#34117E]/40 blur-[120px] mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ACD1FD]/20 blur-[100px] mix-blend-overlay" />
          
          {/* Mockup Display - conditional styling without dash/background when loaded */}
          <div className={`w-[260px] h-[540px] rounded-[36px] relative z-10 shrink-0 overflow-hidden flex items-center justify-center transition-all duration-300 ${
            uploadedImages.length > 0 
              ? 'bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-neutral-800/80' 
              : 'bg-neutral-900/50 border-2 border-dashed border-neutral-800'
          }`}>
            {uploadedImages.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={uploadedImages[currentSlide] ? uploadedImages[currentSlide].url : (uploadedImages[uploadedImages.length - 1]?.url || '')}
                  alt={`Mockup Slide ${currentSlide + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Espaço reservado para mockup</p>
            )}
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
