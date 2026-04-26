import { Tooltip as AriaTooltip, type TooltipProps as AriaTooltipProps, OverlayArrow, TooltipTrigger, Button } from 'react-aria-components';
import { composeRenderProps } from 'react-aria-components';

export { TooltipTrigger, Button };

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode;
}

const baseStyles = 'group bg-neutral-700 dark:bg-neutral-600 border border-neutral-800 dark:border-white/10 font-sans text-xs text-white rounded-lg drop-shadow-lg will-change-transform px-3 py-1.5 box-border';
const enteringStyles = 'animate-in fade-in placement-bottom:slide-in-from-top-0.5 placement-top:slide-in-from-bottom-0.5 placement-left:slide-in-from-right-0.5 placement-right:slide-in-from-left-0.5 ease-out duration-200';
const exitingStyles = 'animate-out fade-out placement-bottom:slide-out-to-top-0.5 placement-top:slide-out-to-bottom-0.5 placement-left:slide-out-to-right-0.5 placement-right:slide-out-to-left-0.5 ease-in duration-150';


export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip 
      {...props} 
      offset={10} 
      className={composeRenderProps(props.className, (className, renderProps) => {
        let finalClassName = `${baseStyles} ${className}`;
        if (renderProps.isEntering) finalClassName += ` ${enteringStyles}`;
        if (renderProps.isExiting) finalClassName += ` ${exitingStyles}`;
        return finalClassName;
      })}
    >
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8" className="block fill-neutral-700 dark:fill-neutral-600 forced-colors:fill-[Canvas] stroke-neutral-800 dark:stroke-white/10 forced-colors:stroke-[ButtonBorder] group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}
