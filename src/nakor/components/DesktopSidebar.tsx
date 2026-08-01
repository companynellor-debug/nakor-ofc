import React, { useState, useEffect } from 'react';
import { House, ListChecks, Gift, UserRound } from 'lucide-react';
import { NakorLogo } from './NakorLogo';

interface DesktopSidebarProps {
  currentView: string;
  onNavigate?: (view: string) => void;
  userName: string;
  userEmail: string;
}

export function DesktopSidebar({ currentView, onNavigate, userName, userEmail }: DesktopSidebarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = () => {
      const savedAvatar = localStorage.getItem('nakor_avatar');
      setAvatarUrl(savedAvatar);
    };
    
    loadAvatar();
    
    window.addEventListener('avatarChanged', loadAvatar);
    return () => window.removeEventListener('avatarChanged', loadAvatar);
  }, []);

  return (
    <div className="hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 bg-[#100C1C] border-r border-white/[0.06] pt-8 pb-6 px-4 shrink-0 z-10 overflow-hidden">
      {/* ambient purple glow */}
      <div className="pointer-events-none absolute -top-24 -left-16 w-64 h-64 rounded-full bg-[#34117E]/50 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 -right-20 w-56 h-56 rounded-full bg-[#5A4FAF]/25 blur-[80px]" />

      <div className="relative flex items-center gap-2.5 px-2 mb-10">
        <NakorLogo size={26} color="#FFFFFF" />
        <span className="text-lg font-semibold text-white tracking-tight">Nakor</span>
      </div>

      <nav className="relative flex-1 space-y-1">
        {[
          { id: 'home', icon: House, label: 'Início' },
          { id: 'tasks', icon: ListChecks, label: 'Tarefas' },
          { id: 'loja', icon: Gift, label: 'Trocas' },
          { id: 'profile', icon: UserRound, label: 'Perfil' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate?.(tab.id)}
              className={`group relative w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl transition-all duration-200 cursor-pointer border select-none outline-none ${
                isActive
                  ? 'bg-white/[0.10] text-white border-white/[0.16] shadow-[0_10px_28px_-14px_rgba(0,0,0,0.95)] backdrop-blur-xl'
                  : 'text-white/75 hover:bg-white/[0.06] hover:text-white border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#B9B2FF] shadow-[0_0_14px_rgba(185,178,255,0.9)]" />
              )}
              <span className={`relative flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-[#6D5BF5] to-[#3A26C4] shadow-[0_6px_16px_-4px_rgba(109,91,245,0.7)]'
                  : 'bg-white/[0.06] group-hover:bg-white/[0.10]'
              }`}>
                <Icon size={16} strokeWidth={isActive ? 2.3 : 1.9} className={isActive ? 'text-white' : 'text-white/70 group-hover:text-white'} />
              </span>
              <span className="text-[13px] font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="relative mt-auto pt-5 border-t border-white/[0.08] px-1 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white font-semibold text-xs shrink-0 uppercase overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{userName.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">{userName}</span>
          <span className="text-[10px] text-white/60 truncate">{userEmail}</span>
        </div>
      </div>
    </div>
  );
}

