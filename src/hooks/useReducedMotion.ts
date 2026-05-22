import { useEffect, useState } from 'react';

const getReducedMotionPreference = () => {
  if (typeof window === 'undefined') return false;

  const saved = localStorage.getItem('a11y_motion');
  if (saved === 'reduce') return true;
  if (saved === 'normal') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference);

  useEffect(() => {
    const updatePreference = () => {
      setReducedMotion(getReducedMotionPreference());
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    window.addEventListener('storage', updatePreference);
    window.addEventListener('bluvi:a11y-sync', updatePreference as EventListener);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
      window.removeEventListener('storage', updatePreference);
      window.removeEventListener('bluvi:a11y-sync', updatePreference as EventListener);
    };
  }, []);

  return reducedMotion;
};
