import React, { useCallback, useEffect, useState, useRef } from 'react';

// ── ARIA id constants ──────────────────────────────────────────────────────────
const DIALOG_TITLE_ID      = 'filter-dialog-title';
const CITY_INPUT_ID        = 'filter-city-input';
const CITY_LISTBOX_ID      = 'filter-city-listbox';
const DISTANCE_INPUT_ID    = 'filter-distance-input';
const SEC_LOCATION_ID      = 'filter-sec-location';
const SEC_INTERESTS_ID     = 'filter-sec-interests';
const SEC_COMMUNICATION_ID = 'filter-sec-communication';
const SEC_SENSORY_ID       = 'filter-sec-sensory';
import { CaretRightIcon, ChatCircleIcon, CheckCircleIcon, FunnelIcon, MagnifyingGlassIcon, MapPinIcon, SparkleIcon, XIcon } from '@phosphor-icons/react';
import { searchCities, type CitySuggestion } from '../services/cities.service';

export interface FilterData {
  selectedTags: string[];
  city: string;
  distance: number;
  communicationStyle: string[];
  sensoryPref: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters: FilterData;
  interestsOptions: string[];
  communicationOptions: string[];
  sensoryOptions: string[];
}

export const DiscoveryFilter: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  interestsOptions,
  communicationOptions,
  sensoryOptions,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.selectedTags);
  const [city, setCity] = useState(initialFilters.city);
  const [distance, setDistance] = useState(initialFilters.distance || 0);
  const [communicationStyle, setCommunicationStyle] = useState<string[]>(initialFilters.communicationStyle || []);
  const [sensoryPref, setSensoryPref] = useState<string[]>(initialFilters.sensoryPref || []);

  const [cityQuery, setCityQuery] = useState(initialFilters.city || '');
  const [selectedCity, setSelectedCity] = useState(initialFilters.city || '');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cityLiveMsg, setCityLiveMsg] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const drawerRef      = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const comboboxRef    = useRef<HTMLDivElement>(null);

  const CLOSE_DURATION_MS = 250;
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, CLOSE_DURATION_MS);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setSelectedTags(initialFilters.selectedTags || []);
      setCity(initialFilters.city || '');
      setCityQuery(initialFilters.city || '');
      setSelectedCity(initialFilters.city || '');
      setDistance(initialFilters.distance || 0);
      setCommunicationStyle(initialFilters.communicationStyle || []);
      setSensoryPref(initialFilters.sensoryPref || []);

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Move focus into dialog
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen, initialFilters]);

  useEffect(() => {
    const trimmedQuery = cityQuery.trim();
    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoadingCities(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsLoadingCities(true);
      try {
        const results = await searchCities(trimmedQuery, 6, controller.signal);
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setActiveIndex(-1);
          setIsLoadingCities(false);
          setCityLiveMsg(results.length === 0
            ? 'No se encontraron ciudades.'
            : `${results.length} ${results.length === 1 ? 'ciudad disponible' : 'ciudades disponibles'}.`);
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
      clearTimeout(timeoutId);
    };
  }, [cityQuery]);

  // ── Focus trap + Escape closes dialog ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); handleClose(); return; }
      if (e.key !== 'Tab') return;
      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // ── Close suggestions on outside pointer ────────────────────────────────────
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

  const toggleItem = (setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  // Derived combobox state
  const normalizedQuery    = cityQuery.trim().toLowerCase();
  const normalizedSelected = selectedCity.trim().toLowerCase();
  const isConfirmed        = normalizedSelected.length > 0 && normalizedQuery === normalizedSelected;
  const hasSuggestions     = showSuggestions && cityQuery.length > 0 && !isConfirmed;
  const activeDescendantId = activeIndex >= 0 && suggestions[activeIndex]
    ? `filter-city-option-${suggestions[activeIndex].id}`
    : undefined;

  const handleCitySelect = (suggestion: CitySuggestion) => {
    setCity(suggestion.value);
    setCityQuery(suggestion.value);
    setSelectedCity(suggestion.value);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setCityLiveMsg(`Ciudad seleccionada: ${suggestion.value}.`);
  };

  const handleCityInputChange = (value: string) => {
    setCityQuery(value);
    setShowSuggestions(true);
    setCityLiveMsg('Buscando ciudades...');
    const normalizedTyped = value.trim().toLowerCase();
    if (normalizedTyped !== selectedCity.trim().toLowerCase()) {
      setSelectedCity('');
      setCity('');
    }
    setActiveIndex(-1);
  };

  const handleCityClear = () => {
    setCityQuery('');
    setCity('');
    setSelectedCity('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setCityLiveMsg('Ciudad eliminada.');
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length === 0 ? -1 : prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length === 0 ? -1 : prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleCitySelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-stretch justify-center md:justify-start p-0">
      <div
        className={`absolute inset-0 bg-black/40 dark:bg-black/70 motion-reduce:animate-none z-0 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={DIALOG_TITLE_ID}
        className={`
          relative z-10 w-full md:w-[420px] bg-app-surface-solid 
          text-app-primary shadow-2xl overflow-hidden border-t md:border-t-0 md:border-r border-app-soft/50
          transition-none flex flex-col
          max-h-[90svh] md:max-h-none
          ${isClosing
            ? 'animate-slide-down md:animate-slide-out-left'
            : 'animate-slide-up md:animate-slide-in-left'
          }
          rounded-t-[40px] md:rounded-t-none md:rounded-r-[48px]
        `}
      >
        {/* Drag handle — only visible on mobile */}
        <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>

        <div className="px-6 pt-4 pb-4 md:px-8 md:pt-10 md:pb-6">
          <header className="flex justify-between items-start gap-4">
            <div>
              <h2 id={DIALOG_TITLE_ID} className="text-2xl md:text-3xl font-heading font-bold text-app-primary tracking-tight">Explorar</h2>
              <p className="text-xs md:text-sm text-app-secondary mt-0.5 md:mt-1 font-medium">Personaliza tu búsqueda</p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              aria-label="Cerrar panel de filtros"
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2 mt-0.5 md:mt-1"
              style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
            >
              <XIcon size={20} weight="bold" aria-hidden="true" />
            </button>
          </header>
        </div>

        <div className="flex-1 px-6 md:px-8 space-y-8 md:space-y-10 overflow-y-auto overscroll-contain custom-scrollbar pb-36">
          <section aria-labelledby={SEC_LOCATION_ID} className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                aria-hidden="true"
              >
                <MapPinIcon size={20} weight="bold" />
              </div>
              <h3 id={SEC_LOCATION_ID} className="text-xs font-bold text-app-secondary uppercase tracking-[0.2em]">Cerca de ti</h3>
            </div>

            <div className="space-y-6 pl-1">
              <div className="group relative" ref={comboboxRef}>
                <label
                  htmlFor={CITY_INPUT_ID}
                  className="text-[11px] font-bold text-app-muted uppercase tracking-wider mb-2 block transition-colors group-focus-within:text-app-accent"
                >
                  Ciudad
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-accent transition-colors" size={18} weight="bold" aria-hidden="true" />
                  <input
                    id={CITY_INPUT_ID}
                    type="text"
                    value={cityQuery}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    onKeyDown={handleCityKeyDown}
                    onFocus={() => { if (!isConfirmed) setShowSuggestions(true); }}
                    placeholder="Escribe una ciudad..."
                    className="w-full px-5 py-4 pl-12 pr-10 rounded-2xl border text-app-primary text-sm placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-app-focus/80 focus:ring-offset-2 focus:border-app-focus transition-all font-medium"
                    style={{ backgroundColor: 'var(--filter-unselected-bg)', borderColor: 'var(--filter-unselected-border)', borderWidth: '1px' }}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={hasSuggestions}
                    aria-controls={CITY_LISTBOX_ID}
                    aria-activedescendant={activeDescendantId}
                    aria-label="Buscar ciudad"
                  />
                  {cityQuery.length > 0 && !isLoadingCities && (
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleCityClear(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-primary transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
                      aria-label="Limpiar ciudad"
                    >
                      <XIcon size={16} weight="bold" aria-hidden="true" />
                    </button>
                  )}
                  {isLoadingCities && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-app-accent border-t-transparent rounded-full" aria-hidden="true" />
                  )}
                </div>
                {/* Live region for screen readers */}
                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{cityLiveMsg}</p>

                {hasSuggestions && (
                  <ul
                    id={CITY_LISTBOX_ID}
                    role="listbox"
                    aria-label="Ciudades sugeridas"
                    className="absolute z-50 w-full mt-2 bg-app-surface-solid border border-app-soft rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto animate-fade-in"
                    style={{ backgroundColor: 'var(--app-surface-solid)', borderColor: 'var(--filter-unselected-border)' }}
                  >
                    {isLoadingCities ? (
                      <li role="presentation" className="px-5 py-3.5 text-sm text-app-muted">Buscando ciudades...</li>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <li
                          key={suggestion.id}
                          id={`filter-city-option-${suggestion.id}`}
                          role="option"
                          aria-selected={city === suggestion.value}
                          onMouseDown={(e) => { e.preventDefault(); handleCitySelect(suggestion); }}
                          onMouseEnter={() => setActiveIndex(index)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left text-app-primary text-sm transition-colors border-b border-app-soft last:border-0 cursor-pointer"
                          style={{ backgroundColor: index === activeIndex ? 'var(--app-surface-soft)' : 'transparent' }}
                        >
                          <span className="font-medium">{suggestion.label}</span>
                          {city === suggestion.value
                            ? <CheckCircleIcon size={16} weight="bold" className="text-app-accent" aria-hidden="true" />
                            : <CaretRightIcon size={16} weight="bold" className="text-app-muted" aria-hidden="true" />}
                        </li>
                      ))
                    ) : (
                      <li role="presentation" className="px-5 py-3.5 text-sm text-app-muted italic">No encontramos esa ciudad...</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <label htmlFor={DISTANCE_INPUT_ID} className="text-[11px] font-bold text-app-muted uppercase tracking-wider">
                    Radio de distancia
                  </label>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                    aria-hidden="true"
                  >
                    {distance === 0 ? 'Toda España' : `${distance} km`}
                  </span>
                </div>
                <div className="relative pt-2">
                  <input
                    id={DISTANCE_INPUT_ID}
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer transition-all"
                    style={{
                      '--slider-progress': `${(distance / 200) * 100}%`,
                      accentColor: 'var(--filter-slider-thumb)'
                    } as React.CSSProperties}
                    aria-label="Radio de distancia en kilómetros"
                    aria-valuetext={distance === 0 ? 'Sin límite, toda España' : `${distance} kilómetros`}
                  />
                  <div className="flex justify-between mt-3 text-[10px] text-app-muted font-bold tracking-widest opacity-50" aria-hidden="true">
                    <span>MÁXIcon. CERCANÍA</span>
                    <span>+200 KM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby={SEC_INTERESTS_ID} className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                aria-hidden="true"
              >
                <FunnelIcon size={20} weight="bold" />
              </div>
              <h3 id={SEC_INTERESTS_ID} className="text-xs font-bold text-app-secondary uppercase tracking-[0.2em]">Intereses y Hyperfocus</h3>
            </div>

            <div className="flex flex-wrap gap-2 pl-1">
              {interestsOptions.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleItem(setSelectedTags, tag)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border`}
                    style={isSelected ? {
                      backgroundColor: 'var(--filter-selected-bg)',
                      color: 'var(--filter-selected-text)',
                      borderColor: 'var(--filter-selected-border)'
                    } : {
                      backgroundColor: 'var(--filter-unselected-bg)',
                      color: 'var(--app-text-secondary)',
                      borderColor: 'var(--filter-unselected-border)'
                    }}
                    aria-pressed={isSelected}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby={SEC_COMMUNICATION_ID} className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                aria-hidden="true"
              >
                <ChatCircleIcon size={20} weight="bold" />
              </div>
              <h3 id={SEC_COMMUNICATION_ID} className="text-xs font-bold text-app-secondary uppercase tracking-[0.2em]">Comunicación</h3>
            </div>

            <div className="flex flex-wrap gap-2 pl-1">
              {communicationOptions.map(style => {
                const isSelected = communicationStyle.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleItem(setCommunicationStyle, style)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border`}
                    style={isSelected ? {
                      backgroundColor: 'var(--filter-selected-bg)',
                      color: 'var(--filter-selected-text)',
                      borderColor: 'var(--filter-selected-border)'
                    } : {
                      backgroundColor: 'var(--filter-unselected-bg)',
                      color: 'var(--app-text-secondary)',
                      borderColor: 'var(--filter-unselected-border)'
                    }}
                    aria-pressed={isSelected}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby={SEC_SENSORY_ID} className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--filter-icon-bg)', color: 'var(--filter-icon-text)' }}
                aria-hidden="true"
              >
                <SparkleIcon size={20} weight="bold" />
              </div>
              <h3 id={SEC_SENSORY_ID} className="text-xs font-bold text-app-secondary uppercase tracking-[0.2em]">Sensibilidad y Entorno</h3>
            </div>

            <div className="flex flex-wrap gap-2 pl-1">
              {sensoryOptions.map(pref => {
                const isSelected = sensoryPref.includes(pref);
                return (
                  <button
                    key={pref}
                    onClick={() => toggleItem(setSensoryPref, pref)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border`}
                    style={isSelected ? {
                      backgroundColor: 'var(--filter-selected-bg)',
                      color: 'var(--filter-selected-text)',
                      borderColor: 'var(--filter-selected-border)'
                    } : {
                      backgroundColor: 'var(--filter-unselected-bg)',
                      color: 'var(--app-text-secondary)',
                      borderColor: 'var(--filter-unselected-border)'
                    }}
                    aria-pressed={isSelected}
                  >
                    {pref}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-6 pt-10 pb-6 md:px-8 md:pb-8 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to top, var(--app-surface-solid) 0%, var(--app-surface-solid) 65%, transparent 100%)',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
          }}
        >
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={() => {
                setSelectedTags([]);
                setCity('');
                setCityQuery('');
                setSelectedCity('');
                setSuggestions([]);
                setShowSuggestions(false);
                setDistance(0);
                setCommunicationStyle([]);
                setSensoryPref([]);
              }}
              aria-label="Resetear todos los filtros"
              className="px-6 py-4 rounded-2xl border text-app-secondary font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
              style={{
                backgroundColor: 'var(--filter-unselected-bg)',
                borderColor: 'var(--filter-unselected-border)'
              }}
            >
              Limpiar
            </button>

            <button
              onClick={() => onApply({
                selectedTags,
                city,
                distance,
                communicationStyle,
                sensoryPref
              })}
              className="flex-1 py-4 rounded-2xl font-bold text-base shadow-xl transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--app-accent)',
                color: 'var(--app-on-accent)',
              }}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FilterTriggerButton: React.FC<{
  activeCount: number;
  onClick: () => void;
}> = ({ activeCount, onClick }) => (
  <button
    onClick={onClick}
    aria-label={activeCount > 0 ? `Abrir filtros, ${activeCount} activos` : 'Abrir filtros'}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all shadow-sm hover:shadow bg-app-filter-trigger backdrop-blur-sm text-app-primary border-app-soft hover:bg-app-filter-trigger-hover hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2"
  >
    <FunnelIcon size={16} weight="bold" className="text-app-filter-icon shrink-0" aria-hidden="true" />
    <span>Filtros</span>
    {activeCount > 0 && (
      <span
        className="text-app-on-accent text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop"
        style={{ backgroundColor: 'var(--app-accent)' }}
      >
        {activeCount}
      </span>
    )}
  </button>
);
