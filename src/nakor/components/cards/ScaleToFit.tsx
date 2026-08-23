import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Escala visualmente o card para caber no espaço disponível sem deformar proporções.
 * Usa `zoom` quando suportado (a altura flui naturalmente, sem medir nada) e cai
 * para `transform: scale()` com altura calculada quando não houver suporte.
 * O nó interno nunca muda de tamanho real, então a exportação continua idêntica.
 */
export function ScaleToFit({
  width,
  children,
  maxScale = 1,
}: {
  width: number;
  children: React.ReactNode;
  maxScale?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxScale);
  const [height, setHeight] = useState<number | null>(null);
  const [supportsZoom, setSupportsZoom] = useState(true);

  useEffect(() => {
    setSupportsZoom(
      typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
        ? CSS.supports('zoom', '0.5')
        : false,
    );
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const available = outerRef.current?.clientWidth ?? 0;
      const next = available > 0 ? Math.min(maxScale, available / width) : maxScale;
      setScale(next);
      if (!supportsZoom) {
        const h = innerRef.current?.offsetHeight ?? 0;
        setHeight(h > 0 ? h * next : null);
      }
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (outerRef.current) observer.observe(outerRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [width, maxScale, children, supportsZoom]);

  return (
    <div
      ref={outerRef}
      className="w-full min-w-0 flex justify-center"
      style={supportsZoom ? undefined : { height: height ?? undefined, overflow: 'hidden' }}
    >
      <div
        ref={innerRef}
        style={
          supportsZoom
            ? { zoom: scale, width }
            : { transform: `scale(${scale})`, transformOrigin: 'top center', width }
        }
      >
        {children}
      </div>
    </div>
  );
}
