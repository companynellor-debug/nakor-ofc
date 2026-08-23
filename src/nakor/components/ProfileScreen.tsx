import { DesktopSidebar } from './DesktopSidebar';
import { useT } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  Palette, 
  User, 
  HelpCircle, 
  ChevronRight, 
  Flame,
  AlertCircle,
  Trophy,
  Camera, Moon, Sun,
  History, AlarmClock, LifeBuoy
} from 'lucide-react';

interface ProfileScreenProps {
  onboardingData?: any;
  onNavigate?: (view: any) => void;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function ProfileScreen({ onboardingData, onNavigate, onLogout, theme, onToggleTheme }: ProfileScreenProps) {
  const t = useT();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('nakor_avatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 150;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const base64String = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarUrl(base64String);
          try {
            localStorage.setItem('nakor_avatar', base64String);
            window.dispatchEvent(new Event('avatarChanged'));
            setToastMessage(t("Avatar atualizado com sucesso!"));
            setTimeout(() => setToastMessage(null), 2000);
          } catch (error) {
            setToastMessage(t("Erro: Imagem muito grande."));
            setTimeout(() => setToastMessage(null), 2000);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Retrieve user data
  const userName = useMemo(() => {
    return localStorage.getItem('nakor_user') || onboardingData?.name || 'Alex Andrade';
  }, [onboardingData]);

  const userEmail = useMemo(() => {
    return localStorage.getItem('nakor_user_email') || 'alex@email.com';
  }, []);

  // Initials computation
  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [userName]);

  // Progresso real (fonte de verdade: repositório de atividades)
  const { activities } = useActivities();

  const weekly = useMemo(() => getProgressSummary(activities, 'week'), [activities]);

  const streak = weekly.currentStreak;

  const totalHours = useMemo(() => {
    const totalSecs = activities.reduce((acc, a) => acc + (a.actualDuration || 0), 0);
    return Math.floor(totalSecs / 3600);
  }, [activities]);

  const averageScore = useMemo(() => {
    const scored = activities.filter((a) => typeof a.focusScore === 'number' && a.focusScore !== null);
    if (scored.length === 0) return '0.0';
    const sum = scored.reduce((acc, a) => acc + (a.focusScore || 0), 0);
    return (sum / scored.length).toFixed(1);
  }, [activities]);

  // Meta semanal Y (do onboarding)
  const goalHours = useMemo(() => {
    let saved: any = onboardingData;
    if (!saved) {
      try {
        saved = JSON.parse(localStorage.getItem('nakor_onboarding') || '{}');
      } catch {
        saved = {};
      }
    }
    const hoursStr = String(saved?.focusHours ?? '15h');
    return parseInt(hoursStr.replace(/\D/g, ''), 10) || 15;
  }, [onboardingData]);

  const weeklyHours = useMemo(
    () => parseFloat((weekly.totalFocusTime / 3600).toFixed(1)),
    [weekly],
  );

  const remainingHours = useMemo(() => {
    return Math.max(0, Math.ceil(goalHours - weeklyHours));
  }, [goalHours, weeklyHours]);

  const weeklyProgressPercent = useMemo(() => {
    return Math.min(100, Math.round((weeklyHours / goalHours) * 100));
  }, [weeklyHours, goalHours]);


  // Show "Em breve" toast
  const handleItemClick = (name: string) => {
    setToastMessage(t('Em breve: {name}', { name }));
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleSair = () => {
    // Mantém a conta e os dados salvos: apenas encerra a sessão local
    localStorage.removeItem('nakor_user_email');

    // Call props or reset view
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex flex-col md:flex-row relative">
      <DesktopSidebar currentView="profile" onNavigate={onNavigate} userName={userName} userEmail={userEmail} />
      
      <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 relative overflow-y-auto">
        <div className="w-full max-w-[390px] md:max-w-[1000px] md:p-10 px-6 pt-10 md:pt-12 flex flex-col items-center">

        {/* Header */}
        <div className="w-full flex items-start justify-between gap-3 text-center md:text-left mb-6">
          <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight">{t('Perfil')}</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">{t('Gerencie seu progresso e conta')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start pb-10">
          
          {/* Column 1: User Profile & Stats */}
          <div className="w-full flex flex-col space-y-6">
            
            {/* User Info Card */}
            <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-6 border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 shadow-sm flex items-center gap-5">
              <div className="relative group w-16 h-16 rounded-full shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover shadow-[0_0_15px_rgba(79,70,229,0.2)]" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center text-white text-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#21222D] dark:text-[#F8F9FA] truncate">{userName}</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs truncate mb-2">{userEmail}</p>
                <div className="self-start inline-flex items-center gap-1 bg-[#F3F4F6] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                  <Flame size={12} className="text-[#4F46E5] fill-[#4F46E5]/20" />
                  <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider">{t('{n} dias seguidos', { n: streak })}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-white dark:bg-[#151622] rounded-[20px] p-4 text-center border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 shadow-sm flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA]">{totalHours}h</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t('Total')}</span>
              </div>
              <div className="bg-white dark:bg-[#151622] rounded-[20px] p-4 text-center border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 shadow-sm flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-[#4F46E5]">{averageScore}</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t('Média')}</span>
              </div>
              <div className="bg-white dark:bg-[#151622] rounded-[20px] p-4 text-center border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 shadow-sm flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-[#21222D] dark:text-[#F8F9FA]">{streak}</span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{t('Dias')}</span>
              </div>
            </div>

            {/* Meta Semanal Card */}
            <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] p-6 border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-sm text-[#21222D] dark:text-[#F8F9FA]">{t('Meta semanal')}</h3>
                <span className="text-[#4F46E5] font-mono text-[11px] font-bold bg-[#4F46E5]/10 px-2.5 py-1 rounded-md">{weeklyHours}h / {goalHours}h</span>
              </div>
 
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full mb-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-full transition-all duration-500" 
                  style={{ width: `${weeklyProgressPercent}%` }}
                />
              </div>
 
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block">
                {remainingHours > 0 
                  ? t('Faltam {n}h para fechar a semana', { n: remainingHours }) 
                  : t('Parabéns! Meta semanal atingida 🎉')}
              </span>
            </div>

          </div>
 
          {/* Column 2: Settings */}
          <div className="w-full space-y-6">
            
            <div className="w-full bg-white dark:bg-[#151622] rounded-[24px] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/50 overflow-hidden divide-y divide-[#F3F4F6] dark:divide-white/[0.06] shadow-[0_10px_30px_-18px_rgba(23,16,54,0.25)]">
              {[
                { key: 'history', label: t('Histórico'), Icon: History, onClick: () => onNavigate && onNavigate('history') },
                { key: 'conquistas', label: t('Conquistas'), Icon: Trophy, onClick: () => onNavigate && onNavigate('conquistas') },
                { key: 'notifications', label: t('Notificações'), Icon: Bell, onClick: () => onNavigate && onNavigate('notifications') },
                { key: 'focus_time', label: t('Hora do Foco'), Icon: AlarmClock, onClick: () => onNavigate && onNavigate('focus_time') },
                { key: 'card_colors', label: t('Cores dos cards'), Icon: Palette, onClick: () => onNavigate && onNavigate('card_colors') },
                ...(onToggleTheme
                  ? [{
                      key: 'theme',
                      label: `${t('Tema:')} ${theme === 'light' ? t('Claro') : t('Escuro')}`,
                      Icon: theme === 'light' ? Moon : Sun,
                      onClick: onToggleTheme
                    }]
                  : []),
                { key: 'help', label: t('Ajuda'), Icon: LifeBuoy, onClick: () => handleItemClick(t('Ajuda')) }
              ].map(({ key, label, Icon, onClick }) => (
                <button
                  key={key}
                  onClick={onClick}
                  className="group w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAFB] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#F4F2FF] dark:bg-[#C4B5FD]/[0.12] border border-[#34117E]/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-all duration-200 group-hover:bg-[#EAE6FF] dark:group-hover:bg-[#C4B5FD]/[0.18]">
                      <Icon size={16} strokeWidth={2} className="text-[#4F46E5] dark:text-[#C4B5FD]" />
                    </div>
                    <span className="text-[13px] font-semibold text-[#21222D] dark:text-[#F8F9FA]">{label}</span>
                  </div>
                  <ChevronRight size={16} className="text-[#C9CBD6] dark:text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <div className="w-full">
              <button 
                onClick={handleSair}
                className="w-full p-4 rounded-[24px] bg-white dark:bg-[#151622] border border-[#DBDBE5]/30 dark:border-[#2A2B3D]/30 text-neutral-500 dark:text-neutral-400 hover:text-red-500 text-[13px] font-bold transition-colors cursor-pointer shadow-sm text-center"
              >
                {t('Sair da conta')}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#21222D] border border-white/10 text-white text-xs font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertCircle size={14} className="text-[#8B5CF6]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
