import { useState, useEffect, useRef } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DesktopSidebar } from './components/DesktopSidebar';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { NewActivityScreen } from './components/NewActivityScreen';
import { FocusScreen } from './components/FocusScreen';
import { AfterDiaryScreen } from './components/AfterDiaryScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { TasksScreen } from './components/TasksScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { AccountScreen } from './components/AccountScreen';
import { FocusTimeScreen } from './components/FocusTimeScreen';
import { CardColorsScreen } from './components/CardColorsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { LojaScreen } from './components/LojaScreen';
import { AppIntroScreen } from "./components/AppIntroScreen";
import { HeroVisual } from './components/HeroVisual';
import { PhoneMockups } from './components/PhoneMockups';
import { NakorLogo } from './components/NakorLogo';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle, 
  RotateCcw, 
  ArrowRight, 
  LogIn, 
  Zap, 
  ShieldCheck, 
  Smartphone,
  Play,
  Home,
  ClipboardList,
  Clock,
  User,
  PieChart,
  ShoppingBag, Loader2, Moon, Sun,
  Store
} from 'lucide-react';

const TAB_ORDER = ['home', 'tasks', 'new_activity', 'loja', 'profile'];

export default function App() {
  const [view, setView] = useState<string>('landing');
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Direction of the tab change (1 = forward, -1 = backward, 0 = neutral)
  const prevViewRef = useRef(view);
  const navDirRef = useRef(0);
  if (prevViewRef.current !== view) {
    const from = TAB_ORDER.indexOf(prevViewRef.current);
    const to = TAB_ORDER.indexOf(view);
    navDirRef.current = from !== -1 && to !== -1 && from !== to ? (to > from ? 1 : -1) : 0;
    prevViewRef.current = view;
  }
  const dir = navDirRef.current;

  const tabAnim = {
    initial: { opacity: 0, x: dir * 44, scale: 0.98, filter: 'blur(8px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, x: dir * -44, scale: 0.985, filter: 'blur(8px)' },
    transition: { type: 'spring' as const, stiffness: 340, damping: 34, mass: 0.7 },
  };


  useEffect(() => {
    const savedTheme = localStorage.getItem('nakor_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nakor_theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleNavigate = (targetView: string) => {
    if (view === targetView) return;
    setLoadingTab(targetView);
    setTimeout(() => {
      setView(targetView as any);
      setLoadingTab(null);
    }, 400);
  };

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const userName = localStorage.getItem('nakor_user') || onboardingData?.name || 'Alex Andrade';
  const [authInitialView, setAuthInitialView] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState<string>('');
  const [isLojaDrawerOpen, setIsLojaDrawerOpen] = useState(false);
  const [selectedHistoricActivity, setSelectedHistoricActivity] = useState<any>(null);
  const [historicActivitySource, setHistoricActivitySource] = useState<'home' | 'history' | null>(null);

  const handleViewHistoricActivity = (activity: any, source: 'home' | 'history') => {
    setSelectedHistoricActivity(activity);
    setHistoricActivitySource(source);
    setView('resultado');
  };

  // Reset drawer state when navigating away from loja
  useEffect(() => {
    if (view !== 'loja') {
      setIsLojaDrawerOpen(false);
    }
  }, [view]);

  // Check if onboarding completed or user logged in on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('nakor_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      
      const savedOnboarding = localStorage.getItem(`nakor_onboarding_${savedEmail}`) || localStorage.getItem('nakor_onboarding');
      if (savedOnboarding) {
        try {
          setOnboardingData(JSON.parse(savedOnboarding));
          setIsOnboardingComplete(true);
          setView('home');
        } catch (e) {
          setView('onboarding');
        }
      } else {
        setView('onboarding');
      }
    } else {
      setView('landing');
    }
  }, []);

  const handleCompleteOnboarding = (data: any) => {
    setOnboardingData(data);
    setIsOnboardingComplete(true);
    if (userEmail) {
      localStorage.setItem(`nakor_onboarding_${userEmail}`, JSON.stringify(data));
    }
    localStorage.setItem('nakor_onboarding', JSON.stringify(data));
    setView('home');
  };

  const handleResetOnboarding = () => {
    if (userEmail) {
      localStorage.removeItem(`nakor_onboarding_${userEmail}`);
    }
    localStorage.removeItem('nakor_onboarding');
    setOnboardingData(null);
    setIsOnboardingComplete(false);
    setView('onboarding');
  };

  const handleAuthSuccess = (email: string, name?: string) => {
    setUserEmail(email);
    localStorage.setItem('nakor_user_email', email);
    if (name) {
      localStorage.setItem('nakor_user', name);
    }
    
    const savedOnboarding = localStorage.getItem(`nakor_onboarding_${email}`) || localStorage.getItem('nakor_onboarding');
    
    if (name) {
      // Novo cadastro: forçar o questionário uma única vez
      localStorage.removeItem(`nakor_onboarding_${email}`);
      localStorage.removeItem('nakor_onboarding');
      setOnboardingData(null);
      setIsOnboardingComplete(false);
      setView('onboarding');
    } else {
      // Login: restaurar se existir, senão direcionar para o questionário
      if (savedOnboarding) {
        try {
          setOnboardingData(JSON.parse(savedOnboarding));
          setIsOnboardingComplete(true);
          setView('home');
        } catch (e) {
          setView('onboarding');
        }
      } else {
        setView('onboarding');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nakor_user_email');
    setUserEmail(null);
    setIsOnboardingComplete(false);
    setOnboardingData(null);
    setAuthInitialView('login');
    setAuthMessage('');
    setView('auth');
  };

  // 1. HOME SCREEN & DASHBOARD ROUTES
  if (['home', 'new_activity', 'tasks', 'history', 'profile', 'foco', 'diario-depois', 'resultado', 'conquistas', 'loja', 'notifications', 'account', 'focus_time', 'card_colors'].includes(view)) {
    return (
      <div className="w-full min-h-screen bg-[#13141C] relative overflow-x-hidden">
        {/* Background Ambient Gradients & Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Deep, immersive slate-navy gradient with 90% overall exposure over dark background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1c2b] via-[#151622] to-[#13141C] opacity-90" />
          
          {/* Luminous, rich radial glowing light source in the top-left using purple #34117E */}
          <div className="absolute top-[-25%] left-[-15%] w-[100%] h-[75%] rounded-full bg-gradient-to-br from-[#34117E]/[0.10] via-transparent to-transparent blur-[140px]" />
          
          {/* Elegant top-right subtle blue #ACD1FD glow */}
          <div className="absolute top-[10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#ACD1FD]/[0.05] blur-[120px]" />

          {/* Crisp premium coordinate-like square grid overlay matching the reference image's visual grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,17,126,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,17,126,0.035)_1px,transparent_1px)] bg-[size:36px_36px]" />
          
          {/* Deep background ambient lights for incredible contrast and visual breathability */}
          <div className="absolute bottom-[15%] left-[5%] w-[80%] h-[50%] rounded-full bg-[#ACD1FD]/[0.04] blur-[180px]" />
        </div>

        <div className="relative z-10 min-h-screen w-full flex flex-col">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <HomeScreen 
                  onboardingData={onboardingData}
                  onNavigate={setView}
                  onViewHistoricActivity={(act) => handleViewHistoricActivity(act, 'home')}
                />
              </motion.div>
            )}
            
            {view === 'new_activity' && (
              <motion.div
                key="new_activity"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <NewActivityScreen 
                  onNavigate={setView}
                />
              </motion.div>
            )}
            
            {view === 'foco' && (
              <motion.div
                key="foco"
                initial={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex-1 flex flex-col"
              >
                <FocusScreen 
                  onNavigate={setView}
                />
              </motion.div>
            )}
            
            {view === 'diario-depois' && (
              <motion.div
                key="diario-depois"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <AfterDiaryScreen 
                  onNavigate={setView}
                />
              </motion.div>
            )}
            
            {view === 'resultado' && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -12 }}
                transition={{ type: "spring", stiffness: 240, damping: 26 }}
                className="w-full flex-1 flex flex-col"
              >
                <ResultScreen 
                  onNavigate={(targetView) => {
                    if (selectedHistoricActivity) {
                      const source = historicActivitySource || 'history';
                      setSelectedHistoricActivity(null);
                      setHistoricActivitySource(null);
                      setView(source);
                    } else {
                      setView(targetView as any);
                    }
                  }}
                  historicActivity={selectedHistoricActivity}
                />
              </motion.div>
            )}
            
            {view === 'history' && (
              <motion.div
                key="history"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <HistoryScreen 
                  onboardingData={onboardingData}
                  onNavigate={setView}
                  onViewHistoricActivity={(act) => handleViewHistoricActivity(act, 'history')}
                />
              </motion.div>
            )}
            
            {view === 'tasks' && (
              <motion.div
                key="tasks"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <TasksScreen 
                  onboardingData={onboardingData}
                  onNavigate={setView}
                />
              </motion.div>
            )}
            
            {view === 'profile' && (
              <motion.div
                key="profile"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <ProfileScreen 
                  onboardingData={onboardingData}
                  onNavigate={setView}
                  onLogout={handleLogout}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              </motion.div>
            )}
            
            {view === 'conquistas' && (
              <motion.div 
                key="conquistas" 
                {...tabAnim}
                className="w-full min-h-screen bg-transparent md:bg-[#000000] text-[#FFFFFF] font-sans flex flex-col md:flex-row relative"
              >
                <DesktopSidebar currentView="profile" onNavigate={setView} userName={userName} userEmail={userEmail || ''} />
                <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
                  <div className="w-full flex justify-center">
                    <AchievementsScreen 
                      onNavigate={setView}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {view === 'loja' && (
              <motion.div
                key="loja"
                {...tabAnim}
                className="w-full flex-1 flex flex-col"
              >
                <LojaScreen 
                  onboardingData={onboardingData}
                  onNavigate={setView}
                  onProductDetailToggle={setIsLojaDrawerOpen}
                />
              </motion.div>
            )}
            
            {view === 'notifications' && (
              <motion.div 
                key="notifications" 
                {...tabAnim}
                className="w-full min-h-screen bg-transparent md:bg-[#000000] text-[#FFFFFF] font-sans flex flex-col md:flex-row relative"
              >
                <DesktopSidebar currentView="profile" onNavigate={setView} userName={userName} userEmail={userEmail || ''} />
                <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
                  <div className="w-full flex justify-center">
                    <NotificationsScreen 
                      onBack={() => setView('profile')}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {view === 'account' && (
              <motion.div 
                key="account" 
                {...tabAnim}
                className="w-full min-h-screen bg-transparent md:bg-[#000000] text-[#FFFFFF] font-sans flex flex-col md:flex-row relative"
              >
                <DesktopSidebar currentView="profile" onNavigate={setView} userName={userName} userEmail={userEmail || ''} />
                <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
                  <div className="w-full flex justify-center">
                    <AccountScreen 
                      onBack={() => setView('profile')}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {view === 'focus_time' && (
              <motion.div 
                key="focus_time" 
                {...tabAnim}
                className="w-full min-h-screen bg-transparent md:bg-[#000000] text-[#FFFFFF] font-sans flex flex-col md:flex-row relative"
              >
                <DesktopSidebar currentView="profile" onNavigate={setView} userName={userName} userEmail={userEmail || ''} />
                <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
                  <div className="w-full flex justify-center">
                    <FocusTimeScreen 
                      onBack={() => setView('profile')}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {view === 'card_colors' && (
              <motion.div 
                key="card_colors" 
                {...tabAnim}
                className="w-full min-h-screen bg-transparent md:bg-[#000000] text-[#FFFFFF] font-sans flex flex-col md:flex-row relative"
              >
                <DesktopSidebar currentView="profile" onNavigate={setView} userName={userName} userEmail={userEmail || ''} />
                <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
                  <div className="w-full flex justify-center">
                    <CardColorsScreen 
                      onBack={() => setView('profile')}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {view !== 'home' && view !== 'new_activity' && view !== 'foco' && view !== 'diario-depois' && view !== 'resultado' && view !== 'history' && view !== 'tasks' && view !== 'profile' && view !== 'conquistas' && view !== 'loja' && view !== 'notifications' && view !== 'account' && view !== 'focus_time' && view !== 'card_colors' && (
            <div className="min-h-screen w-full bg-transparent" />
          )}
        </div>
        
        {/* Bottom Navbar */}
        {view !== 'new_activity' && view !== 'foco' && view !== 'diario-depois' && view !== 'resultado' && view !== 'notifications' && view !== 'account' && view !== 'focus_time' && view !== 'card_colors' && !isLojaDrawerOpen && (() => {
          const tabs = [
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'tasks', icon: ClipboardList, label: 'Tarefas' },
            { id: 'new_activity', icon: Play, label: 'Iniciar', isCenter: true },
            { id: 'loja', icon: ShoppingBag, Loader2, Moon, Sun, label: 'Trocas' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ];

          return (
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
              <div className="relative w-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.08)] h-[76px]">
                {/* Background with cutout */}
                <div 
                  className="absolute inset-0 bg-white dark:bg-[#1A1B29] dark:border dark:border-white/[0.10] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] rounded-[32px] z-0"
                  style={{
                    WebkitMaskImage: 'radial-gradient(circle 38px at 50% 0px, transparent 100%, black 100%)',
                    maskImage: 'radial-gradient(circle 38px at 50% 0px, transparent 100%, black 100%)'
                  }}
                />
                
                {/* Icons */}
                <div className="absolute inset-0 flex items-center justify-between px-2 z-10">
                  {tabs.map((tab, i) => {
                    const isActive = view === tab.id;
                    const isLoading = loadingTab === tab.id;
                    const Icon = tab.icon;

                    if (tab.isCenter) {
                      return (
                        <div key={tab.id} className="relative flex flex-col items-center justify-center w-[20%] h-full">
                          <button
                            onClick={() => handleNavigate(tab.id)}
                            className="absolute -top-7 flex flex-col items-center justify-center cursor-pointer outline-none select-none active:scale-95 transition-transform"
                          >
                            <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.3)] bg-[#4F46E5] text-white">
                              {isLoading ? (
                                <Loader2 size={26} className="text-white animate-spin" />
                              ) : (
                                <Play size={26} className="text-white fill-white ml-1" />
                              )}
                            </div>
                            <span className="text-[10px] mt-2 font-semibold text-[#9CA3AF] dark:text-neutral-400 opacity-0">Iniciar</span>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleNavigate(tab.id)}
                        className="flex flex-col items-center justify-center relative cursor-pointer outline-none select-none w-[20%] active:scale-95 transition-transform h-full pt-1"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
                            className="absolute inset-x-2 inset-y-2 rounded-[22px] bg-[#34117E]/[0.08] dark:bg-[#C4B5FD]/[0.14] z-0"
                          />
                        )}
                        <motion.span
                          className="relative z-10 flex flex-col items-center"
                          animate={isActive ? { y: -2, scale: 1.08 } : { y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 24 }}
                        >
                          {isLoading ? (
                            <Loader2 size={22} className="text-[#34117E] dark:text-[#C4B5FD] animate-spin mb-1" />
                          ) : (
                            <Icon size={22} className={`${isActive ? 'text-[#34117E] dark:text-[#C4B5FD] dark:drop-shadow-[0_0_10px_rgba(167,139,250,0.45)]' : 'text-[#9CA3AF] dark:text-[#A2A5B9]'} transition-colors duration-200`} strokeWidth={isActive ? 2.5 : 2} />
                          )}
                          <span className={`text-[10px] mt-1.5 ${isActive ? 'text-[#21222D] dark:text-[#F8F9FA] font-bold' : 'text-[#9CA3AF] dark:text-[#A2A5B9] font-medium'} transition-colors duration-200`}>{tab.label}</span>
                        </motion.span>
                      </button>
                    );

                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // 2. AUTH SCREEN VIEW
  if (view === 'auth') {
    return (
      <motion.div
        key="auth"
        initial={{ opacity: 0, scale: 1.015, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full min-h-screen"
      >
        <AuthScreen 
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setView('landing')}
          initialView={authInitialView}
          message={authMessage}
        />
      </motion.div>
    );
  }

  // 3. ONBOARDING SCREEN VIEW
  if (view === 'onboarding') {
    return (
      <motion.div
        key="onboarding"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="w-full min-h-screen"
      >
        <OnboardingScreen 
          onComplete={handleCompleteOnboarding}
          onBackToLanding={() => setView('landing')}
          userEmail={userEmail || 'warcallapp@gmail.com'}
        />
      </motion.div>
    );
  }

  // 5. LANDING PAGE VIEW (Default initial view)
  return (
    <AppIntroScreen 
      onStart={() => {
        setAuthInitialView('register');
        setAuthMessage('');
        setView('auth');
      }} 
      onLogin={() => {
        setAuthInitialView('login');
        setAuthMessage('');
        setView('auth');
      }} 
    />
  );
}
