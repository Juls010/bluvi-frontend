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
    { isOpen, isClosing = false, label, className = '', children, onKeyDown, ...props },
    ref
) {
    if (!isOpen) {
        return null;
    }

    const handleMenuKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
        const menu = event.currentTarget;
        const menuItems = Array.from(
            menu.querySelectorAll<HTMLElement>('[data-navbar-menu-item="true"]')
        ).filter((item) => {
            if (item.getAttribute('aria-disabled') === 'true') return false;
            if ('disabled' in item && (item as HTMLButtonElement).disabled) return false;
            return !item.hasAttribute('hidden');
        });

        if (menuItems.length === 0) {
            onKeyDown?.(event);
            return;
        }

        const activeElement = document.activeElement as HTMLElement | null;
        const currentIndex = activeElement ? menuItems.indexOf(activeElement) : -1;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % menuItems.length : 0;
            menuItems[nextIndex]?.focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const previousIndex = currentIndex >= 0 ? (currentIndex - 1 + menuItems.length) % menuItems.length : menuItems.length - 1;
            menuItems[previousIndex]?.focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            menuItems[0]?.focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            menuItems[menuItems.length - 1]?.focus();
        } else if ((event.key === 'Enter' || event.key === ' ') && activeElement?.dataset.navbarMenuItem === 'true') {
            event.preventDefault();
            activeElement.click();
        }

        onKeyDown?.(event);
    };

    return (
        <div
            ref={ref}
            role="menu"
            aria-label={label}
            onKeyDown={handleMenuKeyDown}
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
