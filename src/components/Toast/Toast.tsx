import {
    UNSTABLE_Toast as AriaToast,
    UNSTABLE_ToastContent as ToastContent,
    } from 'react-aria-components';
import { Button } from '../Button';
import { CheckCircleIcon,
    WarningCircleIcon,
    XIcon
} from '@phosphor-icons/react';
import type { ToastContentProps } from './GlobalToast';

// @ts-ignore
export function Toast({ toast }: { toast: { content: ToastContentProps } }) {
  const isError = toast.content.type === 'error';

  return (
    <AriaToast 
      toast={toast as any} 
      className={`flex items-center justify-between gap-4 text-white px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border animate-in fade-in slide-in-from-bottom-5 w-80
        ${isError 
          ? 'bg-red-500 shadow-red-500/30 border-red-400' 
          : 'bg-bluvi-purple shadow-bluvi-purple/30 border-white/10'}`}
    >
      <ToastContent className="flex-1 flex items-center gap-2.5 text-sm font-medium tracking-wide">
        {isError ? (
          <WarningCircleIcon size={18} weight="bold" className="text-white shrink-0" />
        ) : (
          <CheckCircleIcon size={18} weight="bold" className="text-white shrink-0" />
        )}
        {toast.content.message}
      </ToastContent>
      <Button 
        slot="close" 
        className="p-1 rounded-md hover:bg-white/20 transition-colors bg-transparent border-none focus:ring-2 focus:ring-white/50 h-auto"
      >
        <XIcon size={16} weight="bold" />
      </Button>
    </AriaToast>
  );
}
