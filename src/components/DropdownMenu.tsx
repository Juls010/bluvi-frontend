import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type DropdownMenuProps = HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    isClosing?: boolean;
    label: string;
};

const menuItemClassName =
    'block rounded-xl px-3 py-2 text-sm font-medium text-app-primary border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-light-purple';

const dangerMenuItemClassName =
    'block rounded-xl px-3 py-2 text-sm font-medium text-app-primary border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50';

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
    { isOpen, isClosing = false, label, className = '', children, ...props },
    ref
) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={ref}
            role="menu"
            aria-label={label}
            className={`absolute right-0 mt-2 w-56 rounded-2xl border border-app-soft bg-app-surface-solid shadow-xl p-1.5 origin-top-right motion-reduce:animate-none ${isClosing ? 'animate-navbar-menu-out' : 'animate-navbar-menu'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

type DropdownMenuLinkProps = LinkProps & {
    className?: string;
    children: ReactNode;
};

export const DropdownMenuLink = forwardRef<HTMLAnchorElement, DropdownMenuLinkProps>(function DropdownMenuLink(
    { className = '', children, ...props },
    ref
) {
    return (
        <Link
            ref={ref}
            role="menuitem"
            data-navbar-menu-item="true"
            className={`${menuItemClassName} ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
});

type DropdownMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    children: ReactNode;
    danger?: boolean;
};

export const DropdownMenuButton = forwardRef<HTMLButtonElement, DropdownMenuButtonProps>(function DropdownMenuButton(
    { className = '', children, danger = false, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            type="button"
            role="menuitem"
            data-navbar-menu-item="true"
            data-navbar-menu-danger={danger ? 'true' : undefined}
            className={`${danger ? dangerMenuItemClassName : menuItemClassName} w-full text-left ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`h-px bg-app-soft mx-4 my-1 ${className}`} aria-hidden="true" />
);
