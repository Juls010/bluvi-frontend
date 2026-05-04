import { UNSTABLE_ToastQueue as ToastQueue, UNSTABLE_ToastRegion as ToastRegion } from 'react-aria-components';
import { Toast } from './Toast';
import React from 'react';

export interface ToastContentProps {
  message: string;
  type?: 'success' | 'error';
}

export const toastQueue = new ToastQueue<ToastContentProps>({
  maxVisibleToasts: 3
});

export function GlobalToastRegion() {
  return (
    <ToastRegion 
        queue={toastQueue} 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col gap-2 outline-none"
    >
      {({ toast }) => <Toast toast={toast} />}
    </ToastRegion>
  );
}
