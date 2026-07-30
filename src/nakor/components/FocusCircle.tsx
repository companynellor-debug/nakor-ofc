import React from 'react';
import { motion } from 'motion/react';

interface FocusCircleProps {
  todaySeconds: number;
  displayHours: number;
  displayMinutes: number;
  avgToday: string;
  progressPercent: number;
  size?: number;
  variant?: 'mobile' | 'desktop';
}

export function FocusCircle({
  todaySeconds,
  displayHours,
  displayMinutes,
  avgToday,
  progressPercent,
  size = 256,
  variant = 'mobile',
}: FocusCircleProps) {
  const isMobile = variant === 'mobile';
  const isEmpty = todaySeconds === 0;
  const isComplete = progressPercent >= 1;

  const radius = 46;
  const strokeDasharray = radius * 2 * Math.PI;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent);
  const headAngle = progressPercent * 2 * Math.PI - Math.PI / 2;
  const headX = 50 + radius * Math.cos(headAngle);
  const headY = 50 + radius * Math.sin(headAngle);

  const ringSize = isMobile ? 'inset-[5%]' : 'inset-[8%]';
  const ringThickness = isMobile ? 6 : 5;
  const trackThickness = isMobile ? 0.5 : 0.5;
  const headRadius = isMobile ? 5 : 4.5;
  const orbSize = isMobile ? 16 : 14;
  const textSize = isMobile ? 'text-5xl' : 'text-[52px]';
  const unitSize = isMobile ? 'text-2xl' : 'text-[32px]';
  const labelSize = isMobile ? 'text-[10px]' : 'text-[11px]';
  const ctaSize = isMobile ? 'text-[11px]' : 'text-xs';

  // Dark mode gets brighter purples so the ring stays readable on #0D0F14
  const accentVars = isComplete
    ? '[--fc-from:#4F46E5] [--fc-to:#8B5CF6] dark:[--fc-from:#A78BFA] dark:[--fc-to:#818CF8] [--fc-accent:#4F46E5] dark:[--fc-accent:#A78BFA]'
    : '[--fc-from:#8B5CF6] [--fc-to:#4F46E5] dark:[--fc-from:#C4B5FD] dark:[--fc-to:#818CF8] [--fc-accent:#8B5CF6] dark:[--fc-accent:#C4B5FD]';
  const textColor = isEmpty
    ? 'text-[#34117E] dark:text-[#C4B5FD]'
    : 'text-[#21222D] dark:text-[#F8F9FA]';

  return (
    <div
      className={`relative flex items-center justify-center ${accentVars}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-700 ${
          isComplete
            ? 'bg-[#34117E]/15 dark:bg-[#8B5CF6]/25'
            : 'bg-[#34117E]/10 dark:bg-[#8B5CF6]/20'
        }`}
        style={{ filter: 'blur(60px)' }}
      />

      {/* Outer decorative ring */}
      <div
        className={`absolute inset-0 rounded-full border pointer-events-none transition-colors duration-700 ${
          isComplete
            ? 'border-[#34117E]/20 dark:border-[#A78BFA]/30'
            : 'border-[#E0DDF5]/70 dark:border-white/[0.08]'
        }`}
      />

      {/* Main solid track ring */}
      <div
        className={`absolute ${ringSize} rounded-full pointer-events-none transition-all duration-700 ${
          isComplete
            ? 'border-[#34117E]/15 dark:border-[#A78BFA]/20'
            : 'border-[#F1F1F7] dark:border-white/[0.06]'
        }`}
        style={{
          borderWidth: ringThickness,
          boxShadow: 'inset 0 2px 4px rgba(52, 17, 126, 0.04)',
        }}
      />


      {/* SVG progress ring */}
      <svg
        className={`absolute ${ringSize} w-[90%] h-[90%] -rotate-90 overflow-visible pointer-events-none`}
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient
            id={`timerProgressGrad-${variant}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="var(--fc-from)" />
            <stop offset="100%" stopColor="var(--fc-to)" />
          </linearGradient>
        </defs>

        {/* Dotted background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={trackThickness}
          strokeDasharray="1 6"
          strokeLinecap="round"
          className={`stroke-[#E0DDF5] dark:stroke-[#4C4470] transition-opacity duration-700 ${
            isEmpty ? 'opacity-60' : isComplete ? 'opacity-0' : 'opacity-40'
          }`}
        />

        {isEmpty ? (
          /* Hero glowing segment for empty state */
          <>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={`url(#timerProgressGrad-${variant})`}
              strokeWidth={isMobile ? 6 : 5}
              strokeLinecap="round"
              strokeDasharray={isMobile ? '18 270' : '16 272'}
              className="drop-shadow-[0_0_12px_rgba(79,70,229,0.35)]"
              style={{
                transformOrigin: 'center',
                animation: 'spin 8s linear infinite',
              }}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={`url(#timerProgressGrad-${variant})`}
              strokeWidth={isMobile ? 2 : 1.5}
              strokeLinecap="round"
              strokeDasharray={isMobile ? '4 284' : '3 286'}
              className="opacity-30"
              style={{
                transformOrigin: 'center',
                animation: 'spin 12s linear infinite reverse',
              }}
            />
          </>
        ) : (
          <>
            {/* Complete state inner ring */}
            {isComplete && (
              <circle
                cx="50"
                cy="50"
                r={radius - 4}
                fill="none"
                className="stroke-[#34117E] dark:stroke-[#A78BFA]"
                strokeWidth="1"
                className="opacity-25"
              />
            )}

            {/* Main progress arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={`url(#timerProgressGrad-${variant})`}
              strokeWidth={isComplete ? 6 : isMobile ? 5 : 4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out drop-shadow-[0_0_10px_rgba(79,70,229,0.25)]"
            />

            {/* Progress head orb */}
            {!isComplete && (
              <g>
                <circle
                  cx={headX}
                  cy={headY}
                  r={headRadius + 2}
                  className="fill-white dark:fill-[#1B1C29] drop-shadow-md"
                />
                <circle
                  cx={headX}
                  cy={headY}
                  r={headRadius}
                  fill="var(--fc-accent)"
                />
              </g>
            )}
          </>
        )}
      </svg>

      {/* Orbital indicator orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: isEmpty
            ? 'rotate(15deg)'
            : `rotate(${progressPercent * 360}deg)`,
          transition: 'transform 700ms ease-out',
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white dark:bg-[#1B1C29] shadow-lg flex items-center justify-center transition-all duration-700"
          style={{
            width: orbSize,
            height: orbSize,
            top: isMobile ? -6 : -4,
            border: '1px solid rgba(79, 70, 229, 0.25)',
          }}
        >
          <div
            className="rounded-full transition-colors duration-700"
            style={{
              width: orbSize / 2.5,
              height: orbSize / 2.5,
              backgroundColor: "var(--fc-accent)",
            }}
          />
        </div>
      </div>

      {/* Complete state outer glow ring */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-[-10%] rounded-full border-2 border-[#34117E]/30 dark:border-[#A78BFA]/45 pointer-events-none"
        />
      )}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <span
          className={`${labelSize} font-bold tracking-[0.2em] uppercase mb-2 transition-colors duration-700 ${
            isEmpty ? 'text-[#34117E]/40 dark:text-[#C4B5FD]/60' : 'text-neutral-400 dark:text-neutral-400'
          }`}
        >
          Tempo Focado Hoje
        </span>

        <div className="flex items-baseline space-x-2 mb-1">
          <span className={`${textSize} font-bold tracking-tighter transition-colors duration-700 ${textColor}`}>
            {displayHours}
            <span className={`${unitSize} font-semibold opacity-60 ml-0.5`}>h</span>
          </span>
          <span className={`${textSize} font-bold tracking-tighter transition-colors duration-700 ${textColor}`}>
            {displayMinutes}
            <span className={`${unitSize} font-semibold opacity-60 ml-0.5`}>m</span>
          </span>
        </div>

        {isEmpty ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className={`${ctaSize} font-semibold tracking-wider text-[#8B5CF6] dark:text-[#C4B5FD] uppercase text-center max-w-[140px] leading-relaxed`}>
              Comece sua primeira sessão
            </p>
            <div className="mt-4 w-12 h-1.5 bg-[#34117E]/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#34117E] dark:bg-[#C4B5FD] w-1/3 rounded-full animate-pulse" />
            </div>
          </div>
        ) : isComplete ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-[#34117E]/15 dark:bg-[#A78BFA]/20 border border-[#34117E]/30 dark:border-[#A78BFA]/40 text-[#34117E] dark:text-[#C4B5FD] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34117E] dark:bg-[#C4B5FD] animate-pulse" />
              Meta de hoje alcançada
            </div>
            <p className="text-[#34117E]/70 dark:text-[#C4B5FD]/80 text-xs font-medium mt-1">
              Nota média:{' '}
              <strong className="text-[#34117E] dark:text-[#C4B5FD] font-mono">{avgToday}</strong>
            </p>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium bg-[#34117E]/10 dark:bg-[#A78BFA]/15 border border-[#34117E]/20 dark:border-[#A78BFA]/30 px-3 py-1 rounded-full text-neutral-600 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34117E] dark:bg-[#C4B5FD]" />
            Nota média:{' '}
            <strong className="text-[#34117E] dark:text-[#C4B5FD] font-mono">{avgToday}</strong>
          </div>
        )}
      </div>

      {/* Floating accent dots */}
      <div
        className={`absolute top-[25%] left-[8%] w-2.5 h-2.5 rounded-full pointer-events-none transition-colors duration-700 ${
          isComplete ? 'bg-[#34117E]/40' : 'bg-[#8B5CF6]/40'
        }`}
        style={{ filter: 'blur(1px)' }}
      />
      <div
        className={`absolute bottom-[18%] right-[15%] w-2 h-2 rounded-full pointer-events-none transition-colors duration-700 ${
          isComplete ? 'bg-[#34117E]/50' : 'bg-[#4F46E5]/60'
        }`}
        style={{ filter: 'blur(1px)' }}
      />
    </div>
  );
}
