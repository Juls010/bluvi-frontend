import React from 'react';
import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel
}) => {
    return (
        <ModalOverlay 
            isOpen={isOpen} 
            onOpenChange={(open) => !open && onCancel()}
            isDismissable={true}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/35 dark:bg-black/55 backdrop-blur-md animate-fade-in"
        >
        <Modal className="w-full max-w-sm outline-none">
        <Dialog 
            role="alertdialog"
            className="bg-app-surface-strong text-app-primary w-full rounded-[2rem] shadow-2xl border border-app-soft relative overflow-hidden animate-scale-in outline-none p-6"
        >
            <Heading slot="title" className="text-xl font-heading font-bold text-app-primary mb-2 text-center">
                {title}
            </Heading>
            <p className="text-sm text-app-secondary mb-6 text-center">
                {description}
            </p>
            <div className="flex gap-4 w-full">
                <Button 
                    onClick={onCancel}
                    className="flex-1 !bg-app-surface border-2 !border-app-soft !text-app-secondary hover:!bg-app-surface-soft shadow-sm transition-all duration-200"
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    className="flex-1 border-2 transition-all duration-200 shadow-md border-transparent hover:brightness-105"
                    style={{ backgroundColor: 'var(--app-accent)', color: 'white' }}
                >
                    {confirmText}
                </Button>
            </div>
        </Dialog>
        </Modal>
        </ModalOverlay>
    );
};
