import React, { useState } from 'react';
import { NEURODIVERGENCE_LABELS, COMMUNICATION_LABELS } from '../../types/User.types';
import { X } from 'lucide-react';

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
  isSaving
}) => {
  const [features, setFeatures] = useState<number[]>(currentFeatures);
  const [communication, setCommunication] = useState<number[]>(currentCommunication);

  const toggle = (id: number, type: 'f' | 'c') => {
    if (type === 'f') {
      setFeatures(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setCommunication(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-app-surface-strong text-app-primary w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-app-soft">
        
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-app-primary">Mente y Comunicación</h2>
          <button onClick={onClose} className="p-2 rounded-full text-app-muted hover:bg-app-surface-soft hover:text-app-primary">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-app-surface-strong">
          {/* SECCIÓN RASGOS */}
          <div>
            <h3 className="text-sm font-bold text-app-secondary uppercase mb-3">Mis Rasgos</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(NEURODIVERGENCE_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => toggle(Number(id), 'f')}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                    features.includes(Number(id)) ? 'bg-bluvi-purple text-white' : 'bg-app-surface text-app-secondary hover:bg-app-surface-soft border border-app-soft'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN COMUNICACIÓN */}
          <div>
            <h3 className="text-sm font-bold text-app-secondary uppercase mb-3">Cómo me comunico</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COMMUNICATION_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => toggle(Number(id), 'c')}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                    communication.includes(Number(id)) ? 'bg-bluvi-purple text-white' : 'bg-app-surface text-app-secondary hover:bg-app-surface-soft border border-app-soft'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-app-surface-soft flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 px-6 rounded-full border border-app-soft border-b-2 border-black/10 bg-app-surface text-app-secondary font-semibold shadow-sm hover:text-app-primary hover:bg-app-surface-strong hover:-translate-y-0.5 active:translate-y-0 transition-all">Cancelar</button>
          <button 
            onClick={() => onSave(features, communication)}
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
