import React from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { BluAssistant } from '../components/BluAssistant';
import { useScrollToTop } from '../hooks/useScrollToTop';

type TopOffset = 'compact' | 'normal' | 'loose';

const TOP_OFFSET_CLASS: Record<TopOffset, string> = {
  compact: 'pt-20',
  normal: 'pt-24',
  loose: 'pt-28',
};

export const AppLayout: React.FC = () => {
  useScrollToTop();
  const matches = useMatches();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotionFromSettings = typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion');
  const shouldReduceMotion = prefersReducedMotion || reduceMotionFromSettings;

  
  const resolvedTopOffset = [...matches]
    .reverse()
    .find((match) => {
      const handle = match.handle as { topOffset?: TopOffset } | undefined;
      return Boolean(handle?.topOffset);
    })?.handle as { topOffset?: TopOffset } | undefined;

  const topOffset: TopOffset = resolvedTopOffset?.topOffset ?? 'normal';
  const outletTopPaddingClass = TOP_OFFSET_CLASS[topOffset];

  return (
    <main className="min-h-screen w-full bg-app-gradient text-app-primary flex flex-col font-sans relative overflow-hidden" style={{ '--navbar-height': '80px' } as React.CSSProperties}>

      <div className="fixed top-0 left-0 w-full z-50 p-1 flex justify-center pointer-events-none">

        <div className="w-full max-w-[95%] pointer-events-auto">
          <Navbar />
        </div>

      </div>

      <div className={`flex-1 w-full flex flex-col items-center ${outletTopPaddingClass} pb-10 overflow-y-auto`}>
        <motion.div
          key={location.pathname}
          className="w-full flex flex-col items-center"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>

      <BluAssistant />

    </main>
  );
};