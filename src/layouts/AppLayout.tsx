import React from 'react';
import { Outlet, useMatches } from 'react-router-dom';
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

  // The deepest route with handle.topOffset wins. Defaults to "normal".
  const resolvedTopOffset = [...matches]
    .reverse()
    .find((match) => {
      const handle = match.handle as { topOffset?: TopOffset } | undefined;
      return Boolean(handle?.topOffset);
    })?.handle as { topOffset?: TopOffset } | undefined;

  const topOffset: TopOffset = resolvedTopOffset?.topOffset ?? 'normal';
  const outletTopPaddingClass = TOP_OFFSET_CLASS[topOffset];

  return (
    <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col font-sans relative overflow-hidden" style={{ '--navbar-height': '80px' } as React.CSSProperties}>

      <div className="fixed top-0 left-0 w-full z-50 p-1 flex justify-center pointer-events-none">

        <div className="w-full max-w-[95%] pointer-events-auto">
          <Navbar />
        </div>

      </div>

      <div className={`flex-1 w-full flex flex-col items-center ${outletTopPaddingClass} pb-10 overflow-y-auto`}>
        <Outlet />
      </div>

      <BluAssistant />

    </main>
  );
};