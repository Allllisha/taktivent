import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function useCountdown(targetDate: Date | string): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>(() => calculateCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

function calculateCountdown(targetDate: Date | string): CountdownResult {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = differenceInSeconds(target, now);

  if (diff <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: 'Event started',
    };
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return {
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
  };
}

export default useCountdown;
