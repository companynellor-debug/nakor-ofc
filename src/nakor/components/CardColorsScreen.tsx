import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { NakorLogo } from './NakorLogo';
import { UnifiedGlowCard } from './UnifiedGlowCard';

interface CardColorsScreenProps {
  onBack: () => void;
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let cleanHex = hex.replace('#', '');
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getCardBgStyle(styleId: string, accentColor: string, opacity: number): React.CSSProperties {
  const bgOpacityVal = opacity / 100;
  const cardBgColor = `rgba(13, 15, 18, ${bgOpacityVal})`;
  
  const baseStyle: React.CSSProperties = {
    backgroundColor: cardBgColor,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  switch (styleId) {
    case 'gradient':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.8)} 0%, ${cardBgColor} 70%)`,
        border: `1.5px solid ${hexToRgba(accentColor, 0.45)}`,
      };
    case 'neon_radial':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.95)} 0%, ${hexToRgba(accentColor, 0.25)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.5)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'aurora_mesh':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.85)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.5px solid ${hexToRgba(accentColor, 0.75)}`,
      };
    case 'cyber_grid':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.25)} 40%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'laser_split':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'nebula_glow':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(225deg, ${hexToRgba(accentColor, 0.85)} 0%, ${cardBgColor} 45%, ${hexToRgba(accentColor, 0.4)} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.8)}`,
      };
    case 'sunset_fire':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(45deg, ${hexToRgba(accentColor, 0.9)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'super_nova':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(to top right, ${hexToRgba(accentColor, 0.95)} 0%, ${hexToRgba(accentColor, 0.2)} 35%, ${cardBgColor} 100%)`,
        boxShadow: `inset 0 0 25px ${hexToRgba(accentColor, 0.5)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `2px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'vortex_matrix':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(115deg, ${hexToRgba(accentColor, 0.85)} 10%, ${cardBgColor} 50%, ${hexToRgba(accentColor, 0.45)} 90%)`,
        boxShadow: `inset 0 0 20px ${hexToRgba(accentColor, 0.45)}, 0 10px 30px rgba(0,0,0,0.5)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'neon_border':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${cardBgColor} 0%, ${cardBgColor} 100%)`,
        boxShadow: `0 0 20px ${hexToRgba(accentColor, 0.85)}, inset 0 0 12px ${hexToRgba(accentColor, 0.5)}`,
        border: `2px solid ${hexToRgba(accentColor, 0.95)}`,
      };
    case 'eclipse_glow':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(180deg, ${cardBgColor} 50%, ${hexToRgba(accentColor, 0.25)} 80%, ${hexToRgba(accentColor, 0.85)} 100%)`,
        border: `1.8px solid ${hexToRgba(accentColor, 0.85)}`,
      };
    case 'grain':
      return {
        ...baseStyle,
        backgroundImage: 'none',
        border: `1px solid ${hexToRgba(accentColor, 0.5)}`,
      };
    case 'solid':
    default:
      return {
        ...baseStyle,
        backgroundImage: 'none',
        border: `1px solid ${hexToRgba(accentColor, 0.5)}`,
      };
  }
}

export function CardColorsScreen({ onBack }: CardColorsScreenProps) {
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [bgStyle, setBgStyle] = useState('gradient'); // 'gradient', 'solid', 'grain'
  const [scoreStyle, setScoreStyle] = useState('large'); // 'large', 'compact'
  const [layout, setLayout] = useState('trio'); // 'trio' | 'unificado'
  
  const [bgOpacity, setBgOpacity] = useState(80); // 0 to 100
  const [conteudo, setConteudo] = useState({
    textoAntes: true,
    textoDepois: true,
    notaIA: true,
    fraseIA: true,
    streak: true,
    selo: true,
    horario: false,
    duracao: true
  });
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);


useEffect(() => {
    try {
      const saved = localStorage.getItem('nakor_estilo_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.bgStyle) setBgStyle(parsed.bgStyle);
        if (parsed.scoreStyle) setScoreStyle(parsed.scoreStyle);
        if (parsed.layout) setLayout(parsed.layout);
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity);
        if (parsed.conteudo) setConteudo(parsed.conteudo);
      }
      
      const historyStr = localStorage.getItem('nakor_historico');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        if (history && history.length > 0) {
          setLastActivity(history[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = () => {
    try {
      const config = { accentColor, bgStyle, scoreStyle, layout, bgOpacity, conteudo };
      localStorage.setItem('nakor_estilo_cards', JSON.stringify(config));
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const colors = [
    { name: 'Roxo', hex: '#7C3AED' },
    { name: 'Azul', hex: '#2563EB' },
    { name: 'Verde Limão', hex: '#A5CE00' },
    { name: 'Azul Metálico', hex: '#0CB6D7' },
    { name: 'Rosa Vibrante', hex: '#EC4899' },
    { name: 'Branco', hex: '#FFFFFF' }
  ];

  const bgOptions = [
    { id: 'gradient', label: 'Gradiente escuro' },
    { id: 'solid', label: 'Sólido escuro' },
    { id: 'grain', label: 'Com grain/textura' },
    { id: 'neon_radial', label: 'Glow Neon Extremo 🔥' },
    { id: 'aurora_mesh', label: 'Aurora Orgânica 🌌' },
    { id: 'cyber_grid', label: 'Grade Digital Tech ⚡' },
    { id: 'laser_split', label: 'Diagonal Laser 📐' },
    { id: 'nebula_glow', label: 'Nebulosa Cósmica 🪐' },
    { id: 'sunset_fire', label: 'Pôr do Sol Flamejante 🌅' },
    { id: 'super_nova', label: 'Supernova Explosiva 💥' },
    { id: 'vortex_matrix', label: 'Vórtice Hiperespaço 🌀' },
    { id: 'neon_border', label: 'Borda Neon Infinita 💡' },
    { id: 'eclipse_glow', label: 'Eclipse Solar 🌑' }
  ];

  const scoreOptions = [
    { id: 'large', label: 'Grande e centralizada' },
    { id: 'compact', label: 'Compacta ao lado da mensagem' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#0D0F14] text-[#21222D] dark:text-[#F8F9FA] flex flex-col font-sans relative overflow-x-hidden select-none">
      <div className="w-full max-w-[390px] mx-auto flex flex-col h-full min-h-screen pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#F5F5F7] dark:bg-[#0D0F14]/90 backdrop-blur-md z-30">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#DBDBE5]/40 dark:bg-[#2A2B3D]/40 flex items-center justify-center cursor-pointer active:scale-95 transition-all text-[#21222D] dark:text-[#F8F9FA]"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-lg font-bold text-[#21222D] dark:text-[#F8F9FA] tracking-tight absolute left-1/2 -translate-x-1/2">
            Cores dos cards
          </h1>
          
          <div className="w-10 h-10" />
        </div>

        <div className="px-5 mt-2 flex flex-col gap-6">
          
          {/* Preview */}
          {layout === 'unificado' ? (
            <UnifiedGlowCard
              accentColor={accentColor}
              title={lastActivity?.nome || 'Sessão de Foco'}
              minutes={lastActivity?.duracao_real ? Math.floor(lastActivity.duracao_real / 60) : 45}
              plannedMinutes={lastActivity?.duracao_prevista ? Math.round(lastActivity.duracao_prevista / 60) : 60}
              score={lastActivity?.nota ?? 8.7}
              exits={lastActivity?.saidas ?? 0}
              message={conteudo.fraseIA ? (lastActivity?.mensagem_card || 'isso aí 😎') : undefined}
            />
          ) : (
          <div 

            className="w-full h-auto min-h-[380px] relative overflow-hidden shadow-xl transition-all duration-300" 
            style={{
              ...getCardBgStyle(bgStyle, accentColor, bgOpacity),
              borderRadius: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
            }}
          >
            {/* Localized scrim to protect content from extremely bright backgrounds */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)',
                borderRadius: 'inherit',
                zIndex: 1,
              }}
            />

            {/* Another general scrim to ensure baseline legibility */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.40) 100%)',
                borderRadius: 'inherit',
                zIndex: 1,
              }}
            />

            {bgStyle === 'grain' && (
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                  zIndex: 2,
                }}
              />
            )}
            
            {/* Layer 3: Content */}
            <div className="relative z-10 h-full w-full flex flex-col justify-between flex-1 gap-5">
              
              {/* Discrete Product Branding */}
              <div className="flex items-center justify-between w-full opacity-60">
                <span 
                  className="text-[9px] font-mono tracking-widest text-white uppercase"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                >
                  SESSÃO FOCO
                </span>
                <div className="flex items-center gap-1">
                  <NakorLogo size={12} color="#FFFFFF" />
                  <span 
                    className="text-[10px] font-display font-bold tracking-tight text-white"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                  >
                    Nakor
                  </span>
                </div>
              </div>

              {/* Narrativa Antes -> Depois */}
              {(conteudo.textoAntes || conteudo.textoDepois) && (
                <div className="flex flex-col gap-3 items-center text-center my-auto w-full">
                  {conteudo.textoAntes && (
                    <div 
                      className="flex flex-col items-center p-3 w-full"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.28)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.10)',
                      }}
                    >
                      {/* Pílula ANTES com vidro neutro */}
                      <span 
                        className="text-[9px] font-mono tracking-widest text-white/50 uppercase mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.30)',
                          border: '1px solid rgba(255,255,255,0.14)',
                          textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                        }}
                      >
                        ANTES
                      </span>
                      <p 
                        className="text-white text-[12.5px] font-medium italic leading-relaxed m-0"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                      >
                        "{lastActivity?.texto_antes || 'Estava com pouca energia...'}"
                      </p>
                    </div>
                  )}

                  {conteudo.textoAntes && conteudo.textoDepois && (
                    <div className="flex flex-col items-center text-white/40 my-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {conteudo.textoDepois && (
                    <div 
                      className="flex flex-col items-center p-3 w-full"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.28)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.10)',
                      }}
                    >
                      {/* Pílula DEPOIS com vidro neutro */}
                      <span 
                        className="text-[9px] font-mono tracking-widest text-white/50 uppercase mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.30)',
                          border: '1px solid rgba(255,255,255,0.14)',
                          textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                        }}
                      >
                        DEPOIS
                      </span>
                      <p 
                        className="text-white text-[12.5px] font-medium italic leading-relaxed m-0"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                      >
                        "{lastActivity?.texto_depois || 'Me senti muito melhor...'}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Badges/Chips */}
              {(conteudo.streak || conteudo.selo) && (
                 <div className="flex items-center gap-2.5 justify-center z-10">
                   {conteudo.streak && (
                     <div 
                       className="flex items-center gap-1 px-3 h-6 rounded-full text-white text-[10px] font-bold"
                       style={{
                         backgroundColor: 'rgba(0, 0, 0, 0.30)',
                         border: '1px solid rgba(255, 255, 255, 0.14)',
                         backdropFilter: 'blur(4px)',
                         textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                       }}
                     >
                       <span className="text-[11px]">🔥</span>
                       <span>{lastActivity?.streak || 1} {lastActivity?.streak === 1 ? 'dia' : 'dias'}</span>
                     </div>
                   )}
                   {conteudo.selo && (
                     <div 
                       className="flex items-center gap-1.5 px-3 h-6 rounded-full text-white text-[10px] font-bold"
                       style={{
                         backgroundColor: 'rgba(0, 0, 0, 0.30)',
                         border: '1px solid rgba(255, 255, 255, 0.14)',
                         backdropFilter: 'blur(4px)',
                         textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                       }}
                     >
                       <span>Nível {lastActivity?.nivel || 'Iniciante'}</span>
                     </div>
                   )}
                 </div>
              )}

              {/* Score Block (Hero with hierarchical styling) */}
              {(conteudo.notaIA || conteudo.fraseIA) && (
                <div className="mt-auto pt-2 flex flex-col items-center justify-center text-center z-10">
                  {conteudo.notaIA && (
                    <div className="flex flex-col items-center">
                      <span 
                        className="text-[9px] font-mono tracking-widest text-white/60 uppercase mb-1"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                      >
                        NOTA DA SESSÃO
                      </span>
                      <div 
                        className="font-extrabold tracking-tighter"
                        style={{ 
                          color: '#FFFFFF', 
                          fontSize: scoreStyle === 'large' ? '56px' : '40px',
                          textShadow: `0 2px 8px rgba(0,0,0,0.6), 0 0 15px ${hexToRgba(accentColor, 0.65)}`,
                          lineHeight: 1
                        }}
                      >
                        {lastActivity?.nota ? lastActivity.nota.toFixed(1) : '8.7'}
                      </div>
                    </div>
                  )}
                  {conteudo.fraseIA && (
                    <div 
                      className="text-white font-medium text-[12px] mt-1.5 max-w-[240px] leading-snug"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                    >
                      {lastActivity?.mensagem_card || 'isso aí 😎'}
                    </div>
                  )}
                </div>
              )}

              {/* Discrete Footer Metadata */}
              {(conteudo.duracao || conteudo.horario) && (
                <div 
                  className="flex justify-between items-center mt-auto pt-3 border-t border-white/10 w-full text-[9px] text-white/75 tracking-wider font-mono"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                >
                  {conteudo.duracao ? (
                    <div className="flex items-center gap-1 opacity-70">
                      <Clock size={11} strokeWidth={1.75} />
                      <span>{lastActivity?.duracao_real ? Math.floor(lastActivity.duracao_real / 60) : 25} MIN</span>
                    </div>
                  ) : <div />}
                  {conteudo.horario ? (
                    <span className="opacity-70">{lastActivity?.timestamp ? new Date(lastActivity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '14:30'}</span>
                  ) : <div />}
                </div>
              )}

            </div>
          </div>
          )}

          {/* Formato do Card */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Formato dos cards</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'trio', label: '3 cards alinhados', hint: 'Antes • Depois • Nota' },
                { id: 'unificado', label: 'Card único glow', hint: 'Tudo em um só card' },
              ].map((opt) => {
                const isSelected = layout === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => setLayout(opt.id)}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-start gap-2 p-3 rounded-[20px] border-2 text-left cursor-pointer bg-white dark:bg-[#151622] transition-all"
                    style={{
                      borderColor: isSelected ? accentColor : 'rgba(219,219,229,0.5)',
                      boxShadow: isSelected ? `0 10px 20px -6px ${hexToRgba(accentColor, 0.3)}` : 'none',
                    }}
                  >
                    <div className="w-full h-14 flex items-center justify-center gap-1.5">
                      {opt.id === 'trio' ? (
                        <>
                          <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.35) }} />
                          <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.6) }} />
                          <div className="w-4 h-11 rounded-md" style={{ backgroundColor: hexToRgba(accentColor, 0.9) }} />
                        </>
                      ) : (
                        <div
                          className="w-14 h-14 rounded-2xl"
                          style={{
                            backgroundColor: '#0A0A0C',
                            backgroundImage: `radial-gradient(120% 85% at 50% 110%, ${hexToRgba(accentColor, 0.95)} 0%, transparent 75%)`,
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold m-0 ${isSelected ? 'text-[#21222D] dark:text-[#F8F9FA]' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-neutral-400 m-0">{opt.hint}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>


          {/* Seleção de Cor */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Cor de Destaque</span>
            <div className="bg-white dark:bg-[#151622] rounded-[24px] p-5 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
              <div className="grid grid-cols-6 gap-3">
                {colors.map((c) => (
                  <button 
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    className="aspect-square rounded-full transition-all flex items-center justify-center relative shadow-sm cursor-pointer"
                    style={{ 
                      backgroundColor: c.hex,
                      border: accentColor === c.hex ? '3px solid #21222D' : '2px solid transparent',
                      transform: accentColor === c.hex ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {accentColor === c.hex && <Check size={14} className={c.hex === '#FFFFFF' ? 'text-black' : 'text-white'} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estilo do Fundo */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Estilo do Fundo</span>
            <div className="w-full overflow-x-auto pb-3 pt-1 px-4 -mx-4 sm:mx-0 sm:px-0 no-scrollbar">
              <div className="flex gap-3 min-w-max">
                {bgOptions.map((opt) => {
                  const isSelected = bgStyle === opt.id;
                  return (
                    <motion.button 
                      key={opt.id}
                      onClick={() => setBgStyle(opt.id)}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        scale: isSelected ? 1.06 : 1,
                        borderColor: isSelected ? accentColor : 'rgba(219, 219, 229, 0.5)',
                        boxShadow: isSelected 
                          ? `0 10px 20px -5px ${hexToRgba(accentColor, 0.25)}, 0 0 10px 1px ${hexToRgba(accentColor, 0.15)}` 
                          : '0 1px 2px 0 rgba(0,0,0,0.05)',
                        backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="flex flex-col items-center p-3 rounded-[20px] w-24 shrink-0 transition-all border-2 text-center cursor-pointer outline-none"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md flex items-center justify-center">
                        <div style={{
                          ...getCardBgStyle(opt.id, accentColor, 100),
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: 'inherit',
                          zIndex: 0,
                          pointerEvents: 'none',
                        }} />
                        {opt.id === 'grain' && (
                          <div 
                            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none z-10"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                          />
                        )}
                        {/* Selected indicator overlay icon */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#34117E]/10 flex items-center justify-center z-20">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border border-[#34117E]/10">
                              <Check size={12} className="text-[#34117E] dark:text-[#C4B5FD]" strokeWidth={3.5} />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] leading-tight font-bold mt-2.5 line-clamp-2 h-7 overflow-hidden ${
                        isSelected ? 'text-[#21222D] dark:text-[#F8F9FA]' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {opt.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          
          {/* Opacidade do Fundo */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Opacidade do fundo do card</span>
            <div className="bg-white dark:bg-[#151622] rounded-[24px] p-5 flex flex-col gap-4 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Intensidade do fundo</span>
                <span className="text-[#958CE8] font-bold">{bgOpacity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={bgOpacity}
                onChange={(e) => setBgOpacity(Number(e.target.value))}
                className="w-full accent-[#958CE8] cursor-pointer"
              />
            </div>
          </div>

          {/* Estilo da Nota */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">Estilo da Nota</span>
            <div className="bg-white dark:bg-[#151622] rounded-[24px] p-4 flex flex-col border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
              {scoreOptions.map((opt, idx) => {
                const isSelected = scoreStyle === opt.id;
                return (
                  <React.Fragment key={opt.id}>
                    <button 
                      onClick={() => setScoreStyle(opt.id)}
                      className="w-full py-4 px-2 flex items-center gap-3 text-left cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'border-[#958CE8]' : 'border-[#DBDBE5] dark:border-[#2A2B3D]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#958CE8] rounded-full" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 relative overflow-hidden shadow-sm"
                          style={{
                            backgroundColor: `rgba(0, 0, 0, ${(bgOpacity !== undefined ? bgOpacity : 80) / 100})`,
                            backgroundImage: opt.id === 'gradient' ? `radial-gradient(circle at 50% 0%, ${accentColor}44 0%, transparent 70%)` : 'none',
                          }}
                        >
                          {opt.id === 'grain' && (
                            <div 
                              className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                            />
                          )}
                        </div>
                        <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">{opt.label}</span>
                      </div>
                    </button>
                    {idx < scoreOptions.length - 1 && (
                      <div className="w-full h-px bg-[#DBDBE5]/30 dark:bg-[#2A2B3D]/30" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          
          {/* Conteúdo dos Cards */}
          <div className="flex flex-col gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider pl-4">O que aparecer nos cards</span>
            <div className="bg-white dark:bg-[#151622] rounded-[24px] p-4 flex flex-col gap-4 border border-[#DBDBE5]/40 dark:border-[#2A2B3D]/40 shadow-sm">
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Texto do Antes</span>
                  <span className="text-neutral-400 text-xs font-semibold">Seu relato antes da sessão</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, textoAntes: !prev.textoAntes}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.textoAntes ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.textoAntes ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Texto do Depois</span>
                  <span className="text-neutral-400 text-xs font-semibold">O que aconteceu de verdade</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, textoDepois: !prev.textoDepois}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.textoDepois ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.textoDepois ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Nota da IA</span>
                    <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-[#21222D] dark:text-[#F8F9FA] ml-1 font-bold">🔒</span>
                  </div>
                  <span className="text-neutral-400 text-xs font-semibold">Sua pontuação da sessão</span>
                </div>
                <div className="w-12 h-6 rounded-full bg-[#958CE8] relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 translate-x-7" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Frase da IA</span>
                  <span className="text-neutral-400 text-xs font-semibold">Mensagem gerada pela IA</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, fraseIA: !prev.fraseIA}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.fraseIA ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.fraseIA ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Streak</span>
                  <span className="text-neutral-400 text-xs font-semibold">Seus dias seguidos de foco 🔥</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, streak: !prev.streak}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.streak ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.streak ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Selo atual</span>
                  <span className="text-neutral-400 text-xs font-semibold">Seu nível no Nakor</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, selo: !prev.selo}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.selo ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.selo ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Horário de conclusão</span>
                  <span className="text-neutral-400 text-xs font-semibold">Hora que você terminou</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, horario: !prev.horario}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.horario ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.horario ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[#21222D] dark:text-[#F8F9FA] text-[15px] font-semibold">Duração da sessão</span>
                  <span className="text-neutral-400 text-xs font-semibold">Quanto tempo focou</span>
                </div>
                <button 
                  onClick={() => setConteudo(prev => ({...prev, duracao: !prev.duracao}))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${conteudo.duracao ? 'bg-[#958CE8]' : 'bg-[#DBDBE5] dark:bg-[#2A2B3D]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${conteudo.duracao ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full h-[56px] rounded-full bg-[#34117E] hover:bg-[#2C0E6B] text-white font-bold text-[16px] flex items-center justify-center mt-2 mb-4 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            Salvar estilo
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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#21222D] border border-white/10 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 pointer-events-none whitespace-nowrap text-center max-w-[350px]"
          >
            ✅ Estilo salvo! Seus próximos cards usarão esse visual.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
