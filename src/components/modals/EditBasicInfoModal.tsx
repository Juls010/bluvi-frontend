import React, { useState } from 'react';
import {
    type User,
    GENDER_LABELS,
    SEXUALITY_LABELS } from '../../types/User.types';
import { UserIcon,
    MapPinIcon,
    AlignLeftIcon,
    InfoIcon,
    XIcon,
    HeartIcon
} from '@phosphor-icons/react';

interface EditBasicInfoModalProps {
  user: User;
  onSave: (updatedData: Partial<User>) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export const EditBasicInfoModal: React.FC<EditBasicInfoModalProps> = ({
  user,
  onSave,
  onClose,
  isSaving
}) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    description: user.description || '',
    city: user.city || '',
    id_gender: user.id_gender || 0,
    sexuality: user.sexuality || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'id_gender' ? Number(value) : value 
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-app-surface-strong text-app-primary w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-app-soft">
        
        {/* Cabecera */}
        <div className="p-6 flex justify-between items-center bg-app-surface-strong">
          <h2 className="text-xl font-bold text-app-primary flex items-center gap-2">
            <InfoIcon className="text-app-accent w-5 h-5" weight="bold" /> Información Básica
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-app-surface-soft rounded-full transition-colors text-app-muted">
            <XIcon className="w-5 h-5" weight="bold" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 overflow-y-auto space-y-5 bg-app-surface-strong">
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-app-secondary uppercase ml-1 flex items-center gap-1">
                <UserIcon className="w-3 h-3" weight="bold" /> Nombre
              </label>
              <input 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-app-secondary uppercase ml-1">Apellido</label>
              <input 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Biografía */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-app-secondary uppercase ml-1 flex items-center gap-1">
              <AlignLeftIcon className="w-3 h-3" weight="bold" /> Sobre mí
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm resize-none leading-relaxed placeholder:text-app-muted"
              placeholder="Escribe algo sobre ti..."
            />
          </div>

          {/* Ciudad */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-app-secondary uppercase ml-1 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" weight="bold" /> Ubicación
            </label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ciudad, País"
              className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm font-medium placeholder:text-app-muted"
            />
          </div>

          {/* Género y Orientación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-app-secondary uppercase ml-1">Identidad de género</label>
              <select 
                name="id_gender"
                value={formData.id_gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
              >
                {(Object.keys(GENDER_LABELS) as unknown as Array<keyof typeof GENDER_LABELS>).map((id) => (
                    <option key={id} value={id}>
                    {GENDER_LABELS[id]}
                    </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-app-secondary uppercase ml-1 flex items-center gap-1">
                <HeartIcon className="w-3 h-3" weight="bold" /> Orientación
              </label>
              <select 
                name="sexuality"
                value={formData.sexuality[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, sexuality: [Number(e.target.value)] }))}
                className="w-full px-4 py-3 bg-app-surface text-app-primary rounded-2xl border border-app-strong focus:border-bluvi-purple/45 focus:ring-2 focus:ring-bluvi-purple/20 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="">Seleccionar...</option>
                {(Object.keys(SEXUALITY_LABELS) as unknown as Array<keyof typeof SEXUALITY_LABELS>).map((id) => (
                    <option key={id} value={id}>
                    {SEXUALITY_LABELS[id]}
                    </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-app-surface-soft flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 px-6 rounded-full border border-app-soft border-b-2 border-black/10 bg-app-surface text-app-secondary font-semibold shadow-sm hover:text-app-primary hover:bg-app-surface-strong hover:-translate-y-0.5 active:translate-y-0 transition-all">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={isSaving}
            className="flex-1 py-2.5 px-6 bg-bluvi-purple text-white rounded-full font-semibold shadow-md shadow-bluvi-purple/20 border-b-2 border-black/10 disabled:opacity-50 transition-all hover:brightness-105 hover:-translate-y-0.5 active:scale-95"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
