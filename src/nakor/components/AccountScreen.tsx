import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Eye, EyeOff, AlertTriangle, Trash2 } from 'lucide-react';
import { updateAccount, wipeEverything, clearAppData } from '../lib/localStore';

interface AccountScreenProps {
  onBack: () => void;
}

export function AccountScreen({ onBack }: AccountScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('nakor_user') || 'Nakor User';
    const savedEmail = localStorage.getItem('nakor_user_email') || 'user@email.com';
    const savedAvatar = localStorage.getItem('nakor_avatar');
    setName(savedName);
    setEmail(savedEmail);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const triggerToast = (message: string) => {
    setShowToast({ message, visible: true });
    setTimeout(() => setShowToast(prev => ({ ...prev, visible: false })), 2000);
  };

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
            triggerToast("Avatar atualizado!");
          } catch (error) {
            triggerToast("Erro: Imagem muito grande.");
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      triggerToast('Preencha os campos obrigatórios');
      return;
    }
    
    if (showPasswordChange && (newPassword !== confirmPassword || !newPassword)) {
      triggerToast('As senhas não coincidem');
      return;
    }

    const previousEmail = localStorage.getItem('nakor_user_email');
    localStorage.setItem('nakor_user', name);
    localStorage.setItem('nakor_user_email', email.trim().toLowerCase());
    if (previousEmail) {
      updateAccount(previousEmail, {
        name,
        email: email.trim().toLowerCase(),
        ...(showPasswordChange && newPassword ? { password: newPassword } : {}),
      });
    }
    triggerToast('✅ Dados atualizados!');
  };

  const handleDeleteAccount = () => {
    wipeEverything();
    window.location.reload(); // Redireciona para /login (landing no nosso caso)
  };

  const handleClearTestData = () => {
    clearAppData();
    window.location.reload();
  };


  const initials = name.trim().split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'U';

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
            Minha conta
          </h1>
          
          <div className="w-10 h-10" />
        </div>

        {/* Content */}
        <div className="px-5 mt-2 flex flex-col gap-6">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group w-24 h-24 rounded-full border-2 border-[#34117E] shrink-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-100 flex items-center justify-center text-4xl font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-wider shadow-sm">
                  {initials}
                </div>
              )}
            </div>
            <span className="text-[#34117E] dark:text-[#C4B5FD] text-sm font-semibold">
              Toque para alterar
            </span>
          </div>

          {/* Dados Pessoais */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Dados Pessoais</span>
            <div className="bg-white dark:bg-[#151622] rounded-[28px] p-6 flex flex-col gap-4 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-400 text-xs font-semibold">Nome</span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-[#21222D] dark:text-[#F8F9FA] text-[15px] outline-none font-bold"
                />
              </div>
              
              <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20" />
              
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-400 text-xs font-semibold">Email</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-[#21222D] dark:text-[#F8F9FA] text-[15px] outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Segurança</span>
            <div className="bg-white dark:bg-[#151622] rounded-[28px] p-6 flex flex-col gap-4 border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-md-layered">
              <button 
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center justify-between w-full text-left cursor-pointer"
              >
                <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-bold">Alterar senha</span>
                <ChevronRight size={18} className="text-[#6B7280] dark:text-neutral-400" />
              </button>
              
              <AnimatePresence>
                {showPasswordChange && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-4 pt-2"
                  >
                    <div className="w-full h-px bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20" />
                    
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#F5F5F7] dark:bg-[#0D0F14] rounded-[16px] h-12 px-4 text-[#21222D] dark:text-[#F8F9FA] text-[14px] outline-none border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 focus:border-[#34117E]/40"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#F5F5F7] dark:bg-[#0D0F14] rounded-[16px] h-12 px-4 text-[#21222D] dark:text-[#F8F9FA] text-[14px] outline-none border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 focus:border-[#34117E]/40"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full h-[56px] rounded-full bg-gradient-to-br from-[#5B34C7] to-[#34117E] hover:from-[#4C2AB0] hover:to-[#2A0E68] shadow-[0_10px_26px_-10px_rgba(52,17,126,0.7)] active:scale-[0.985] text-white font-bold text-[16px] flex items-center justify-center mt-2 transition-all active:scale-[0.98] shadow-md-layered cursor-pointer"
          >
            Salvar alterações
          </button>

          {/* Zona de Perigo */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-[#FF4444] text-[10px] font-bold uppercase tracking-wider pl-4">Zona de perigo</span>
            <div className="bg-white dark:bg-[#151622] rounded-[28px] p-6 border border-[#FF4444]/25 shadow-md-layered">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-between w-full text-left cursor-pointer"
              >
                <span className="text-[#FF4444] text-[15px] font-bold">Excluir conta</span>
                <ChevronRight size={18} className="text-[#FF4444]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#151622] w-full max-w-[320px] rounded-[24px] p-6 relative z-10 flex flex-col items-center border border-[#DBDBE5] dark:border-[#2A2B3D] shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF4444]/10 flex items-center justify-center text-[#FF4444] mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-[#21222D] dark:text-[#F8F9FA] font-bold text-lg mb-2">Tem certeza?</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 leading-relaxed font-medium">
                Todos os seus dados serão apagados permanentemente. Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-12 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 text-[#21222D] dark:text-[#F8F9FA] font-bold text-[14px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 h-12 rounded-full bg-[#FF4444] hover:bg-[#e03d3d] text-white font-bold text-[14px] cursor-pointer shadow-sm"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#21222D] border border-white/10 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none whitespace-nowrap"
          >
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
