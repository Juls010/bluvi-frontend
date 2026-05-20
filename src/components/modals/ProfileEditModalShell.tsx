import React from 'react';
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';
import { XIcon } from '@phosphor-icons/react';

interface ProfileEditModalShellProps {
    title: string;
    icon?: React.ReactNode;
    onClose: () => void;
    isSaving?: boolean;
    maxWidthClassName?: string;
    children: React.ReactNode;
    footer: React.ReactNode;
}

export const ProfileEditModalShell: React.FC<ProfileEditModalShellProps> = ({
    title,
    icon,
    onClose,
    isSaving = false,
    maxWidthClassName = 'max-w-md',
    children,
    footer,
}) => {
    return (
        <ModalOverlay
            isOpen
            onOpenChange={(open) => {
                if (!open && !isSaving) onClose();
            }}
            isDismissable={!isSaving}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md animate-fade-in dark:bg-black/55"
        >
            <Modal className={`w-full ${maxWidthClassName} outline-none`}>
                <Dialog className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[2rem] border border-app-soft bg-app-surface-strong text-app-primary shadow-2xl outline-none animate-scale-in">
                    <div className="flex items-center justify-between gap-4 bg-app-surface-strong px-6 pb-4 pt-6">
                        <Heading slot="title" className="flex items-center gap-2 font-heading text-xl font-bold text-app-primary">
                            {icon}
                            {title}
                        </Heading>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="grid h-9 w-9 place-items-center rounded-full text-app-muted transition-colors hover:bg-app-surface-soft hover:text-app-primary disabled:opacity-50"
                            aria-label="Cerrar"
                        >
                            <XIcon className="h-5 w-5" weight="bold" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-app-surface-strong px-6 py-5">
                        {children}
                    </div>

                    <div className="flex gap-3 bg-app-surface-soft p-6">
                        {footer}
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
