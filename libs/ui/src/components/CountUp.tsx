import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  durationMs?: number;
  formatter?: (value: number) => string;
  className?: string;
}

/** Anime un nombre de sa valeur précédente vers `value` (ease-out) à l'arrivée des données. */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  durationMs = 900,
  formatter,
  className,
}) => {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      return undefined;
    }
    const start = performance.now();
    let frame: number;

    const step = (now: number): void => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  const text = formatter ? formatter(display) : display.toLocaleString('fr-FR');
  return <span className={['num', className ?? ''].join(' ')}>{text}</span>;
};
