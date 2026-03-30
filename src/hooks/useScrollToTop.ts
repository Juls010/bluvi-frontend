import React from 'react';

/**
 * Hook que fuerza el scroll al top cuando el componente monta.
 * Desactiva la restauración automática del navegador para evitar conflictos.
 * Útil para resetear la posición de scroll al navegar entre páginas.
 */
export const useScrollToTop = () => {
  React.useEffect(() => {
    // Desactiva la restauración automática del scroll del navegador
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Fuerza el scroll al top
    window.scrollTo(0, 0);
  }, []);
};
