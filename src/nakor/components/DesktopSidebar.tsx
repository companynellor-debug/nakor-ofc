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
    <div className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 bg-black border-r border-[#DBDBE5]/10 dark:border-[#2A2B3D]/10 pt-8 pb-6 px-4 shrink-0 z-10">
      <div className="flex items-center gap-2.5 px-2 mb-10">
        <NakorLogo size={24} color="#FFFFFF" />
        <span className="text-lg font-semibold text-white tracking-tight">Nakor</span>
      </div>
      
      <nav className="flex-1 space-y-1.5">
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer border select-none outline-none ${
                isActive 
                  ? 'bg-white/10 text-white border-white/20 font-bold shadow-sm' 
                  : 'text-[#DBDBE5]/55 hover:bg-white/5 hover:text-white border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.5} className="shrink-0" />
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-[#DBDBE5]/10 dark:border-[#2A2B3D]/10 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium text-xs shrink-0 uppercase overflow-hidden relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{userName.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-medium text-white truncate">{userName}</span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{userEmail}</span>
        </div>
      </div>
    </div>
  );
}
