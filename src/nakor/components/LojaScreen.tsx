import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Lock, Gift, Star, ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, X } from 'lucide-react';
import { DesktopSidebar } from './DesktopSidebar';
import { NakorLogo } from './NakorLogo';

// Import photorealistic mockup images using Vite robust URL resolution
import notionPackMockup from '../assets/images/notion_pack_mockup_1783483426855.jpg';
import storiesDarkMockup from '../assets/images/stories_dark_mockup_1783483441260.jpg';
import plannerPdfMockup from '../assets/images/planner_pdf_mockup_1783483453201.jpg';
import wallpapersNakorMockup from '../assets/images/wallpapers_nakor_mockup_1783483463014.jpg';
import smartfitDiscountMockup from '../assets/images/smartfit_discount_mockup_1783483475066.jpg';
import aiPremiumMockup from '../assets/images/ai_premium_mockup_1783483496363.jpg';

interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: string;
  category: "Ferramentas" | "Cards" | "Parcerias";
  destaque?: boolean;
  locked?: boolean;
  soon?: boolean;
  tags?: string[];
}

interface LojaScreenProps {
  onboardingData?: any;
  onNavigate: (view: any) => void;
  onProductDetailToggle?: (isOpen: boolean) => void;
}

export function LojaScreen({ onboardingData, onNavigate, onProductDetailToggle }: LojaScreenProps) {
  const userName = onboardingData?.name || localStorage.getItem('nakor_user') || 'Alex';
  const userEmail = onboardingData?.email || localStorage.getItem('nakor_user_email') || 'alex@email.com';

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load Coins from localStorage
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('nakor_coins');
    if (saved) return parseInt(saved, 10);
    localStorage.setItem('nakor_coins', '1240');
    return 1240;
  });

  // Load redeemed products from localStorage
  const [redeemedIds, setRedeemedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('nakor_resgatados');
    return saved ? JSON.parse(saved) : [];
  });

  const products: Product[] = [
    {
      id: 1,
      name: "Pack Templates Notion Pro",
      description: "Templates completos para organizar sua rotina, projetos, finanças e estudos.",
      fullDescription: "Pack de templates ultra completo para Notion. Inclui painel de rotina diária para foco máximo, planejador de estudos avançado, controle financeiro pessoal simplificado, gerenciador de projetos de estudo com método ágil e rastreador de hábitos diários integrado com visualização de progresso.",
      price: 800,
      originalPrice: "1.600",
      category: "Ferramentas",
      destaque: true,
      tags: ["Organização", "Produtividade", "Planejamento"]
    },
    {
      id: 2,
      name: "Pack Stories Dark",
      description: "40 templates minimalistas e sofisticados para seus stories.",
      fullDescription: "40 templates minimalistas em dark mode otimizados para Instagram e TikTok. Compartilhe seu foco diário, cronômetros Pomodoro, streaks, conquistas de produtividade e frases inspiradoras com design sofisticado, limpo e profissional.",
      price: 600,
      originalPrice: "1.000",
      category: "Cards",
      tags: ["Design", "Redes Sociais", "Minimalismo"]
    },
    {
      id: 3,
      name: "Planner Diário PDF 2026",
      description: "Planner focado em micro-hábitos e método GTD. Pronto para imprimir.",
      fullDescription: "Planner diário para 2026 em formato PDF de alta resolução, pronto para impressão. Baseado nos métodos Getting Things Done (GTD) e na técnica de Pomodoro. Inclui matriz de Eisenhower para priorização e blocos de tempo para a semana toda.",
      price: 1200,
      category: "Ferramentas",
      tags: ["Impressão", "Planejamento", "PDF"]
    },
    {
      id: 4,
      name: "Wallpapers Foco Nakor",
      description: "Pacote com 15 wallpapers imersivos em dark mode para Desktop e Mobile.",
      fullDescription: "Conjunto exclusivo de 15 wallpapers com o tema visual do Nakor, criados para manter a mente livre de distrações e o ambiente de trabalho minimalista. Projetados em altas resoluções para telas Retina, Ultrawide e Mobile.",
      price: 400,
      category: "Cards",
      tags: ["Personalização", "Minimalismo", "Desktop"]
    },
    {
      id: 5,
      name: "20% OFF — SmartFit Anual",
      description: "Cupons de desconto para plano Black anual em toda rede.",
      fullDescription: "Nakor se uniu com a SmartFit para promover a produtividade além das telas. Troque suas Nakor Coins por 20% de desconto garantido na assinatura do plano Black Anual. Válido para todas as unidades na América Latina.",
      price: 5000,
      category: "Parcerias",
      locked: true,
      soon: true,
      tags: ["Saúde", "Exclusivo", "Parceria"]
    },
    {
      id: 6,
      name: "ChatGPT Plus (1 Mês)",
      description: "Acesso total aos modelos mais avançados da OpenAI e criação de GPTs.",
      fullDescription: "Resgate 1 mês completo da assinatura ChatGPT Plus, permitindo usar os modelos mais recentes da OpenAI em seus momentos de estudo ou trabalho criativo. Ferramenta premium essencial para quem precisa focar e resolver problemas complexos.",
      price: 15000,
      category: "Ferramentas",
      locked: true,
      soon: true,
      tags: ["Inteligência Artificial", "Premium"]
    }
  ];

  // Calculate coins from the last session if any
  const lastSessionCoins = React.useMemo(() => {
    try {
      const historyRaw = localStorage.getItem('nakor_historico');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        if (history.length > 0) {
          const last = history[0]; 
          const durationRealHours = (last.duracao_real || 0) / 3600;
          let earned = Math.floor(durationRealHours * 50);
          if (last.nota && last.nota > 9.0) {
            earned += 150;
          }
          if (earned > 0) return earned;
        }
      }
    } catch (e) {}
    return null;
  }, []);

  const nextProduct = React.useMemo(() => {
    const available = products.filter(p => !p.locked && !p.soon && !redeemedIds.includes(p.id) && p.price > coins);
    if (available.length === 0) return null;
    return available.sort((a, b) => a.price - b.price)[0];
  }, [coins, redeemedIds]);

  // Sync coins with localStorage

  useEffect(() => {
    localStorage.setItem('nakor_coins', coins.toString());
  }, [coins]);

  // Sync redeemed with localStorage
  useEffect(() => {
    localStorage.setItem('nakor_resgatados', JSON.stringify(redeemedIds));
  }, [redeemedIds]);

  // Lock body scroll when product details drawer is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      onProductDetailToggle?.(true);
    } else {
      document.body.style.overflow = '';
      onProductDetailToggle?.(false);
    }
    return () => {
      document.body.style.overflow = '';
      onProductDetailToggle?.(false);
    };
  }, [selectedProduct, onProductDetailToggle]);

  const showToastMessage = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleRedeem = (product: Product) => {
    if (redeemedIds.includes(product.id)) {
      showToastMessage("⚠️ Você já resgatou este produto!");
      return;
    }

    if (coins < product.price) {
      showToastMessage("❌ Coins insuficientes!");
      return;
    }

    const newCoins = coins - product.price;
    setCoins(newCoins);
    setRedeemedIds([...redeemedIds, product.id]);
    setSelectedProduct(null);
    showToastMessage("✅ Resgatado com sucesso!");
  };



  const categories = ["Todos", "Ferramentas", "Cards", "Parcerias"];


  const featuredProduct = React.useMemo(() => {
    const available = products.filter(p => !p.locked && !p.soon);
    if (available.length === 0) return null;
    return available.sort((a, b) => b.price - a.price)[0];
  }, [products]);

  const filteredProducts = products.filter(p => 
    (activeCategory === "Todos" || p.category === activeCategory) &&
    p.id !== featuredProduct?.id
  );

  const renderProductVisual = (product: Product, isGrid: boolean = false) => {
    let imgSrc = "";
    switch (product.id) {
      case 1: imgSrc = notionPackMockup; break;
      case 2: imgSrc = storiesDarkMockup; break;
      case 3: imgSrc = plannerPdfMockup; break;
      case 4: imgSrc = wallpapersNakorMockup; break;
      case 5: imgSrc = smartfitDiscountMockup; break;
      case 6: imgSrc = aiPremiumMockup; break;
    }

    const roundedClass = isGrid ? "rounded-t-[16px]" : "rounded-[20px]";
    const hClass = isGrid ? "aspect-[4/3]" : "h-[180px]";
    const filterClass = (isGrid && (product.locked || product.soon)) ? "grayscale opacity-60" : "";

    return (
      <div className={`w-full ${hClass} relative overflow-hidden flex items-center justify-center bg-[#121214] ${roundedClass}`}>
        {imgSrc && (
          <img 
            src={imgSrc} 
            alt={product.name} 
            className={`w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 hover:scale-105 ${filterClass}`} 
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    );
  };
  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] font-sans flex flex-col md:flex-row relative">
      <DesktopSidebar currentView="loja" onNavigate={onNavigate} userName={userName} userEmail={userEmail} />
      
      <div className="md:pl-[220px] w-full min-h-screen flex justify-center pb-32 md:pb-10 relative overflow-y-auto">
        <div className="w-full max-w-[390px] md:max-w-[1000px] md:p-12 px-6 pt-10 flex flex-col items-stretch">

          {/* HEADER */}
          <div id="loja-header" className="w-full flex flex-col mb-10">
            <div className="mb-6">
              <span className="text-[10px] text-[#34117E] dark:text-[#C4B5FD] font-mono tracking-widest uppercase mb-1.5 block font-bold">RECOMPENSAS</span>
              <h1 className="text-3xl font-semibold tracking-tight text-[#21222D] dark:text-[#F8F9FA] font-sans">Trocas</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5 font-medium">Sua dedicação diária vale prêmios exclusivos</p>
            </div>

            {/* WALLET CARD */}
            <div className="w-full bg-gradient-to-br from-[#111827] to-[#1E1B4B] rounded-[20px] p-5 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[#9CA3AF] dark:text-neutral-400 text-[10px] font-mono tracking-[2px] uppercase mb-1">
                    Seu Saldo
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-mono text-[40px] font-bold leading-none">
                      {coins.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[#A5B4FC] text-sm font-mono">
                      coins
                    </span>
                  </div>
                  {lastSessionCoins && (
                    <div className="text-[#6B7280] dark:text-neutral-400 text-[11px] mt-1.5">
                      +{lastSessionCoins} coins na última sessão
                    </div>
                  )}
                </div>
                
                {/* Coin Icon */}
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] shrink-0"
                >
                  <NakorLogo color="white" size={24} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                {nextProduct ? (
                  <>
                    <div className="text-[#9CA3AF] dark:text-neutral-400 text-[11px] mb-2 font-medium">
                      Faltam {nextProduct.price - coins} coins para {nextProduct.name}
                    </div>
                    <div className="w-full h-[6px] bg-[#374151] rounded-[3px] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-[3px]"
                        style={{ width: `${Math.min(100, (coins / nextProduct.price) * 100)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-[#A5B4FC] text-[11px] font-medium pt-1">
                    Você pode resgatar prêmios!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORY TABS (CAPSULE STYLE - PREMIUM DESIGN) */}
          <div id="category-tabs" className="w-full flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#111827] to-[#1E1B4B] text-white border border-transparent shadow-sm-layered' 
                      : 'bg-white dark:bg-[#151622] text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-sm-layered'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

                    {/* FEATURED PRODUCT */}
          {featuredProduct && activeCategory === "Todos" && (
            <div className="mb-8">
              <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono tracking-[2px] uppercase mb-3 block">
                EM DESTAQUE
              </span>
              <div 
                onClick={() => setSelectedProduct(featuredProduct)}
                className="w-full bg-gradient-to-r from-[#FFFFFF] to-[#EEF2FF] border border-[#E0E7FF] rounded-[16px] overflow-hidden shadow-sm flex flex-row relative transition-all duration-300 cursor-pointer hover:shadow-md active:scale-[0.99]"
              >
                <div className="w-[40%] shrink-0">
                  {renderProductVisual(featuredProduct, false)}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <span className="text-[9px] text-[#9CA3AF] dark:text-neutral-400 font-mono tracking-[1px] uppercase block mb-1">
                    {featuredProduct.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#21222D] dark:text-[#F8F9FA] leading-snug line-clamp-2 mb-3">
                    {featuredProduct.name}
                  </h3>
                  <div className="mt-auto self-start">
                    {(() => {
                      const canAfford = coins >= featuredProduct.price;
                      return (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${canAfford ? 'bg-[#4F46E5]' : 'bg-[#F3F4F6]'}`}>
                          <div className="w-[14px] h-[14px] rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shrink-0">
                            <span className="text-white text-[6px] font-mono font-bold">NK</span>
                          </div>
                          <span className={`text-[12px] font-mono font-bold ${canAfford ? 'text-white' : 'text-[#374151]'}`}>
                            {featuredProduct.price}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID OF PRODUCTS (CARDS FORMAT) */}
          <div id="products-grid" className="w-full grid grid-cols-2 gap-3 mb-12">
            {filteredProducts.map((product) => {
              const isRedeemed = redeemedIds.includes(product.id);
              const canAfford = coins >= product.price;
              
              return (
                <div 
                  key={product.id}
                  onClick={() => {
                    if (!product.locked && !product.soon) {
                      setSelectedProduct(product);
                    }
                  }}
                  className={`bg-white dark:bg-[#151622] rounded-[16px] overflow-hidden flex flex-col relative group transition-all duration-300 cursor-pointer ${
                    (!product.locked && !product.soon) ? 'active:scale-[0.99] hover:shadow-md' : 'opacity-90'
                  } ${
                    canAfford && !product.locked && !product.soon 
                      ? 'border-[1.5px] border-[#4F46E5] shadow-[0_4px_16px_rgba(79,70,229,0.2)]' 
                      : 'border border-[#DBDBE5]/25 dark:border-[#2A2B3D]/25 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  {/* Visual mockup generator header */}
                  {renderProductVisual(product, true)}

                  {/* Product Information Card Area */}
                  <div className="p-3 flex flex-col flex-1 bg-transparent">
                    <span className="text-[9px] text-[#9CA3AF] dark:text-neutral-400 font-mono tracking-[1px] uppercase block mb-1">
                      {product.category}
                    </span>
                    <h3 className="text-[13px] font-bold text-[#21222D] dark:text-[#F8F9FA] leading-snug line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto pt-3">
                      {(product.locked || product.soon) ? (
                        <div className="inline-block mt-1">
                          <span className="text-[10px] text-[#9CA3AF] dark:text-neutral-400 font-mono tracking-[1px] uppercase">EM BREVE</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-0.5">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${canAfford ? 'bg-[#4F46E5]' : 'bg-[#F3F4F6]'}`}>
                            <div className="w-[14px] h-[14px] rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shrink-0">
                              <span className="text-white text-[6px] font-mono font-bold">NK</span>
                            </div>
                            <span className={`text-[12px] font-mono font-bold ${canAfford ? 'text-white' : 'text-[#374151]'}`}>
                              {product.price}
                            </span>
                          </div>
                          {!canAfford && (
                            <span className="text-[#9CA3AF] dark:text-neutral-400 text-[10px] pl-1 font-mono">
                              faltam {product.price - coins}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* EM BREVE CARD */}
            <div className="bg-[#F9FAFB] rounded-[16px] overflow-hidden border-[1.5px] border-dashed border-[#D1D5DB] flex flex-col items-center justify-center p-4 min-h-[220px]">
              <span className="text-[32px] text-[#9CA3AF] dark:text-neutral-400 font-mono mb-2">?</span>
              <span className="text-[11px] text-[#9CA3AF] dark:text-neutral-400 text-center font-bold font-sans">novos prêmios em breve</span>
              <span className="text-[9px] text-[#D1D5DB] text-center mt-1">parcerias e cupons semanais</span>
            </div>
          </div>

        </div>
      </div>

      {/* DETALHES DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              {/* Bottom Sheet Drawer content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#151622] border border-[#DBDBE5] dark:border-[#2A2B3D] rounded-[28px] p-8 shadow-2xl flex flex-col relative"
              >
                {/* Botão fechar */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-5 right-6 w-8 h-8 rounded-full bg-[#DBDBE5]/25 dark:bg-[#2A2B3D]/25 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-[#21222D] dark:hover:text-[#F8F9FA] hover:bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 transition-all cursor-pointer z-10 shrink-0 border border-transparent"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>

                {/* Badge de categoria */}
                <div className="flex justify-start shrink-0 mb-3">
                  <span className="bg-[#DBDBE5]/25 dark:bg-[#2A2B3D]/25 text-[#34117E] dark:text-[#C4B5FD] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 font-mono font-medium text-[9px] tracking-widest rounded-full px-3 py-1 uppercase">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Nome do produto */}
                <h2 className="text-xl font-semibold text-[#21222D] dark:text-[#F8F9FA] tracking-tight font-sans shrink-0">
                  {selectedProduct.name}
                </h2>

                {/* Imagem/visual do produto */}
                <div className="w-full h-[180px] shrink-0 bg-[#F5F5F7] dark:bg-[#0D0F14] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 rounded-[20px] my-5 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {renderProductVisual(selectedProduct, true)}
                </div>

                {/* Descrição */}
                <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed shrink-0 mb-6 font-medium">
                  {selectedProduct.fullDescription}
                </p>

                {/* Card de Preço & Resgate */}
                <div className="bg-[#F5F5F7] dark:bg-[#0D0F14] border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shrink-0 rounded-[20px] p-5 flex flex-col gap-3.5 shadow-sm-layered">
                  {/* Preço Original */}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 text-xs font-medium">Preço Original</span>
                    <span className="text-neutral-400 line-through text-xs font-mono font-medium">
                      {selectedProduct.originalPrice ? `${selectedProduct.originalPrice} coins` : "—"}
                    </span>
                  </div>

                  {/* Custo do Resgate */}
                  <div className="flex justify-between items-center border-t border-[#DBDBE5]/20 dark:border-[#2A2B3D]/20 pt-3.5">
                    <span className="text-neutral-600 text-xs font-medium">Custo do Resgate</span>
                    <span className="text-[#34117E] dark:text-[#C4B5FD] font-bold text-sm font-mono">
                      {selectedProduct.price} COINS
                    </span>
                  </div>
                </div>

                {/* Botão de ação */}
                {redeemedIds.includes(selectedProduct.id) ? (
                  <button 
                    disabled
                    className="w-full h-12 bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 rounded-[16px] flex items-center justify-center text-neutral-400 font-bold text-xs mt-6 cursor-not-allowed"
                  >
                    Produto já resgatado
                  </button>
                ) : coins >= selectedProduct.price ? (
                  <button 
                    onClick={() => handleRedeem(selectedProduct)}
                    className="w-full h-12 bg-[#34117E] hover:bg-[#260b61] text-white font-bold text-xs rounded-[16px] flex items-center justify-center mt-6 transition-all cursor-pointer shadow-sm-layered"
                  >
                    Resgatar por {selectedProduct.price} coins
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full h-12 bg-[#DBDBE5]/20 dark:bg-[#2A2B3D]/20 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 rounded-[16px] flex items-center justify-center text-neutral-400 font-bold text-xs mt-6 cursor-not-allowed"
                  >
                    Coins insuficientes — continue focando!
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#21222D] border border-white/10 text-white text-xs font-semibold px-5 py-3 rounded-full shadow-md flex items-center gap-2"
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
