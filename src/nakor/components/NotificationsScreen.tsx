import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [inactivityAlert, setInactivityAlert] = useState(false);
  const [achievements, setAchievements] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Load saved settings
  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem('nakor_notificacoes');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (parsed.dailyReminder !== undefined) setDailyReminder(parsed.dailyReminder);
        if (parsed.inactivityAlert !== undefined) setInactivityAlert(parsed.inactivityAlert);
        if (parsed.achievements !== undefined) setAchievements(parsed.achievements);
      }
      
      const savedOnboardingStr = localStorage.getItem('nakor_onboarding');
      if (savedOnboardingStr) {
        const parsed = JSON.parse(savedOnboardingStr);
        if (parsed.horario_notificacao) {
          setReminderTime(parsed.horario_notificacao);
        }
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
  }, []);

  // Save changes
  const saveNotifs = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem('nakor_notificacoes') || '{}');
      localStorage.setItem('nakor_notificacoes', JSON.stringify({ ...current, ...updates }));
      triggerToast();
    } catch (e) {
      console.error(e);
    }
  };

  const saveTime = (time: string) => {
    try {
      const current = JSON.parse(localStorage.getItem('nakor_onboarding') || '{}');
      localStorage.setItem('nakor_onboarding', JSON.stringify({ ...current, horario_notificacao: time }));
      triggerToast();
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleToggleDaily = () => {
    const next = !dailyReminder;
    setDailyReminder(next);
    saveNotifs({ dailyReminder: next });
  };

  const handleToggleInactivity = () => {
    const next = !inactivityAlert;
    setInactivityAlert(next);
    saveNotifs({ inactivityAlert: next });
  };

  const handleToggleAchievements = () => {
    const next = !achievements;
    setAchievements(next);
    saveNotifs({ achievements: next });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReminderTime(val);
    saveTime(val);
  };

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
            Notificações
          </h1>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="px-5 mt-4">
          <div className="bg-white dark:bg-[#151622] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered rounded-[28px] p-6 flex flex-col">
            
            {/* Item 1: Lembrete diário */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px]">Lembrete diário</span>
                <span className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-snug font-medium">Te chama pro foco todo dia</span>
              </div>
              <button 
                onClick={handleToggleDaily}
                className={`w-[46px] h-[26px] rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 relative cursor-pointer ${dailyReminder ? 'bg-[#34117E]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
              >
                <motion.div 
                  className="w-[18px] h-[18px] bg-white dark:bg-[#151622] rounded-full shadow-sm"
                  animate={{ x: dailyReminder ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
 
            {/* Item 2: Horário do lembrete */}
            {dailyReminder && (
              <>
                <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 my-2" />
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px]">Horário do lembrete</span>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={reminderTime}
                      onChange={handleTimeChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="text-[#34117E] font-bold text-[15px]">{reminderTime}</span>
                  </div>
                </div>
              </>
            )}
 
            <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 my-2" />
 
            {/* Item 3: Alerta de inatividade */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px]">Alerta de inatividade</span>
                <span className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-snug font-medium">Avisa se você não focou até o horário produtivo</span>
              </div>
              <button 
                onClick={handleToggleInactivity}
                className={`w-[46px] h-[26px] rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 relative cursor-pointer ${inactivityAlert ? 'bg-[#34117E]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
              >
                <motion.div 
                  className="w-[18px] h-[18px] bg-white dark:bg-[#151622] rounded-full shadow-sm"
                  animate={{ x: inactivityAlert ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
 
            <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 my-2" />
 
            {/* Item 4: Conquistas desbloqueadas */}
            <div className="flex items-center justify-between py-3">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-[15px]">Conquistas desbloqueadas</span>
                <span className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-snug font-medium">Notifica quando ganhar um novo selo</span>
              </div>
              <button 
                onClick={handleToggleAchievements}
                className={`w-[46px] h-[26px] rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 relative cursor-pointer ${achievements ? 'bg-[#34117E]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
              >
                <motion.div 
                  className="w-[18px] h-[18px] bg-white dark:bg-[#151622] rounded-full shadow-sm"
                  animate={{ x: achievements ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#21222D] border border-white/10 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none"
        >
          Salvo
        </motion.div>
      )}
    </div>
  );
}
