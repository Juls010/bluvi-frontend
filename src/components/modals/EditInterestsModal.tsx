import React, { useState } from 'react';
import { INTEREST_LABELS } from '../../types/User.types';
import { HeartIcon } from '@phosphor-icons/react';
import { ProfileEditModalShell } from './ProfileEditModalShell';

interface EditInterestsModalProps {
  currentInterests: number[];
  onSave: (newInterests: number[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export const EditInterestsModal: React.FC<EditInterestsModalProps> = ({
  currentInterests,
  onSave,
  onClose,
  isSaving,
}) => {
  const [selected, setSelected] = useState<number[]>(currentInterests);
  const [search, setSearch] = useState('');

  const toggleInterest = (id: number) => {
    setSelected((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const filtered = Object.entries(INTEREST_LABELS).filter(([, label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProfileEditModalShell
      title="Editar Intereses"
      icon={<HeartIcon className="h-5 w-5 text-app-accent" weight="bold" aria-hidden="true" />}
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
            onClick={() => onSave(selected)}
            disabled={isSaving}
            className="flex-1 rounded-full border-b-2 border-black/10 bg-bluvi-purple px-6 py-2.5 font-semibold text-white shadow-md shadow-bluvi-purple/20 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      )}
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar intereses..."
          className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all placeholder:text-app-muted focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {filtered.map(([id, label]) => {
            const isSelected = selected.includes(Number(id));
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(Number(id))}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'bg-bluvi-purple text-white shadow-md'
                    : 'border border-app-soft bg-app-surface-soft text-app-secondary shadow-sm hover:bg-app-surface-strong hover:text-app-primary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </ProfileEditModalShell>
  );
};
