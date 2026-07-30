import React, { useState, useEffect } from 'react';
import { Home, ClipboardList, ShoppingBag, Clock, User } from 'lucide-react';
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
          { id: 'home', icon: Home, label: 'Início' },
          { id: 'tasks', icon: ClipboardList, label: 'Tarefas' },
          { id: 'loja', icon: ShoppingBag, label: 'Trocas' },
          { id: 'profile', icon: User, label: 'Perfil' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate?.(tab.id)}
              className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer border select-none outline-none ${
                isActive
                  ? 'bg-white/[0.10] text-white border-white/[0.14] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]'
                  : 'text-white/50 hover:bg-white/[0.06] hover:text-white border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#958CE8] shadow-[0_0_12px_rgba(149,140,232,0.8)]" />
              )}
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.7} className={`shrink-0 ${isActive ? 'text-[#B9B2FF]' : ''}`} />
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
          <span className="text-[10px] text-white/40 truncate">{userEmail}</span>
        </div>
      </div>
    </div>
  );
}

