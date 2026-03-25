import React, { useState } from 'react';
import  { type User, GENDER_LABELS, SEXUALITY_LABELS } from '../../types/User.types';
import { User as UserIcon, MapPin, AlignLeft, Info, X, Heart } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white">
        
        {/* Cabecera */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Info className="text-bluvi-purple w-5 h-5" /> Información Básica
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white">
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Nombre
              </label>
              <input 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Apellido</label>
              <input 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Biografía */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Sobre mí
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm resize-none leading-relaxed"
              placeholder="Escribe algo sobre ti..."
            />
          </div>

          {/* Ciudad */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Ubicación
            </label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ciudad, País"
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm font-medium"
            />
          </div>

          {/* Género y Orientación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Identidad de género</label>
              <select 
                name="id_gender"
                value={formData.id_gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
              >
                {(Object.keys(GENDER_LABELS) as unknown as Array<keyof typeof GENDER_LABELS>).map((id) => (
                    <option key={id} value={id}>
                    {GENDER_LABELS[id]}
                    </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Orientación
              </label>
              <select 
                name="sexuality"
                value={formData.sexuality[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, sexuality: [Number(e.target.value)] }))}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-bluvi-purple/20 focus:bg-white transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
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
        <div className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={isSaving}
            className="flex-1 py-3 bg-bluvi-purple text-white rounded-2xl font-bold shadow-lg shadow-bluvi-purple/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};