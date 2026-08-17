import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, useLanguage } from '../lib/i18n';

interface LanguageSwitcherProps {
  /** 'light' = for light backgrounds, 'dark' = for dark/photo backgrounds */
  variant?: 'light' | 'dark';
  className?: string;
  align?: 'left' | 'right';
}

export function LanguageSwitcher({
  variant = 'light',
  className = '',
  align = 'right',
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const isDark = variant === 'dark';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Idioma"
        className={`flex items-center gap-1.5 h-9 pl-2.5 pr-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
          isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/[0.16] backdrop-blur-md'
            : 'bg-white border-[#DBDBE5]/70 text-[#21222D] hover:bg-neutral-50 shadow-sm dark:bg-[#151622] dark:border-[#2A2B3D] dark:text-[#F8F9FA] dark:hover:bg-[#1C1D2C]'
        }`}
      >
        <span className="text-[15px] leading-none">{current.flag}</span>
        <span className="text-[11px] font-bold tracking-wide">{current.short}</span>
        <ChevronDown
          size={13}
          strokeWidth={2.6}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            isDark ? 'text-white/70' : 'text-neutral-400'
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-[42px] z-[999] w-[188px] rounded-2xl border overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${
            isDark
              ? 'bg-[#151622]/95 border-white/12 backdrop-blur-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]'
              : 'bg-white border-[#DBDBE5]/70 shadow-[0_18px_40px_-18px_rgba(33,34,45,0.35)] dark:bg-[#151622] dark:border-[#2A2B3D]'
          }`}
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isDark
                    ? 'text-white hover:bg-white/[0.08]'
                    : 'text-[#21222D] hover:bg-neutral-50 dark:text-[#F8F9FA] dark:hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-[16px] leading-none">{l.flag}</span>
                <span className="flex-1 text-[13px] font-semibold">{l.label}</span>
                {active && (
                  <Check size={14} strokeWidth={3} className="text-[#7C3AED] dark:text-[#C4B5FD]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
