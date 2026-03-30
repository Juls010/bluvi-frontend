import React, { useState } from 'react';

interface CustomScrollPillProps {
  /**
  * Clase CSS opcional aplicada a html/body para ocultar scrollbar nativo.
  * Para mejor accesibilidad, dejar undefined.
   */
  scrollHiddenClass?: string;
  /**
   * Color de la pill (clase Tailwind o valor hex).
   * Defecto: 'bg-neutral-500/75'
   */
  pillColor?: string;
}

/**
 * CustomScrollPill: Componente que renderiza una pill flotante personalizada
 * para indicar el progreso de scroll y oculta el scrollbar nativo del navegador.
 * 
 * Uso:
 * ```
 * <CustomScrollPill scrollHiddenClass="custom-scroll-hidden" />
 * ```
 */
export const CustomScrollPill: React.FC<CustomScrollPillProps> = ({
  scrollHiddenClass,
  pillColor = 'bg-neutral-500/75',
}) => {
  const [scrollPill, setScrollPill] = useState({ visible: false, top: 24, height: 56 });

  React.useEffect(() => {
    if (scrollHiddenClass) {
      document.documentElement.classList.add(scrollHiddenClass);
      document.body.classList.add(scrollHiddenClass);
    }

    let rafId: number | null = null;

    const updateScrollPill = () => {
      const doc = document.documentElement;
      const viewportHeight = window.innerHeight;
      const totalHeight = doc.scrollHeight;
      const scrollable = Math.max(totalHeight - viewportHeight, 0);

      if (scrollable <= 1) {
        setScrollPill((prev) => ({ ...prev, visible: false }));
        return;
      }

      const minTop = 20;
      const minHeight = 48;
      const maxHeight = 120;
      const computedHeight = Math.max(
        minHeight,
        Math.min(maxHeight, (viewportHeight * viewportHeight) / totalHeight)
      );
      const maxTop = Math.max(minTop, viewportHeight - computedHeight - minTop);
      const progress = Math.min(window.scrollY / scrollable, 1);
      const computedTop = minTop + (maxTop - minTop) * progress;

      setScrollPill({
        visible: true,
        top: computedTop,
        height: computedHeight,
      });
    };

    const onScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateScrollPill();
      });
    };

    updateScrollPill();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollPill);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollPill);

      if (scrollHiddenClass) {
        document.documentElement.classList.remove(scrollHiddenClass);
        document.body.classList.remove(scrollHiddenClass);
      }
    };
  }, [scrollHiddenClass]);

  return (
    <>
      {scrollPill.visible && (
        <div 
          className="pointer-events-none fixed right-2 top-0 z-[70] h-screen w-4"
          aria-hidden="true"
        >
          <div
            className={`absolute left-1/2 w-2 -translate-x-1/2 rounded-full ${pillColor}`}
            style={{
              top: `${scrollPill.top}px`,
              height: `${scrollPill.height}px`,
              transition: 'top 0.1s linear, height 0.15s ease-out',
            }}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};
