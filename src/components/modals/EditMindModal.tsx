import React, { useState } from 'react';
import { NEURODIVERGENCE_LABELS, COMMUNICATION_LABELS } from '../../types/User.types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Mente y Comunicación</h2>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* SECCIÓN RASGOS */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Mis Rasgos</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(NEURODIVERGENCE_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => toggle(Number(id), 'f')}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                    features.includes(Number(id)) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN COMUNICACIÓN */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Cómo me comunico</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COMMUNICATION_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => toggle(Number(id), 'c')}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                    communication.includes(Number(id)) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-semibold">Cancelar</button>
          <button 
            onClick={() => onSave(features, communication)}
            disabled={isSaving}
            className="flex-1 py-3 bg-bluvi-purple text-white rounded-2xl font-semibold disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};