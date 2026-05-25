import React, { useState } from 'react';
import {
  COMMUNICATION_LABELS,
  NEURODIVERGENCE_LABELS,
} from '../../types/User.types';
import { BrainIcon } from '@phosphor-icons/react';
import { ProfileEditModalShell } from './ProfileEditModalShell';

interface EditMindModalProps {
  currentFeatures: number[];
  currentCommunication: number[];
  onSave: (features: number[], communication: number[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export const EditMindModal: React.FC<EditMindModalProps> = ({
  currentFeatures,
  currentCommunication,
  onSave,
  onClose,
  isSaving,
}) => {
  const [features, setFeatures] = useState<number[]>(currentFeatures);
  const [communication, setCommunication] = useState<number[]>(currentCommunication);

  const toggle = (id: number, type: 'f' | 'c') => {
    if (type === 'f') {
      setFeatures((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
      return;
    }

    setCommunication((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const optionClass = (isSelected: boolean) => `rounded-xl px-3 py-1.5 text-sm transition-all ${
    isSelected
      ? 'bg-app-accent text-app-on-accent shadow-md'
      : 'border border-app-soft bg-app-surface-soft text-app-secondary shadow-sm hover:bg-app-surface-strong hover:text-app-primary'
  } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2`;

  return (
    <ProfileEditModalShell
      title="Mente y Comunicacion"
      icon={<BrainIcon className="h-5 w-5 text-app-accent" weight="bold" aria-hidden="true" />}
      onClose={onClose}
      isSaving={isSaving}
      footer={(
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-full border border-app-soft bg-app-surface px-6 py-2.5 font-semibold text-app-secondary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-app-surface-strong hover:text-app-primary active:translate-y-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(features, communication)}
            disabled={isSaving}
            className="flex-1 rounded-full border-b-2 border-black/10 bg-app-accent px-6 py-2.5 font-semibold text-app-on-accent shadow-md shadow-black/10 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      )}
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-app-secondary">Mis Rasgos</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(NEURODIVERGENCE_LABELS).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => toggle(Number(id), 'f')}
                className={optionClass(features.includes(Number(id)))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-app-secondary">Como me comunico</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COMMUNICATION_LABELS).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => toggle(Number(id), 'c')}
                className={optionClass(communication.includes(Number(id)))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ProfileEditModalShell>
  );
};
