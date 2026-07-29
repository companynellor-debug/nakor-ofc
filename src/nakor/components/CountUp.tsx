import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  target: number;
  duration?: number;
}

export function CountUp({ target, duration = 1500 }: CountUpProps) {
  const [value, setValue] = useState(0.0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;
          const startValue = 0.0;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = progress * (target - startValue) + startValue;
            setValue(Number(current.toFixed(1)));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setValue(target);
            }
          };

          window.requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(1)}
    </span>
  );
}
