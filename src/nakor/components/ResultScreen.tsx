import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, Home, Clock, User, Info } from 'lucide-react';
import { toPng } from 'html-to-image';
import { UnifiedGlowCard } from './UnifiedGlowCard';
import { AuraDomeCard } from './AuraDomeCard';
import { WidgetStackCard } from './WidgetStackCard';

interface ResultScreenProps {
  onNavigate: (view: string) => void;
  historicActivity?: any;
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

function getInsetShadowOnly(styleId: string, accentColor: string, opacity: number): string {
  const bgOpacityVal = opacity / 100;
  switch (styleId) {
    case 'neon_radial':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.4 * bgOpacityVal)}`;
    case 'aurora_mesh':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.25 * bgOpacityVal)}`;
    case 'cyber_grid':
    case 'laser_split':
    case 'vortex_matrix':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'nebula_glow':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'sunset_fire':
      return `inset 0 0 20px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    case 'super_nova':
      return `inset 0 0 25px ${hexToRgba(accentColor, 0.35 * bgOpacityVal)}`;
    case 'neon_border':
      return `inset 0 0 12px ${hexToRgba(accentColor, 0.3 * bgOpacityVal)}`;
    default:
      return 'none';
  }
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

export function ResultScreen({ onNavigate, historicActivity }: ResultScreenProps) {
  const [activity, setActivity] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string>('');
  const exportRef = useRef<HTMLDivElement>(null);
  const hasSavedHistory = useRef(false);

  // Calculate fallback streak and level
  const currentLevel = useMemo(() => {
    const historyRaw = localStorage.getItem('nakor_historico');
    let history: any[] = [];
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch(e) {}
    }
    const totalSecs = history.reduce((acc: number, item: any) => acc + (item.duracao_real || 0), 0);
    const totalHours = Math.floor(totalSecs / 3600);
    
    // Streak
    let currentStreak = 0;
    if (history.length > 0) {
      const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
      const uniqueDays = new Set<string>();
      sorted.forEach(item => {
        const d = new Date(item.timestamp);
        uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      });
      const dayList = Array.from(uniqueDays).map(dStr => new Date(dStr));
      if (dayList.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const firstActiveDay = dayList[0];
        firstActiveDay.setHours(0, 0, 0, 0);
        if (firstActiveDay >= yesterday) {
          currentStreak = 1;
          let currentDay = firstActiveDay;
          for (let i = 1; i < dayList.length; i++) {
            const prevDay = new Date(currentDay);
            prevDay.setDate(currentDay.getDate() - 1);
            prevDay.setHours(0, 0, 0, 0);
            const checkDay = dayList[i];
            checkDay.setHours(0, 0, 0, 0);
            if (checkDay.getTime() === prevDay.getTime()) {
              currentStreak++;
              currentDay = checkDay;
            } else {
              break;
            }
          }
        }
      }
    }

    if (totalHours >= 500) return 'Lenda';
    if (totalHours >= 250) return 'Elite';
    if (totalHours >= 100) return 'Dedicado';
    if (totalHours >= 25) return 'Focado';
    if (currentStreak >= 7) return 'Consistente';
    if (history.length > 0) return 'Estreante';
    return 'Iniciante';
  }, []);

  const currentStreak = useMemo(() => {
    const historyRaw = localStorage.getItem('nakor_historico');
    let history: any[] = [];
    if (historyRaw) {
      try { history = JSON.parse(historyRaw); } catch(e) {}
    }
    if (history.length === 0) return 1;
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDays = new Set<string>();
    sorted.forEach(item => {
      const d = new Date(item.timestamp);
      uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    const dayList = Array.from(uniqueDays).map(dStr => new Date(dStr));
    if (dayList.length === 0) return 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const firstActiveDay = dayList[0];
    firstActiveDay.setHours(0, 0, 0, 0);
    if (firstActiveDay < yesterday) return 1;
    
    let currentStreak = 1;
    let currentDay = firstActiveDay;
    for (let i = 1; i < dayList.length; i++) {
      const prevDay = new Date(currentDay);
      prevDay.setDate(currentDay.getDate() - 1);
      prevDay.setHours(0, 0, 0, 0);
      const checkDay = dayList[i];
      checkDay.setHours(0, 0, 0, 0);
      if (checkDay.getTime() === prevDay.getTime()) {
        currentStreak++;
        currentDay = checkDay;
      } else {
        break;
      }
    }
    return currentStreak;
  }, []);

  const [estiloCards, setEstiloCards] = useState<any>({
    accentColor: '#A5CE00',
    bgStyle: 'gradient',
    scoreStyle: 'large',
    layout: 'trio',
    bgOpacity: 80,
    conteudo: {
      textoAntes: true,
      textoDepois: true,
      notaIA: true,
      fraseIA: true,
      streak: true,
      selo: true,
      horario: false,
      duracao: true
    }
  });

  useEffect(() => {
    try {
      const savedStyle = localStorage.getItem('nakor_estilo_cards');
      if (savedStyle) {
        setEstiloCards((prev: any) => ({ ...prev, ...JSON.parse(savedStyle) }));
      }
    } catch (e) {}

    if (historicActivity) {
      setActivity(historicActivity);
      setEvaluation({
        nota: historicActivity.nota || 0,
        mensagem_resultado: historicActivity.mensagem_resultado || 'Bom trabalho na sua sessão!',
        mensagem_card: historicActivity.mensagem_card || 'Foco concluído com sucesso.'
      });
      return;
    }

    let currentActivity: any = null;
    let currentEvaluation: any = null;

    const activityData = localStorage.getItem('nakor_atividade_atual');
    if (activityData) {
      try {
        currentActivity = JSON.parse(activityData);
        setActivity(currentActivity);
      } catch (e) {
        console.error('Failed to parse activity data');
      }
    }

    const evalData = localStorage.getItem('nakor_avaliacao');
    if (evalData) {
      try {
        currentEvaluation = JSON.parse(evalData);
        setEvaluation(currentEvaluation);
      } catch (e) {
        console.error('Failed to parse evaluation data');
      }
    }

    if (currentActivity && currentEvaluation && !hasSavedHistory.current) {
      hasSavedHistory.current = true;
      try {
        const historyRaw = localStorage.getItem('nakor_historico');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        
        // Prevent duplicate saves by checking if this exact activity + timestamp exists
        // Since we don't have a unique ID, we'll check if the last item is exactly the same one
        const isDuplicate = history.length > 0 && 
                            history[0].nome === currentActivity.nome && 
                            history[0].texto_depois === currentActivity.texto_depois &&
                            Date.now() - history[0].timestamp < 60000; // Less than 1 minute ago

        if (!isDuplicate) {
          const durationHours = (currentActivity.duracao_real || 0) / 3600;
          let earnedCoins = Math.floor(durationHours * 50);
          if ((currentEvaluation.nota || 0) > 9) earnedCoins += 150;

          const newHistoryItem = {
            id: Date.now().toString(),
            nome: currentActivity.nome || 'Sessão de Foco',
            duracao_real: currentActivity.duracao_real || 0,
            nota: currentEvaluation.nota || 0,
            saidas: currentActivity.saidas || 0,
            texto_antes: currentActivity.texto_antes || '',
            texto_depois: currentActivity.texto_depois || '',
            mensagem_card: currentEvaluation.mensagem_card || '',
            moedas: earnedCoins,
            timestamp: Date.now()
          };
          history.unshift(newHistoryItem);
          localStorage.setItem('nakor_historico', JSON.stringify(history));

          // Credita as moedas ganhas na sessão
          const currentCoins = parseInt(localStorage.getItem('nakor_coins') || '0', 10) || 0;
          localStorage.setItem('nakor_coins', String(currentCoins + earnedCoins));
        }
      } catch (err) {
        console.error('Failed to save history', err);
      }
    }
  }, []);

  const cardAntesRef = useRef<HTMLDivElement>(null);

  const cardDepoisRef = useRef<HTMLDivElement>(null);
  const cardScoreRef = useRef<HTMLDivElement>(null);
  const cardUnifiedRef = useRef<HTMLDivElement>(null);

  const userStreak = useMemo(() => {
    try {
      const userRaw = localStorage.getItem('nakor_user');
      if (userRaw && userRaw.startsWith('{')) {
        const u = JSON.parse(userRaw);
        if (u && u.streak !== undefined) return u.streak;
      }
    } catch (e) {}
    return activity?.streak ?? currentStreak;
  }, [activity, currentStreak]);

  const userSelo = useMemo(() => {
    try {
      const userRaw = localStorage.getItem('nakor_user');
      if (userRaw && userRaw.startsWith('{')) {
        const u = JSON.parse(userRaw);
        if (u && (u.selo_atual || u.selo)) return u.selo_atual || u.selo;
      }
    } catch (e) {}
    return activity?.nivel ?? currentLevel;
  }, [activity, currentLevel]);

  const generateCombinedBlob = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    try {
      const imgs: HTMLImageElement[] = [];

      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(new Error('Failed to load image from dataURL'));
          img.src = url;
        });
      };

      // Layout unificado: captura apenas o card único
      if (estiloCards.layout === 'unificado' && cardUnifiedRef.current) {
        const el = cardUnifiedRef.current;
        // Remove a sombra externa durante a captura: ela aparece recortada nos
        // cantos arredondados e cria um "quadrado" translúcido em volta do card.
        const prevShadow = el.style.boxShadow;
        el.style.boxShadow = 'none';
        let dataUrl: string;
        try {
          dataUrl = await toPng(el, {
            cacheBust: true,
            pixelRatio: 3,
            width: el.offsetWidth,
            height: el.offsetHeight,
            backgroundColor: undefined,
          });
        } finally {
          el.style.boxShadow = prevShadow;
        }
        const img = await loadImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const c = canvas.getContext('2d');
        if (!c) throw new Error('Could not get 2d context');
        c.drawImage(img, 0, 0);
        const finalUrl = canvas.toDataURL('image/png');
        return new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob ? { blob, dataUrl: finalUrl } : null), 'image/png');
        });
      }


      // Measure maximum height of active card containers to align them perfectly side-by-side!
      let maxCardHeight = 280;
      if (estiloCards.conteudo?.textoAntes && cardAntesRef.current) {
        maxCardHeight = Math.max(maxCardHeight, cardAntesRef.current.offsetHeight);
      }
      if (estiloCards.conteudo?.textoDepois && cardDepoisRef.current) {
        maxCardHeight = Math.max(maxCardHeight, cardDepoisRef.current.offsetHeight);
      }
      if (cardScoreRef.current) {
        maxCardHeight = Math.max(maxCardHeight, cardScoreRef.current.offsetHeight);
      }

      const bgOpacityValForCapt = estiloCards.bgOpacity !== undefined ? estiloCards.bgOpacity : 80;
      const accentColorForCapt = estiloCards.accentColor || '#A5CE00';

      if (estiloCards.conteudo?.textoAntes && cardAntesRef.current) {
        const width = cardAntesRef.current.offsetWidth;
        const dataUrl = await toPng(cardAntesRef.current, { 
          width,
          height: maxCardHeight,
          pixelRatio: 2, 
          cacheBust: true,
          skipFonts: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            boxShadow: getInsetShadowOnly(estiloCards.bgStyle || 'gradient', accentColorForCapt, bgOpacityValForCapt),
            margin: '0',
            height: `${maxCardHeight}px`,
            width: `${width}px`,
          }
        });
        const img = await loadImage(dataUrl);
        imgs.push(img);
      }
      if (estiloCards.conteudo?.textoDepois && cardDepoisRef.current) {
        const width = cardDepoisRef.current.offsetWidth;
        const dataUrl = await toPng(cardDepoisRef.current, { 
          width,
          height: maxCardHeight,
          pixelRatio: 2, 
          cacheBust: true,
          skipFonts: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            boxShadow: getInsetShadowOnly(estiloCards.bgStyle || 'gradient', accentColorForCapt, bgOpacityValForCapt),
            margin: '0',
            height: `${maxCardHeight}px`,
            width: `${width}px`,
          }
        });
        const img = await loadImage(dataUrl);
        imgs.push(img);
      }
      if (cardScoreRef.current) {
        const width = cardScoreRef.current.offsetWidth;
        const dataUrl = await toPng(cardScoreRef.current, { 
          width,
          height: maxCardHeight,
          pixelRatio: 2, 
          cacheBust: true,
          skipFonts: true,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            boxShadow: getInsetShadowOnly(estiloCards.bgStyle || 'gradient', accentColorForCapt, bgOpacityValForCapt),
            margin: '0',
            height: `${maxCardHeight}px`,
            width: `${width}px`,
          }
        });
        const img = await loadImage(dataUrl);
        imgs.push(img);
      }

      if (imgs.length === 0) {
        return null;
      }

      // Calculate combined canvas size
      const gap = 24 * 2; // gap of 24 CSS pixels scaled by 2
      const totalWidth = imgs.reduce((sum, img) => sum + img.naturalWidth, 0) + gap * (imgs.length - 1);
      const maxHeight = Math.max(...imgs.map(img => img.naturalHeight));

      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = totalWidth;
      combinedCanvas.height = maxHeight;
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get 2d context');
      }

      ctx.clearRect(0, 0, totalWidth, maxHeight);

      let currentX = 0;
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        ctx.drawImage(img, currentX, 0, img.naturalWidth, img.naturalHeight);
        currentX += img.naturalWidth + gap;
      }

      const dataUrl = combinedCanvas.toDataURL('image/png');

      return new Promise((resolve) => {
        combinedCanvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
          } else {
            resolve({ blob, dataUrl });
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('Error generating combined cards blob:', err);
      return null;
    }
  };

  const handleCopyCardsImage = async () => {
    setIsCapturing(true);
    setCopyFeedback('Gerando imagem... 📸');
    try {
      // 1. Try modern clipboard write with raw Promise (fixes Safari user-gesture block)
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        try {
          const imagePromise = (async () => {
            const res = await generateCombinedBlob();
            if (!res) throw new Error('Blob generation failed');
            return res.blob;
          })();

          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': imagePromise })
          ]);

          setIsCopied(true);
          setCopyFeedback('Cards copiados! ✅');
          setTimeout(() => {
            setIsCopied(false);
            setCopyFeedback('');
          }, 4000);
          setIsCapturing(false);
          return;
        } catch (promiseErr) {
          console.warn('Clipboard Promise write failed, trying fallback:', promiseErr);
        }
      }

      // 2. Generate standard blob if needed
      const result = await generateCombinedBlob();
      if (!result) {
        setCopyFeedback('Erro ao gerar imagem ❌');
        setTimeout(() => setCopyFeedback(''), 3000);
        setIsCapturing(false);
        return;
      }

      const { blob, dataUrl } = result;

      // 3. Try standard clipboard write
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        try {
          const data = [new ClipboardItem({ 'image/png': blob })];
          await navigator.clipboard.write(data);
          setIsCopied(true);
          setCopyFeedback('Cards copiados! ✅');
          setTimeout(() => {
            setIsCopied(false);
            setCopyFeedback('');
          }, 4000);
          setIsCapturing(false);
          return;
        } catch (clipboardErr) {
          console.error('Standard clipboard write failed:', clipboardErr);
        }
      }

      // 4. Try Web Share API (native share dialog contains a "Copy" button on iOS and Android)
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], 'nakor-cards.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Nakor - Meus Cards de Foco',
              text: 'Confira minha evolução focada de hoje no Nakor!',
            });
            setCopyFeedback('Compartilhado! ✅');
            setTimeout(() => setCopyFeedback(''), 3000);
            setIsCapturing(false);
            return;
          }
        } catch (shareErr) {
          console.error('Web Share failed:', shareErr);
        }
      }

      // 5. Hard fallback: Show a beautiful touch-to-copy modal! No forced download.
      setGeneratedImgUrl(dataUrl);
      setShowShareModal(true);
      setCopyFeedback('');
    } catch (err) {
      console.error('Error generating combined cards image:', err);
      setCopyFeedback('Erro ao copiar imagem ❌');
      setTimeout(() => setCopyFeedback(''), 4000);
    } finally {
      setIsCapturing(false);
    }
  };

  const minutesReal = activity?.duracao_real ? Math.floor(activity.duracao_real / 60) : 0;

  const bgOpacityVal = estiloCards.bgOpacity !== undefined ? estiloCards.bgOpacity : 80;
  const accentColor = estiloCards.accentColor || '#A5CE00';

  const baseCardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#FFFFFF] font-sans flex flex-col items-center relative overflow-y-auto pb-32 pt-10">
      
      {/* Main compact metrics wrapper */}
      <div className="w-full max-w-[390px] px-6 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8 relative">
          <h1 className="text-[18px] font-bold w-full text-center text-white">
            {historicActivity ? 'Detalhes da Atividade' : 'Atividade concluída'}
          </h1>
          <span className="text-xl absolute right-0">🎉</span>
        </div>

        {/* Metrics Card */}
        <div className="w-full bg-[#0d0f12]/60 backdrop-blur-md rounded-[24px] p-5 mb-6 flex justify-between items-center border border-white/[0.04] shadow-md">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold text-white mb-0.5">{minutesReal}min</span>
            <span className="text-neutral-400 text-[11px] font-medium">duração</span>
          </div>
          <div className="w-px h-10 bg-white/[0.08]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold mb-0.5" style={{ color: accentColor }}>
              {evaluation ? evaluation.nota.toFixed(1) : '-'}
            </span>
            <span className="text-neutral-400 text-[11px] font-medium">sua nota</span>
          </div>
          <div className="w-px h-10 bg-white/[0.08]" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xl font-bold text-white mb-0.5">
              {activity?.saidas === 1 ? '1 saída' : `${activity?.saidas || 0} saídas`}
            </span>
            <span className="text-neutral-400 text-[11px] font-medium">distrações</span>
          </div>
        </div>

        {/* Score & AI Message Card */}
        <div className="w-full bg-[#0d0f12]/60 backdrop-blur-md rounded-[24px] p-6 mb-8 flex flex-col items-center text-center border border-white/[0.04] shadow-md">
          <span className="text-neutral-400 text-sm mb-2">sua nota</span>
          
          <div className="relative inline-block mb-4">
            <span className="text-[72px] font-bold text-white leading-none tracking-tighter">
              {evaluation?.nota?.toFixed(1) || '0.0'}
            </span>
            <div className="w-full h-1 mt-2 rounded-full opacity-50" style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
          </div>
          <p className="text-white italic text-[15px] mb-6 px-4">
            {evaluation?.mensagem_resultado || '...'}
          </p>

          <span className="text-neutral-500 dark:text-neutral-400 text-[10px]">gerado por IA com base no seu relato</span>
        </div>
      </div>

      {/* Your Cards Section (Responsive side-by-side or column layout) */}
      <div className="w-full max-w-4xl px-6 mb-8 mx-auto">
        <div className="flex justify-between items-center mb-6 max-w-[390px] mx-auto md:max-w-none">
          <h3 className="text-white font-semibold text-[15px]">Seus cards de progresso</h3>
          <Info size={16} className="text-neutral-500 dark:text-neutral-400" />
        </div>
        
        {estiloCards.layout === 'unificado' ? (
        <div className="w-full flex justify-center">
          <UnifiedGlowCard
            ref={cardUnifiedRef}
            accentColor={accentColor}
            title={activity?.nome || 'Sessão de Foco'}
            minutes={minutesReal}
            plannedMinutes={activity?.duracao_prevista ? Math.round(activity.duracao_prevista / 60) : minutesReal}
            score={evaluation?.nota ?? activity?.nota ?? 0}
            exits={activity?.saidas ?? 0}
            streak={userStreak}
            message={estiloCards.conteudo?.fraseIA !== false ? (evaluation?.mensagem_card || activity?.mensagem_card) : undefined}
          />
        </div>
        ) : (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full">
          {/* Card 1 (Antes) */}
          {estiloCards.conteudo?.textoAntes && (
            <div 
              ref={cardAntesRef}
              style={{
                ...getCardBgStyle(estiloCards.bgStyle || 'gradient', accentColor, bgOpacityVal),
                borderRadius: '28px',
                width: '100%',
                maxWidth: '320px',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                margin: '0 auto',
              }}
              className="flex-1"
            >

              {/* Localized scrim to protect content from extremely bright backgrounds */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)',
                  borderRadius: 'inherit',
                }}
              />

              {/* Layer 2: Scrim overlay for readability */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{
                  backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.40) 100%)',
                  borderRadius: 'inherit',
                }}
              />

              {estiloCards.bgStyle === 'grain' && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  opacity: 0.03, mixBlendMode: 'overlay', pointerEvents: 'none',
                  zIndex: 15,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                }} />
              )}
              
              {/* Layer 3: Content */}
              <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 gap-5">
                {/* Discrete Product Branding */}
                <div className="flex items-center justify-between w-full opacity-60">
                  <span 
                    className="text-[9px] font-mono tracking-widest text-white uppercase"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                  >
                    SESSÃO FOCO
                  </span>
                </div>

                {/* Narrative Antes (Plaque) */}
                <div className="flex flex-col items-center text-center my-auto w-full">
                  <div 
                    className="flex flex-col items-center p-4 w-full"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.28)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    {/* Glass badge chip */}
                    <span 
                      className="text-[9px] font-mono tracking-widest text-white/50 uppercase mb-1.5 px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.30)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                      }}
                    >
                      ANTES
                    </span>
                    <p 
                      className="text-white text-[13px] font-medium italic leading-relaxed m-0"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                    >
                      "{activity?.texto_antes ? activity.texto_antes : 'Estava com pouca energia...'}"
                    </p>
                  </div>
                </div>

                {/* Discrete Footer Metadata */}
                <div 
                  className="flex justify-between items-center mt-auto pt-3 border-t border-white/10 w-full text-[9px] text-white/75 tracking-wider font-mono"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                >
                  <div className="flex items-center gap-1 opacity-70">
                    <Clock size={11} strokeWidth={1.75} />
                    <span>{activity?.duracao_real ? Math.floor(activity.duracao_real / 60) : 25} MIN</span>
                  </div>
                  
                </div>
              </div>
            </div>
          )}

          {/* Card 2 (Depois) */}
          {estiloCards.conteudo?.textoDepois && (
            <div 
              ref={cardDepoisRef}
              style={{
                ...getCardBgStyle(estiloCards.bgStyle || 'gradient', accentColor, bgOpacityVal),
                borderRadius: '28px',
                width: '100%',
                maxWidth: '320px',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                margin: '0 auto',
              }}
              className="flex-1"
            >

              {/* Localized scrim to protect content from extremely bright backgrounds */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)',
                  borderRadius: 'inherit',
                }}
              />

              {/* Layer 2: Scrim overlay for readability */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{
                  backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.40) 100%)',
                  borderRadius: 'inherit',
                }}
              />

              {estiloCards.bgStyle === 'grain' && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  opacity: 0.03, mixBlendMode: 'overlay', pointerEvents: 'none',
                  zIndex: 15,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                }} />
              )}
              
              {/* Layer 3: Content */}
              <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 gap-5">
                {/* Discrete Product Branding */}
                <div className="flex items-center justify-between w-full opacity-60">
                  <span 
                    className="text-[9px] font-mono tracking-widest text-white uppercase"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                  >
                    SESSÃO FOCO
                  </span>
                </div>

                {/* Narrative Depois (Plaque) */}
                <div className="flex flex-col items-center text-center my-auto w-full">
                  <div 
                    className="flex flex-col items-center p-4 w-full"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.28)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    {/* Glass badge chip */}
                    <span 
                      className="text-[9px] font-mono tracking-widest text-white/50 uppercase mb-1.5 px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.30)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                      }}
                    >
                      DEPOIS
                    </span>
                    <p 
                      className="text-white text-[13px] font-medium italic leading-relaxed m-0"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                    >
                      "{activity?.texto_depois ? activity.texto_depois : 'Sessão concluída com sucesso!'}"
                    </p>
                  </div>
                </div>

                {/* Discrete Footer Metadata */}
                <div 
                  className="flex justify-between items-center mt-auto pt-3 border-t border-white/10 w-full text-[9px] text-white/75 tracking-wider font-mono"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                >
                  <div className="flex items-center gap-1 opacity-70">
                    <Clock size={11} strokeWidth={1.75} />
                    <span>{activity?.duracao_real ? Math.floor(activity.duracao_real / 60) : 25} MIN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 3 (Score) */}
          <div 
            ref={cardScoreRef}
            style={{
              ...getCardBgStyle(estiloCards.bgStyle || 'gradient', accentColor, bgOpacityVal),
              borderRadius: '28px',
              width: '100%',
              maxWidth: '320px',
              minHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              margin: '0 auto',
            }}
            className="flex-1"
          >

            {/* Localized scrim to protect content from extremely bright backgrounds */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.35) 0%, transparent 80%)',
                borderRadius: 'inherit',
              }}
            />

            {/* Layer 2: Scrim overlay for readability */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.40) 100%)',
                borderRadius: 'inherit',
              }}
            />

            {estiloCards.bgStyle === 'grain' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.03, mixBlendMode: 'overlay', pointerEvents: 'none',
                zIndex: 15,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              }} />
            )}
            
            {/* Layer 3: Content */}
            <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 gap-5">
              {/* Discrete Product Branding */}
              <div className="flex items-center justify-between w-full opacity-60">
                <span 
                  className="text-[9px] font-mono tracking-widest text-white uppercase"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                >
                  AVALIAÇÃO IA
                </span>
              </div>

              {/* Score Block */}
              <div className="flex flex-col items-center justify-center text-center my-auto w-full">
                {estiloCards.conteudo?.notaIA !== false && (
                  <div className="flex flex-col items-center">
                    <span 
                      className="text-[9px] font-mono tracking-widest text-white/60 uppercase mb-1"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
                    >
                      NOTA DA SESSÃO
                    </span>
                    <span style={{ 
                      fontSize: estiloCards.scoreStyle === 'large' ? '56px' : '40px', 
                      fontWeight: 900, 
                      color: '#FFFFFF', 
                      lineHeight: 1, 
                      marginBottom: '12px',
                      textShadow: `0 2px 8px rgba(0,0,0,0.6), 0 0 15px ${hexToRgba(accentColor, 0.65)}`
                    }}>
                      {evaluation?.nota?.toFixed(1) || activity?.nota?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                )}
                
                {estiloCards.conteudo?.fraseIA !== false && (
                  <p style={{ 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    color: 'rgba(255, 255, 255, 0.85)', 
                    lineHeight: 1.5, 
                    textAlign: 'center',
                    margin: 0,
                    textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)'
                  }} className="max-w-[240px]">
                    {evaluation?.mensagem_card || activity?.mensagem_card || "Mandou bem!"}
                  </p>
                )}
              </div>

              {/* Badges/Chips */}
              {(estiloCards.conteudo?.streak || estiloCards.conteudo?.selo) && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                  {estiloCards.conteudo?.streak && (
                    <div style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.30)', 
                      borderRadius: '9999px', 
                      padding: '0 12px', 
                      height: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span>🔥</span> <span>{userStreak} {userStreak === 1 ? 'dia' : 'dias'}</span>
                      </span>
                    </div>
                  )}
                  {estiloCards.conteudo?.selo && (
                    <div style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.30)', 
                      borderRadius: '9999px', 
                      padding: '0 12px', 
                      height: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFFFFF' }}>
                        Nível {userSelo}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Discrete Footer Metadata */}
              <div 
                style={{ 
                  borderTop: '1px solid rgba(255, 255, 255, 0.10)', 
                  paddingTop: '12px', 
                  marginTop: 'auto', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'monospace',
                  textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)',
                }}
              >
                <span className="opacity-70">
                  nakor.com.br
                </span>
                <span className="ml-auto opacity-70">
                  Stories Ready 📸
                </span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Action Buttons Wrapper */}
      <div className="w-full max-w-[390px] px-6 flex flex-col items-center">
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <button 
            onClick={handleCopyCardsImage}
            disabled={isCapturing}
            style={{ backgroundColor: accentColor, textShadow: 'none', color: '#000000' }}
            className={`w-full h-[56px] hover:brightness-105 active:scale-95 font-bold text-base rounded-full flex justify-center items-center gap-2 transition-all cursor-pointer ${isCapturing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isCapturing ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <span>{copyFeedback || 'Copiar cards 📸'}</span>
            )}
          </button>
          
          <button 
            onClick={() => onNavigate('home')}
            className="w-full h-[56px] bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] active:scale-95 text-white font-bold text-base rounded-full flex justify-center items-center transition-all cursor-pointer"
          >
            Voltar para o Início
          </button>
        </div>

        <span className="text-neutral-500 dark:text-neutral-400 text-[10px] text-center mt-6">compartilhe sua evolução</span>
      </div>

      {/* Modern Touch & Hold Fallback Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-[#0d0f12]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] bg-[#16191d] border border-white/[0.08] rounded-[28px] p-6 flex flex-col items-center gap-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xl mb-1">
              📸
            </div>
            
            <h4 className="text-white text-lg font-bold tracking-tight">
              Toque e segure para copiar
            </h4>
            
            <p className="text-neutral-400 text-xs leading-relaxed px-2">
              Seu navegador não permite a cópia direta. <strong className="text-white font-semibold">Pressione e segure</strong> o card abaixo para <strong className="text-white font-semibold">Copiar</strong> ou <strong className="text-white font-semibold">Compartilhar</strong> nos Stories!
            </p>

            <div className="w-full bg-[#0d0f12] rounded-xl p-2 border border-white/[0.04] overflow-hidden flex items-center justify-center max-h-[300px]">
              {generatedImgUrl ? (
                <img 
                  src={generatedImgUrl} 
                  alt="Seus Cards Nakor" 
                  className="max-w-full max-h-[280px] object-contain rounded-lg shadow-md pointer-events-auto cursor-pointer"
                  style={{ WebkitTouchCallout: 'default' }} // Enable iOS/Android touch callout
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-neutral-600 text-xs">
                  Carregando imagem...
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setShowShareModal(false);
                setGeneratedImgUrl('');
              }}
              style={{ backgroundColor: accentColor }}
              className="w-full h-[48px] hover:brightness-105 active:scale-95 text-[#000000] font-bold text-sm rounded-full flex justify-center items-center transition-all cursor-pointer mt-2"
            >
              Concluído
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
