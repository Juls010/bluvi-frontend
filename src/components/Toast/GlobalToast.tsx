import { UNSTABLE_ToastQueue as ToastQueue, UNSTABLE_ToastRegion as ToastRegion } from 'react-aria-components';
import { Toast } from './Toast';

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
        className="fixed inset-x-3 top-4 z-[100] flex flex-col items-center gap-2 outline-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:items-stretch"
    >
      {({ toast }) => <Toast toast={toast} />}
    </ToastRegion>
  );
}
