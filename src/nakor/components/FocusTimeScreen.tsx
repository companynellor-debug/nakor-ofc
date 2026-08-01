import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface FocusTimeScreenProps {
  onBack: () => void;
}

export function FocusTimeScreen({ onBack }: FocusTimeScreenProps) {
  const [horarioProdutivo, setHorarioProdutivo] = useState('🌅 Manhã — antes do meio dia');
  const [metaSemanal, setMetaSemanal] = useState('10h');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nakor_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.horario_produtivo) setHorarioProdutivo(parsed.horario_produtivo);
        if (parsed.meta_semanal) setMetaSemanal(parsed.meta_semanal);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = () => {
    try {
      const current = JSON.parse(localStorage.getItem('nakor_onboarding') || '{}');
      const updated = {
        ...current,
        horario_produtivo: horarioProdutivo,
        meta_semanal: metaSemanal
      };
      localStorage.setItem('nakor_onboarding', JSON.stringify(updated));
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const periodOptions = [
    '🌅 Manhã — antes do meio dia',
    '☀️ Tarde — entre 12h e 18h',
    '🌙 Noite — após as 18h',
    '🔀 Varia muito'
  ];

  const goalOptions = ['5h', '10h', '15h', '20h+'];

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] flex flex-col font-sans relative overflow-x-hidden select-none">
      <div className="w-full max-w-[390px] mx-auto flex flex-col h-full min-h-screen pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F5F5F7] dark:bg-[#0D0F14]/90 backdrop-blur-md z-20">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center cursor-pointer active:scale-95 transition-all text-[#21222D] dark:text-[#F8F9FA]"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-lg font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight absolute left-1/2 -translate-x-1/2">
            Hora do Foco
          </h1>
          
          <div className="w-10 h-10" />
        </div>

        {/* Content */}
        <div className="px-5 mt-2 flex flex-col gap-6">
          
          {/* Horário Produtivo */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Quando você é mais produtivo</span>
            <div className="bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered rounded-[28px] p-6 flex flex-col">
              {periodOptions.map((opt, idx) => {
                const isSelected = horarioProdutivo === opt;
                return (
                  <React.Fragment key={opt}>
                    <button 
                      onClick={() => setHorarioProdutivo(opt)}
                      className="w-full py-4 px-2 flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-bold">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#34117E]' : 'border-[#DBDBE5] dark:border-[#2A2B3D]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#34117E] rounded-full" />}
                      </div>
                    </button>
                    {idx < periodOptions.length - 1 && (
                      <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Meta Semanal */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Meta semanal de horas</span>
            <div className="bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered rounded-[28px] p-6">
              <div className="grid grid-cols-2 gap-3.5">
                {goalOptions.map(opt => {
                  const isSelected = metaSemanal === opt;
                  return (
                    <button 
                      key={opt}
                      onClick={() => setMetaSemanal(opt)}
                      className={`h-14 rounded-[16px] flex items-center justify-center text-[15px] font-bold transition-all cursor-pointer ${isSelected ? 'bg-[#34117E] text-white shadow-sm-layered' : 'bg-[#F5F5F7] dark:bg-[#0D0F14] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 text-[#21222D] dark:text-[#F8F9FA] hover:bg-neutral-100'}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full h-[56px] rounded-full bg-gradient-to-br from-[#5B34C7] to-[#34117E] hover:from-[#4C2AB0] hover:to-[#2A0E68] shadow-[0_10px_26px_-10px_rgba(52,17,126,0.7)] active:scale-[0.985] text-white font-bold text-[16px] flex items-center justify-center mt-2 transition-all active:scale-[0.98] shadow-md-layered cursor-pointer"
          >
            Salvar
          </button>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#21222D] border border-white/10 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none whitespace-nowrap"
          >
            ✅ Preferências salvas!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
