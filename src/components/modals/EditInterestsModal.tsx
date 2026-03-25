import React, { useState } from 'react';
import { INTEREST_LABELS } from '../../types/User.types';

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

  const filtered = Object.entries(INTEREST_LABELS).filter(([_, label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Editar Intereses</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <input 
            type="text"
            placeholder="Buscar intereses..."
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bluvi-purple/20 outline-none"
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
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 font-semibold text-gray-500"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(selected)}
            disabled={isSaving}
            className="flex-1 py-3 bg-bluvi-purple text-white rounded-2xl font-semibold shadow-lg shadow-bluvi-purple/20 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};