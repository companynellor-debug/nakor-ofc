import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Escala visualmente o card para caber na tela sem deformar proporções.
 * A cópia continua sendo feita no tamanho real (o nó interno não é alterado).
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
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const measure = () => {
      const available = outerRef.current?.clientWidth || width;
      const next = Math.min(maxScale, available / width);
      setScale(next);
      const h = innerRef.current?.offsetHeight;
      if (h) setHeight(h * next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (outerRef.current) observer.observe(outerRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [width, maxScale, children]);

  return (
    <div ref={outerRef} className="w-full min-w-0 overflow-hidden flex justify-center" style={{ height: height ?? 0 }}>
      <div
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width }}
      >
        {children}
      </div>
    </div>
  );
}
