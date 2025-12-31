// assets/react/hooks/useAnimatedNumber.ts
import { useEffect, useState } from 'react';

export function useAnimatedNumber(target: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / target), 10);

    const timer = setInterval(() => {
      start += 1;
      setValue(start);
      if (start >= target) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}
