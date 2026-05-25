import React, { useEffect, useRef, useState } from 'react';
import {
  type User,
  GENDER_LABELS,
  SEXUALITY_LABELS,
} from '../../types/User.types';
import {
  CaretRightIcon,
  AlignLeftIcon,
  CheckCircleIcon,
  HeartIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { ProfileEditModalShell } from './ProfileEditModalShell';
import { ProfileSelect } from './ProfileSelect';
import { searchCities, type CitySuggestion } from '../../services/cities.service';

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
  const CITY_LISTBOX_ID = 'basic-info-city-listbox';
  const comboboxRef = useRef<HTMLDivElement>(null);
  const searchDelayRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    description: user.description || '',
    city: user.city || '',
    city_lat: user.city_lat ?? null,
    city_lng: user.city_lng ?? null,
    id_gender: user.id_gender || 0,
    sexuality: user.sexuality || [],
  });

  const [cityQuery, setCityQuery] = useState(user.city || '');
  const [selectedCity, setSelectedCity] = useState(user.city || '');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cityLiveMsg, setCityLiveMsg] = useState('');

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const trimmedQuery = cityQuery.trim();

    if (searchDelayRef.current) {
      window.clearTimeout(searchDelayRef.current);
      searchDelayRef.current = null;
    }

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoadingCities(false);
      return;
    }

    const controller = new AbortController();
    searchDelayRef.current = window.setTimeout(async () => {
      setIsLoadingCities(true);
      try {
        const results = await searchCities(trimmedQuery, 6, controller.signal);
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setActiveIndex(-1);
          setIsLoadingCities(false);
          setCityLiveMsg(
            results.length === 0
              ? 'No se encontraron ciudades.'
              : `${results.length} ${results.length === 1 ? 'ciudad disponible' : 'ciudades disponibles'}.`
          );
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error searching cities:', error);
        }
        setIsLoadingCities(false);
      }
    }, 250);

    return () => {
      controller.abort();
      if (searchDelayRef.current) {
        window.clearTimeout(searchDelayRef.current);
        searchDelayRef.current = null;
      }
    };
  }, [cityQuery]);

  const normalizedQuery = cityQuery.trim().toLowerCase();
  const normalizedSelected = selectedCity.trim().toLowerCase();
  const isConfirmed = normalizedSelected.length > 0 && normalizedQuery === normalizedSelected;
  const hasSuggestions = showSuggestions && cityQuery.length > 0 && !isConfirmed;
  const activeDescendantId = activeIndex >= 0 && suggestions[activeIndex]
    ? `basic-info-city-option-${suggestions[activeIndex].id}`
    : undefined;

  const syncCity = (city: string, cityLat: number | null, cityLng: number | null) => {
    setFormData((current) => ({
      ...current,
      city,
      city_lat: cityLat,
      city_lng: cityLng,
    }));
  };

  const handleCitySelect = (suggestion: CitySuggestion) => {
    setCityQuery(suggestion.value);
    setSelectedCity(suggestion.value);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setCityLiveMsg(`Ciudad seleccionada: ${suggestion.value}.`);
    syncCity(suggestion.value, suggestion.lat ?? null, suggestion.lng ?? null);
  };

  const handleCityInputChange = (value: string) => {
    setCityQuery(value);
    setShowSuggestions(true);
    setCityLiveMsg('Buscando ciudades...');

    const normalizedTyped = value.trim().toLowerCase();
    if (normalizedTyped !== selectedCity.trim().toLowerCase()) {
      setSelectedCity('');
      syncCity(value, null, null);
    } else {
      syncCity(value, formData.city_lat ?? null, formData.city_lng ?? null);
    }

    setActiveIndex(-1);
  };

  const handleCityClear = () => {
    setCityQuery('');
    setSelectedCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setCityLiveMsg('Ciudad eliminada.');
    syncCity('', null, null);
  };

  const handleCityKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1;
        return prev < suggestions.length - 1 ? prev + 1 : 0;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1;
        return prev > 0 ? prev - 1 : suggestions.length - 1;
      });
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      handleCitySelect(suggestions[activeIndex]);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

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
      maxWidthClassName="max-w-2xl"
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
            className="flex-1 rounded-full border-b-2 border-black/10 bg-app-accent px-6 py-2.5 font-semibold text-app-on-accent shadow-md shadow-black/10 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
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
          <div className="group relative" ref={comboboxRef}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-accent transition-colors" size={18} weight="bold" aria-hidden="true" />
              <input
                name="city"
                value={cityQuery}
                onChange={(event) => handleCityInputChange(event.target.value)}
                onKeyDown={handleCityKeyDown}
                onFocus={() => {
                  if (!isConfirmed) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Escribe una ciudad..."
                className="w-full rounded-2xl border border-app-strong bg-app-surface px-4 py-3 pl-12 pr-10 text-sm font-medium text-app-primary outline-none transition-all placeholder:text-app-muted focus:border-app-focus focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2"
                role="combobox"
                aria-label="Buscar ciudad"
                aria-autocomplete="list"
                aria-controls={CITY_LISTBOX_ID}
                aria-expanded={hasSuggestions}
                aria-activedescendant={activeDescendantId}
              />
              {cityQuery.length > 0 && (
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleCityClear();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-app-muted transition-colors hover:text-app-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
                  aria-label="Limpiar ciudad"
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
              <p className="sr-only" role="status" aria-live="polite">
                {cityLiveMsg}
              </p>
            </div>

            {hasSuggestions && (
              <ul
                id={CITY_LISTBOX_ID}
                className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto overflow-hidden rounded-2xl border border-app-soft bg-app-surface-strong shadow-2xl"
                role="listbox"
              >
                {isLoadingCities ? (
                  <li className="px-4 py-3 text-sm text-app-secondary" role="presentation">Buscando ciudades...</li>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.id}
                      id={`basic-info-city-option-${suggestion.id}`}
                      role="option"
                      aria-selected={selectedCity === suggestion.value}
                      tabIndex={0}
                      onFocus={() => setActiveIndex(index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleCitySelect(suggestion);
                        }
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleCitySelect(suggestion);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-medium text-app-primary outline-none transition-colors focus:bg-app-surface-soft ${index === activeIndex ? 'bg-app-surface-soft' : 'hover:bg-app-surface-soft/70'}`}
                    >
                      <span>{suggestion.label}</span>
                      {selectedCity === suggestion.value ? (
                        <CheckCircleIcon size={18} weight="bold" />
                      ) : (
                        <CaretRightIcon size={18} weight="bold" className="opacity-30" />
                      )}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm italic text-app-muted" role="presentation">No encontramos esa ciudad...</li>
                )}
              </ul>
            )}
          </div>
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
