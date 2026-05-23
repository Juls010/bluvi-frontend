import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook que fuerza el scroll al top cuando el componente monta.
 * Desactiva la restauración automática del navegador para evitar conflictos.
 * Útil para resetear la posición de scroll al navegar entre páginas.
 */
export const useScrollToTop = () => {
  const { hash, pathname, search } = useLocation();

  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      const isFooterHash = hash === '#footer';
      const isWelcomeSectionHash =
        pathname === '/' && ['#conexiones', '#afinidad', '#seguridad', '#accesibilidad'].includes(hash);
      const navigationEntry = window.performance
        ?.getEntriesByType('navigation')
        .at(0) as PerformanceNavigationTiming | undefined;
      const isReload = navigationEntry?.type === 'reload';
      const cleanHash = () => {
        window.history.replaceState(window.history.state, '', `${pathname}${search}`);
      };

      if (isFooterHash && isReload) {
        cleanHash();
        window.scrollTo(0, 0);
        return;
      }

      if (isWelcomeSectionHash) {
        cleanHash();
        window.scrollTo(0, 0);
        return;
      }

      window.requestAnimationFrame(() => {
        const targetId = hash.slice(1);
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });

        if (isFooterHash) {
          cleanHash();
        }
      });
      return;
    }
    
    window.scrollTo(0, 0);
  }, [hash, pathname, search]);
};
