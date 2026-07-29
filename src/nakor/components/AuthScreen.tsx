import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  User, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { NakorLogo } from './NakorLogo';

interface AuthScreenProps {
  onAuthSuccess: (email: string, name?: string) => void;
  onBackToLanding: () => void;
  initialView?: 'login' | 'register';
  message?: string;
}

export function AuthScreen({ onAuthSuccess, onBackToLanding, initialView = 'login', message }: AuthScreenProps) {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  
  // Field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Inline validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // "Esqueci minha senha" notification state
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  // Simple email regex validation
  const validateEmail = (emailStr: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Insira um e-mail válido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onAuthSuccess(email);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Insira um e-mail válido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onAuthSuccess(email, name);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear the error for this field as the user typing
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'name') setName(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFB] text-[#16131F] relative overflow-hidden flex flex-col font-sans antialiased">
      
      {/* Floating Back to Landing Link */}
      <div className="absolute top-6 left-6 z-30">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-[#5B5766] hover:text-[#16131F] rounded-full bg-[#FFFFFF] hover:bg-[#F3EEFF] border border-[#ECECF1] shadow-sm-layered transition-all cursor-pointer group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>VOLTAR</span>
        </button>
      </div>

      {/* Main Split Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full">
        
        {/* LEFT COLUMN: Auth Form (White/Light base) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-center px-6 py-12 lg:py-24 relative z-10 bg-[#FAFAFB]">
          <div className="w-full max-w-[420px] flex flex-col items-center">
            
            {/* Logo Brand Header (shown on all, centered elegantly) */}
            <div className="flex flex-col items-center mb-6 text-center pt-8">
              <div className="w-16 h-16 flex items-center justify-center mb-3 transform hover:scale-105 transition-transform duration-300">
                <NakorLogo size={60} color="#34117E" />
              </div>
              <p className="text-[12px] font-mono font-bold text-[#6D28D9] tracking-widest uppercase">
                Foco total. Resultado real.
              </p>
            </div>

            {/* Notification/Message Alert */}
            {message && (
              <div className="w-full mb-5 px-4 py-3 bg-[#F3EEFF] border border-[#E4DAFF] rounded-2xl text-center">
                <p className="text-xs font-semibold text-[#34117E] leading-snug">
                  {message}
                </p>
              </div>
            )}

            {/* Form Card */}
            <div className="w-full bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#ECECF1] shadow-lg-layered relative">
              <h2 className="text-2xl font-display font-semibold tracking-tight text-[#16131F] mb-6 text-center">
                {view === 'login' ? 'Acessar Conta' : 'Criar Conta'}
              </h2>

              {view === 'login' ? (
                /* --- LOGIN SCREEN --- */
                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  {/* Email Field Container */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <Mail size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full py-4 pl-11 pr-4 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password Field Container */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.password ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <Lock size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        placeholder="sua senha"
                        className="w-full py-4 pl-11 pr-11 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#9A96A6] hover:text-[#16131F] transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Forgot Password Link inside card bottom-right */}
                  <div className="flex flex-col items-end pt-1">
                    <button 
                      type="button"
                      onClick={() => {
                        setForgotPasswordMsg(true);
                        setTimeout(() => setForgotPasswordMsg(false), 4000);
                      }}
                      className="text-xs text-[#6D28D9] hover:text-[#34117E] transition-colors font-medium cursor-pointer"
                    >
                      Esqueci minha senha
                    </button>
                    
                    {forgotPasswordMsg && (
                      <span className="text-[10px] text-[#5B5766] font-mono mt-1.5 transition-opacity duration-300">
                        Em breve: envio de link de recuperação
                      </span>
                    )}
                  </div>

                  {/* Primary Button: Entrar (Purple gradient CTA) */}
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5B21B6] to-[#34117E] hover:from-[#6D28D9] hover:to-[#5B21B6] active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md-layered flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Entrar
                  </button>
                </form>
              ) : (
                /* --- REGISTRATION SCREEN --- */
                <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.name ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <User size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="seu nome completo"
                        className="w-full py-4 pl-11 pr-4 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <Mail size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full py-4 pl-11 pr-4 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.password ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <Lock size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        placeholder="sua senha"
                        className="w-full py-4 pl-11 pr-11 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-[#9A96A6] hover:text-[#16131F] transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1.5">
                    <div className={`relative flex items-center bg-[#FAFAFB] border ${errors.confirmPassword ? 'border-red-500 bg-red-500/5' : 'border-[#ECECF1] focus-within:border-[#6D28D9] focus-within:ring-4 focus-within:ring-[#E4DAFF]/50'} rounded-xl transition-all`}>
                      <div className="absolute left-4 text-[#9A96A6]">
                        <Lock size={16} strokeWidth={1.75} />
                      </div>
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        placeholder="confirmar senha"
                        className="w-full py-4 pl-11 pr-11 bg-transparent outline-none text-[#16131F] text-sm placeholder-[#9A96A6] font-medium"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 text-[#9A96A6] hover:text-[#16131F] transition-colors p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-1 px-1 text-[11px] text-red-500 font-semibold">
                        <AlertCircle size={12} strokeWidth={1.75} />
                        <span>{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Button: Criar conta */}
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5B21B6] to-[#34117E] hover:from-[#6D28D9] hover:to-[#5B21B6] active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md-layered flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Criar conta
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Nav and Actions */}
            <div className="w-full mt-6 space-y-5 flex flex-col items-center">
              
              {view === 'login' ? (
                <>
                  {/* Divider */}
                  <div className="w-full flex items-center justify-center gap-4">
                    <div className="h-[1px] flex-grow bg-[#ECECF1]" />
                    <span className="text-xs font-mono font-bold text-[#9A96A6]">OU</span>
                    <div className="h-[1px] flex-grow bg-[#ECECF1]" />
                  </div>

                  {/* Secondary Button: Criar Conta */}
                  <button 
                    onClick={() => {
                      setView('register');
                      setErrors({});
                    }}
                    className="w-full py-4 bg-white dark:bg-[#151622] hover:bg-[#FAFAFB] text-[#34117E] font-bold rounded-xl text-sm border border-[#ECECF1] shadow-sm-layered transition-all active:scale-[0.98] text-center cursor-pointer"
                  >
                    Criar uma conta
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setView('login');
                    setErrors({});
                  }}
                  className="text-xs font-mono font-bold text-[#6D28D9] hover:text-[#34117E] transition-all cursor-pointer"
                >
                  VOLTAR PARA O LOGIN
                </button>
              )}

              {/* Terms Footer */}
              <p className="text-[11px] font-sans text-[#5B5766] text-center max-w-xs leading-relaxed pt-2">
                Ao continuar você aceita nossos <a href="#" className="underline hover:text-[#16131F]">Termos de uso</a>
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Brand Showcase / Features (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#5B21B6] via-[#4c1d95] to-[#34117E] relative overflow-hidden flex-col justify-between p-16 text-white">
          {/* Subtle elegant pattern layers */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#E4DAFF]/[0.05] blur-[100px] rounded-full pointer-events-none" />

          {/* Logo brand at the top */}
          <div className="flex items-center gap-3 relative z-10">
            <NakorLogo size={36} color="#FFFFFF" />
            <span className="font-display font-bold text-lg tracking-tight">Nakor</span>
          </div>

          {/* Center Brand Text + Beautiful visual preview */}
          <div className="space-y-12 relative z-10 my-auto">
            <div className="space-y-4 max-w-md">
              <h1 className="text-4xl font-display font-semibold tracking-tight text-white leading-tight">
                Liberte seu potencial acadêmico.
              </h1>
              <p className="text-[#E4DAFF] text-base leading-relaxed">
                Descubra por que o Nakor é o sistema definitivo de foco utilizado por estudantes de alto rendimento. Sem brechas, sem distrações.
              </p>
            </div>

            {/* Dashboard / Mini Mockup */}
            <div className="bg-white dark:bg-[#151622]/[0.04] backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg-layered max-w-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-wider text-[#E4DAFF] uppercase">Sessão Ativa</span>
                <span className="text-[10px] font-mono text-[#F3EEFF] bg-white dark:bg-[#151622]/10 px-2.5 py-0.5 rounded-full font-bold">Modo Foco</span>
              </div>
              <h4 className="text-base font-semibold text-white tracking-tight mb-1">Revisão de Redação do ENEM</h4>
              <p className="text-xs text-neutral-300 font-sans mb-4">Duração planejada: 45 min — Sem distrações</p>
              
              <div className="flex items-end justify-between">
                <div className="text-3xl font-display font-bold tracking-tight text-white">
                  24:59
                </div>
                <div className="w-24 h-1.5 bg-white dark:bg-[#151622]/10 rounded-full overflow-hidden">
                  <div className="w-7/12 h-full bg-[#E4DAFF]" />
                </div>
              </div>
            </div>

            {/* Testimonial block */}
            <div className="border-t border-white/10 pt-6 max-w-md">
              <p className="text-xs text-[#E4DAFF] leading-relaxed italic">
                "O Nakor mudou completamente minha rotina de estudos. O timer bloqueado não me deixa pegar o celular, e as notas de IA me dão insights que nunca tive antes."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-[#F3EEFF] text-[#34117E] flex items-center justify-center font-bold text-[9px]">
                  MS
                </div>
                <span className="text-[11px] font-medium text-white">Mateus S., Estudante de Medicina</span>
              </div>
            </div>
          </div>

          {/* Footer of the panel */}
          <div className="relative z-10 text-[10px] font-mono text-[#E4DAFF]/60 flex justify-between items-center">
            <span>© Nakor Focus Systems</span>
            <span>Estética Big Tech</span>
          </div>

        </div>

      </div>
    </div>
  );
}
