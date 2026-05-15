import React, { useState } from 'react';
import {
    INTEREST_LABELS } from '../../types/User.types';
import { XIcon
} from '@phosphor-icons/react';

interface EditInterestsModalProps {
  currentInterests: number[]; // Recibimos IDs
  onSave: (newInterests: number[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export const EditInterestsModal: React.FC<EditInterestsModalProps> = ({
  currentInterests,
  onSave,
  onClose,
  isSaving
}) => {
  const [selected, setSelected] = useState<number[]>(currentInterests);
  const [search, setSearch] = useState('');

  const toggleInterest = (id: number) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = Object.entries(INTEREST_LABELS).filter(([, label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-app-surface-strong text-app-primary w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-app-soft">
        
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-app-primary">Editar Intereses</h2>
          <button onClick={onClose} className="p-2 rounded-full text-app-muted hover:bg-app-surface-soft hover:text-app-primary">
            <XIcon size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 bg-app-surface-strong">
          <input 
            type="text"
            placeholder="Buscar intereses..."
            className="w-full px-4 py-2 rounded-xl border border-app-strong bg-app-surface text-app-primary placeholder:text-app-muted focus:ring-2 focus:ring-bluvi-purple/20 focus:border-bluvi-purple/45 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {filtered.map(([id, label]) => {
              const isSelected = selected.includes(Number(id));
              return (
                <button
                  key={id}
                  onClick={() => toggleInterest(Number(id))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isSelected 
                      ? 'bg-bluvi-purple text-white shadow-md' 
                      : 'bg-app-surface text-app-secondary hover:bg-app-surface-soft border border-app-soft'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-app-surface-soft flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 px-6 rounded-full border border-app-soft border-b-2 border-black/10 bg-app-surface font-semibold text-app-secondary shadow-sm hover:text-app-primary hover:bg-app-surface-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(selected)}
            disabled={isSaving}
            className="flex-1 py-2.5 px-6 bg-bluvi-purple text-white rounded-full font-semibold shadow-md shadow-bluvi-purple/20 border-b-2 border-black/10 disabled:opacity-50 hover:brightness-105 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
