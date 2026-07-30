import { useState } from 'react';
import { Sparkles, Check, Play, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { NakorLogo } from './NakorLogo';

interface SessionExample {
  id: string;
  title: string;
  tag: string;
  duration: string;
  antes: string;
  depois: string;
  score: number;
  comment: string;
  scoreColor: string;
}

const EXAMPLES: SessionExample[] = [
  {
    id: 'design',
    title: 'Layout da Home',
    tag: 'Design',
    duration: '45 min',
    antes: 'Vou fechar a versão final do layout da página de checkout e enviar para a equipe. Sem abrir abas extras ou olhar o WhatsApp.',
    depois: 'Checkout finalizado, exportado e enviado no canal de design. Consegui manter o fluxo por 43 minutos sem desvios.',
    score: 8.7,
    comment: 'IA Nakor: Excelente correspondência entre plano e execução. Você se manteve fiel ao escopo e entregou no prazo estimado.',
    scoreColor: 'text-[#10367D]'
  },
  {
    id: 'dev',
    title: 'Refatorar Endpoints',
    tag: 'Programação',
    duration: '60 min',
    antes: 'Escrever os testes unitários para a rota de autenticação de usuários e corrigir o bug do token expirado.',
    depois: 'Todos os testes passaram e o bug foi resolvido. Sobrou tempo para limpar as variáveis não utilizadas no arquivo principal.',
    score: 9.2,
    comment: 'IA Nakor: Execução perfeita. Você superou a meta original ao realizar uma limpeza de código adicional sem perder o foco programado.',
    scoreColor: 'text-[#A5CE00]'
  },
  {
    id: 'copy',
    title: 'Copy do E-mail',
    tag: 'Redação',
    duration: '30 min',
    antes: 'Escrever 3 variações de assunto para o e-mail de anúncio do app e o corpo principal de cada um.',
    depois: 'Escrevi apenas 2 assuntos. Me dispersei por 8 minutos respondendo uma mensagem que chegou no computador.',
    score: 6.5,
    comment: 'IA Nakor: Houve quebra de foco relatada. O tempo foi cumprido, mas a entrega ficou abaixo do planejado devido a interrupções externas.',
    scoreColor: 'text-amber-500'
  }
];

export function ShareableCards() {
  const [selectedSession, setSelectedSession] = useState<SessionExample>(EXAMPLES[0]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Switcher */}
      <div className="mb-12 flex flex-wrap justify-center gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 max-w-lg">
        {EXAMPLES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedSession(item)}
            className={`px-5 py-2 text-sm font-display font-medium rounded-full transition-all duration-300 cursor-pointer ${
              selectedSession.id === item.id
                ? 'bg-[#10367D] text-white shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.title} ({item.score.toFixed(1)})
          </button>
        ))}
      </div>

      {/* Diagonal Staggered Cards Layout */}
      <div className="relative w-full max-w-5xl min-h-[580px] md:min-h-[480px] lg:min-h-[500px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8 px-4 py-8">
        
        {/* Background Glowing Brand Blobs to highlight cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-72 h-72 rounded-full bg-[#10367D]/10 blur-3xl -translate-x-1/3" />
          <div className="w-72 h-72 rounded-full bg-[#A5CE00]/10 blur-3xl translate-x-1/3" />
        </div>

        {/* CARD 1: Antes */}
        <div 
          style={{
            position: 'relative',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 24px 60px rgba(16, 19, 45, 0.10)',
            width: '100%',
            maxWidth: '320px',
            minHeight: '340px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
          }}
          className="w-full max-w-[320px] shadow-2xl animate-float-1 md:self-start md:-rotate-3 md:translate-y-4"
        >
          {/* Layer 1: Background accent style */}
          <div 
            className="absolute inset-0 z-0 transition-all duration-300 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.45) 0%, transparent 80%)`,
              borderRadius: 'inherit',
            }}
          />

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
                  "{selectedSession.antes}"
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
                <span>{selectedSession.duration}</span>
              </div>
              <span className="opacity-70">nakor.com.br</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Depois */}
        <div 
          style={{
            position: 'relative',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 24px 60px rgba(16, 19, 45, 0.10)',
            width: '100%',
            maxWidth: '320px',
            minHeight: '340px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
          }}
          className="w-full max-w-[320px] shadow-2xl animate-float-2 z-10 md:-translate-y-4 md:rotate-1"
        >
          {/* Layer 1: Background accent style */}
          <div 
            className="absolute inset-0 z-0 transition-all duration-300 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, rgba(165, 206, 0, 0.35) 0%, transparent 80%)`,
              borderRadius: 'inherit',
            }}
          />

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
                  "{selectedSession.depois}"
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
                <span>RELATADO</span>
              </div>
              <span className="opacity-70">nakor.com.br</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Score */}
        <div 
          style={{
            position: 'relative',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 24px 60px rgba(16, 19, 45, 0.10)',
            width: '100%',
            maxWidth: '320px',
            minHeight: '340px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
          }}
          className="w-full max-w-[320px] shadow-2xl animate-float-3 md:self-end md:rotate-3 md:-translate-y-2"
        >
          {/* Layer 1: Background accent style */}
          <div 
            className="absolute inset-0 z-0 transition-all duration-300 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(165, 206, 0, 0.3) 0%, transparent 80%)`,
              borderRadius: 'inherit',
            }}
          />

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

            {/* Score Block */}
            <div className="flex flex-col items-center justify-center text-center my-auto w-full">
              <span 
                className="text-[9px] font-mono tracking-widest text-white/60 uppercase mb-1"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)' }}
              >
                NOTA DA SESSÃO
              </span>
              <span style={{ 
                fontSize: '56px', 
                fontWeight: 900, 
                color: '#FFFFFF', 
                lineHeight: 1, 
                marginBottom: '12px',
                textShadow: `0 2px 8px rgba(0,0,0,0.6), 0 0 15px ${selectedSession.id === 'dev' ? '#A5CE00' : selectedSession.id === 'design' ? '#2563EB' : '#F59E0B'}`
              }}>
                {selectedSession.score.toFixed(1)}
              </span>
              
              <p style={{ 
                fontSize: '13px', 
                fontWeight: 500, 
                color: 'rgba(255, 255, 255, 0.85)', 
                lineHeight: 1.5, 
                textAlign: 'center',
                margin: 0,
                textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,0.4)'
              }} className="max-w-[240px]">
                {selectedSession.comment}
              </p>
            </div>

            {/* Badges/Chips */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
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
                  Stories Ready 📸
                </span>
              </div>
            </div>
            
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
                {selectedSession.tag}
              </span>
            </div>
          </div>
        </div>

      </div>

      <p className="text-sm font-sans text-neutral-400 text-center mt-4">
        * Layout 100% responsivo e otimizado para postagem direta nas redes sociais.
      </p>
    </div>
  );
}
