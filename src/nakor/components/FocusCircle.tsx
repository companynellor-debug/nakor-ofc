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
  const radius = 46;
  const strokeDasharray = radius * 2 * Math.PI;
  const strokeDashoffset = strokeDasharray * (1 - progressPercent);

  const isEmpty = todaySeconds === 0;
  const isComplete = progressPercent >= 1;

  const headAngle = progressPercent * 2 * Math.PI - Math.PI / 2;
  const headX = 50 + radius * Math.cos(headAngle);
  const headY = 50 + radius * Math.sin(headAngle);


  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* State-based ambient glow */}
      <div
        className={`absolute inset-0 rounded-full blur-[60px] pointer-events-none transition-all duration-700 ${
          isComplete
            ? 'bg-[#34117E]/25'
            : isMobile
              ? 'bg-[#34117E]/15'
              : 'bg-[#34117E]/5'
        }`}
      />

      {/* Layered concentric rings */}
      <div
        className={`absolute inset-[-10%] rounded-full border pointer-events-none transition-colors duration-700 ${
          isComplete
            ? 'border-[#34117E]/30'
            : isMobile
              ? 'border-[#34117E]/25'
              : 'border-[#34117E]/10'
        }`}
      />
      <div
        className={`absolute inset-[-20%] rounded-full border pointer-events-none transition-colors duration-700 ${
          isComplete
            ? 'border-[#34117E]/20'
            : isMobile
              ? 'border-[#34117E]/15'
              : 'border-[#34117E]/5'
        }`}
      />


      {/* Main decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="w-full h-full -rotate-90 overflow-visible"
          viewBox="0 0 100 100"
        >
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#34117E"
            strokeWidth="0.5"
            strokeDasharray="1 4"
            className={`transition-opacity duration-700 ${
              isEmpty
                ? isMobile
                  ? 'opacity-40'
                  : 'opacity-20'
                : isComplete
                  ? 'opacity-0'
                  : 'opacity-10'
            }`}
          />

          {isEmpty ? (
            /* Animated accent segment for empty state */
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#34117E"
              strokeWidth={isMobile ? 4 : 3}
              strokeLinecap="round"
              strokeDasharray={isMobile ? '4 88' : '2 90'}
              className="animate-spin"
              style={{ animationDuration: '8s' }}
            />

          ) : (
            /* Progress arc for filled / complete state */
            <>
              <defs>
                <linearGradient
                  id={`timerProgressGrad-${variant}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {/* Full inner ring for complete state */}
              {isComplete && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius - 3}
                  fill="none"
                  stroke="#34117E"
                  strokeWidth="1"
                  className="opacity-30"
                />
              )}

              {/* Main progress arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={`url(#timerProgressGrad-${variant})`}
                strokeWidth={isComplete ? 4 : 3}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />

              {/* Progress head dot */}
              {!isComplete && (
                <circle
                  cx={headX}
                  cy={headY}
                  r="3.5"
                  className="fill-white stroke-[#4F46E5] stroke-[1px]"
                />
              )}
            </>
          )}
        </svg>
      </div>

      {/* Complete-state glow ring */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-[-8%] rounded-full border-2 border-[#4F46E5]/40 pointer-events-none"
        />
      )}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="flex items-baseline space-x-2 mb-1">
          <span
            className={`text-5xl font-bold tracking-tight transition-colors duration-700 ${
              isEmpty ? 'text-[#34117E]' : 'text-[#21222D] dark:text-[#F8F9FA]'
            }`}
          >
            {displayHours}
            <span className="text-2xl font-semibold opacity-60 ml-0.5">h</span>
          </span>
          <span
            className={`text-5xl font-bold tracking-tight transition-colors duration-700 ${
              isEmpty ? 'text-[#34117E]' : 'text-[#21222D] dark:text-[#F8F9FA]'
            }`}
          >
            {displayMinutes}
            <span className="text-2xl font-semibold opacity-60 ml-0.5">m</span>
          </span>
        </div>

        {isEmpty ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-[#34117E]/50 text-sm font-medium uppercase tracking-[0.15em]">
              comece sua primeira sessão
            </p>
            {/* Pulsing indicator bar */}
            <div className="mt-6 w-12 h-1 bg-[#34117E]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#34117E] w-1/3 rounded-full animate-pulse" />
            </div>
          </div>
        ) : isComplete ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-[#34117E]/15 border border-[#34117E]/30 text-[#34117E] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
              Meta de hoje alcançada
            </div>
            <p className="text-[#34117E]/60 text-xs font-medium mt-1">
              Nota média:{' '}
              <strong className="text-[#34117E] font-mono">{avgToday}</strong>
            </p>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium bg-[#34117E]/10 border border-[#34117E]/20 px-3 py-1 rounded-full text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34117E]" />
            Nota média:{' '}
            <strong className="text-[#34117E] font-mono">{avgToday}</strong>
          </div>
        )}
      </div>

      {/* Ornamental floating accents */}
      <div
        className={`absolute top-4 left-4 w-2 h-2 rounded-full pointer-events-none transition-colors duration-700 ${
          isComplete ? 'bg-[#4F46E5]/40' : 'bg-[#34117E]/30'
        }`}
      />
      <div
        className={`absolute bottom-10 right-8 w-1.5 h-1.5 rounded-full pointer-events-none transition-colors duration-700 ${
          isComplete ? 'bg-[#4F46E5]/30' : 'bg-[#34117E]/20'
        }`}
      />
    </div>
  );
}

