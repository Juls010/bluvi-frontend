import React, { useState } from 'react';
import {
  type User,
  GENDER_LABELS,
  SEXUALITY_LABELS,
} from '../../types/User.types';
import {
  AlignLeftIcon,
  HeartIcon,
  InfoIcon,
  MapPinIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { ProfileEditModalShell } from './ProfileEditModalShell';
import { ProfileSelect } from './ProfileSelect';

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
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    description: user.description || '',
    city: user.city || '',
    id_gender: user.id_gender || 0,
    sexuality: user.sexuality || [],
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'id_gender' ? Number(value) : value,
    }));
  };

  const genderOptions = (Object.keys(GENDER_LABELS) as unknown as Array<keyof typeof GENDER_LABELS>).map((id) => ({
    id: String(id),
    label: GENDER_LABELS[id],
  }));

  const sexualityOptions = (Object.keys(SEXUALITY_LABELS) as unknown as Array<keyof typeof SEXUALITY_LABELS>).map((id) => ({
    id: String(id),
    label: SEXUALITY_LABELS[id],
  }));

  return (
    <ProfileEditModalShell
      title="Informacion Basica"
      icon={<InfoIcon className="h-5 w-5 text-app-accent" weight="bold" aria-hidden="true" />}
      onClose={onClose}
      isSaving={isSaving}
      maxWidthClassName="max-w-lg"
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
            onClick={() => onSave(formData)}
            disabled={isSaving}
            className="flex-1 rounded-full border-b-2 border-black/10 bg-bluvi-purple px-6 py-2.5 font-semibold text-white shadow-md shadow-bluvi-purple/20 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </>
      )}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-app-secondary">
              <UserIcon className="h-3 w-3" weight="bold" aria-hidden="true" />
              Nombre
            </label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-bold uppercase text-app-secondary">Apellido</label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-app-secondary">
            <AlignLeftIcon className="h-3 w-3" weight="bold" aria-hidden="true" />
            Sobre mi
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full resize-none rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium leading-relaxed text-app-primary outline-none transition-all placeholder:text-app-muted focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
            placeholder="Escribe algo sobre ti..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-app-secondary">
            <MapPinIcon className="h-3 w-3" weight="bold" aria-hidden="true" />
            Ubicacion
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad, Pais"
            className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 text-sm font-medium text-app-primary outline-none transition-all placeholder:text-app-muted focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileSelect
            label="Identidad de genero"
            ariaLabel="Identidad de genero"
            selectedKey={String(formData.id_gender)}
            description="Pulsa Enter o Espacio para abrir las opciones. Usa las flechas para moverte por la lista."
            isDisabled={isSaving}
            options={genderOptions}
            onSelectionChange={(key) => setFormData((current) => ({ ...current, id_gender: Number(key) }))}
          />

          <ProfileSelect
            label={(
              <>
                <HeartIcon className="h-3 w-3" weight="bold" aria-hidden="true" />
                Orientacion
              </>
            )}
            ariaLabel="Orientacion"
            selectedKey={formData.sexuality[0] ? String(formData.sexuality[0]) : null}
            placeholder="Seleccionar..."
            description="Pulsa Enter o Espacio para abrir las opciones. Usa las flechas para moverte por la lista."
            isDisabled={isSaving}
            options={sexualityOptions}
            onSelectionChange={(key) => setFormData((current) => ({ ...current, sexuality: [Number(key)] }))}
          />
        </div>
      </div>
    </ProfileEditModalShell>
  );
};
