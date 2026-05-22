import React from 'react';
import {
    Dialog,
    Heading,
    Modal,
    ModalOverlay,
} from 'react-aria-components';
import {
    ArrowRightIcon,
    ConfettiIcon,
    EnvelopeSimpleIcon,
} from '@phosphor-icons/react';
import { Button } from './Button';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            isDismissable
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#221B5F]/55 p-4 animate-fade-in motion-reduce:animate-none"
        >
            <Modal className="w-full max-w-md outline-none">
                <Dialog
                    role="alertdialog"
                    aria-describedby="email-sent-modal-desc"
                    className="w-full rounded-[2rem] border-2 border-[#D8D1FF] bg-white p-6 text-center text-[#221B5F] shadow-2xl outline-none sm:p-8"
                >
                    <div
                        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8D1FF]/55 text-[#3f4a9b]"
                        aria-hidden="true"
                    >
                        <ConfettiIcon size={34} weight="bold" />
                    </div>

                    <Heading slot="title" className="font-heading text-2xl font-bold text-[#221B5F]">
                        ¡Revisa tu bandeja!
                    </Heading>

                    <p id="email-sent-modal-desc" className="mt-3 text-sm font-medium leading-relaxed text-[#4f5685]">
                        Te hemos enviado un <strong>código de 6 dígitos</strong> a tu correo electrónico. Escríbelo en la siguiente pantalla para continuar.
                    </p>

                    <div className="my-6 rounded-2xl border border-[#D8D1FF] bg-[#F8F7FF] p-4" aria-hidden="true">
                        <div className="flex items-center justify-around">
                            <div className="flex flex-col items-center gap-1">
                                <EnvelopeSimpleIcon size={20} weight="bold" className="text-[#3f4a9b]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6aa6]">Verifica</span>
                            </div>

                            <ArrowRightIcon size={16} weight="bold" className="text-[#6f6aa6]" />

                            <div className="flex flex-col items-center gap-1 opacity-70">
                                <ConfettiIcon size={20} weight="bold" className="text-[#3f4a9b]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6aa6]">Bluvi</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        autoFocus
                        onClick={onClose}
                        className="w-full bg-bluvi-purple py-4 text-base text-white shadow-lg motion-reduce:transition-none"
                    >
                        Entendido
                    </Button>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
