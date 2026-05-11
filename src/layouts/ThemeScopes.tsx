import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { getAccessibilityPreferences } from '../services/user.service';

interface ThemeScopeProps {
  children: React.ReactNode;
}

const clearPrivateAccessibility = () => {
  const root = document.documentElement;
  root.classList.remove('high-contrast');
  root.classList.remove('reduce-motion');
  root.classList.remove('low-transparency');
  root.style.fontSize = '';
};

const applyPrivateAccessibility = () => {
  const root = document.documentElement;

  const savedContrast = localStorage.getItem('a11y_contrast');
  root.classList.toggle('high-contrast', savedContrast === 'high');

  const savedMotion = localStorage.getItem('a11y_motion');
  root.classList.toggle('reduce-motion', savedMotion === 'reduce');

  const savedTransparency = localStorage.getItem('a11y_transparency');
  root.classList.toggle('low-transparency', savedTransparency === 'reduce');

  const savedFont = localStorage.getItem('a11y_font');
  const fontMap: Record<string, string> = {
    normal: '100%',
    large: '112.5%',
    xlarge: '125%',
  };
  root.style.fontSize = fontMap[savedFont ?? 'normal'] ?? '100%';
};

export const PublicThemeScope: React.FC<ThemeScopeProps> = ({ children }) => {
  useEffect(() => {
    clearPrivateAccessibility();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="bluvi_theme">
      {children}
    </ThemeProvider>
  );
};

export const PrivateThemeScope: React.FC<ThemeScopeProps> = ({ children }) => {
  useEffect(() => {
    let cancelled = false;

    applyPrivateAccessibility();

    const syncAccessibilityFromAccount = async () => {
      try {
        const prefs = await getAccessibilityPreferences();
        if (cancelled) return;

        localStorage.setItem('a11y_contrast', prefs.contrast);
        localStorage.setItem('a11y_motion', prefs.reduce_motion ? 'reduce' : 'normal');
        localStorage.setItem('a11y_font', prefs.font_size);

        applyPrivateAccessibility();
      } catch {
        // If account sync is unavailable, keep local device preferences.
      }
    };

    void syncAccessibilityFromAccount();

    const handleSync = () => {
      applyPrivateAccessibility();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('bluvi:a11y-sync', handleSync as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('bluvi:a11y-sync', handleSync as EventListener);
      clearPrivateAccessibility();
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="bluvi_theme">
      {children}
    </ThemeProvider>
  );
};
