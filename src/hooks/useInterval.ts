/**
 * 定时器 Hook
 */

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      savedCallback.current?.();
    };

    const id = setInterval(tick, delay);
    const onVisible = () => {
      if (typeof document !== 'undefined' && !document.hidden) tick();
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisible);
    }
    return () => {
      clearInterval(id);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisible);
      }
    };
  }, [delay]);
}
