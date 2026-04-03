import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';

export interface FilterData {
  selectedTags: string[];
  city: string;
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
  const [communicationStyle, setCommunicationStyle] = useState<string[]>(initialFilters.communicationStyle || []);
  const [sensoryPref, setSensoryPref] = useState<string[]>(initialFilters.sensoryPref || []);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedTags(initialFilters.selectedTags || []);
    setCity(initialFilters.city || '');
    setCommunicationStyle(initialFilters.communicationStyle || []);
    setSensoryPref(initialFilters.sensoryPref || []);
  }, [isOpen, initialFilters]);

  // Función genérica para toggles
  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Fondo desenfocado */}
      <div className="absolute inset-0 bg-bluvi-purple/20 backdrop-blur-md animate-fade-in motion-reduce:animate-none" onClick={onClose} />

      {/* Panel Principal */}
      <div className="relative w-full max-w-lg bg-white/98 rounded-t-[40px] md:rounded-[32px] shadow-2xl overflow-hidden animate-slide-up motion-reduce:animate-none border border-white/60">
        
        {/* Decoración superior */}
        <div className="h-1.5 w-12 bg-gray-200 rounded-full mx-auto mt-4 mb-2 md:hidden" />

        <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <header className="flex justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800">Filtros</h2>
              <p className="text-sm text-gray-500 mt-1">Ajusta tu exploración sin sobrecargar la pantalla.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
            >
              ✕
            </button>
          </header>

          <details open className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ciudad</span>
              {city && (
                <span className="text-[10px] font-bold text-bluvi-purple bg-bluvi-purple/10 px-2 py-1 rounded-lg">Activa</span>
              )}
            </summary>

            <section className="space-y-4 mt-4">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                Ciudad
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Madrid"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-bluvi-purple/20"
              />
            </div>
            </section>
          </details>

          {/* Tags Rápidos */}
          <details className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Intereses y Hyperfocus</span>
              <span className="text-[10px] font-bold text-bluvi-purple bg-bluvi-purple/10 px-2 py-1 rounded-lg">{selectedTags.length}</span>
            </summary>

            <section className="mt-4">
            <div className="flex justify-between items-end mb-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">
                  Intereses y Hyperfocus
                </label>
                <p className="text-[10px] text-gray-400 ml-1 mt-1">Selecciona lo que te apasiona hoy</p>
              </div>
              <span className="text-[10px] font-bold text-bluvi-purple bg-bluvi-purple/5 px-2 py-1 rounded-lg">
                {selectedTags.length} seleccionados
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5" aria-label="Opciones de intereses">
              {interestsOptions.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleItem(selectedTags, setSelectedTags, tag)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20
                      ${isSelected 
                        ? 'bg-bluvi-purple text-white border-bluvi-purple shadow-md' 
                        : 'bg-white text-gray-500 border-gray-100 hover:border-bluvi-purple/20'}`}
                    aria-pressed={isSelected}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            </section>
          </details>

          <details className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estilo de comunicación</span>
              <span className="text-[10px] font-bold text-bluvi-purple bg-bluvi-purple/10 px-2 py-1 rounded-lg">{communicationStyle.length}</span>
            </summary>

            <section className="mt-4">
            <div className="flex flex-wrap gap-2" aria-label="Opciones de comunicación">
              {communicationOptions.map(style => (
                <button 
                  key={style}
                  onClick={() => toggleItem(communicationStyle, setCommunicationStyle, style)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20
                    ${communicationStyle.includes(style) 
                      ? 'bg-bluvi-purple/10 border-bluvi-purple text-bluvi-purple' 
                      : 'bg-white border-gray-100 text-gray-500'}`}
                  aria-pressed={communicationStyle.includes(style)}
                >
                  {style}
                </button>
              ))}
            </div>
            </section>
          </details>

          {/* 4. SENSORIAL */}
          <details className="rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <summary className="cursor-pointer list-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20 rounded-xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Preferencias de entorno</span>
              <span className="text-[10px] font-bold text-bluvi-purple bg-bluvi-purple/10 px-2 py-1 rounded-lg">{sensoryPref.length}</span>
            </summary>

            <section className="mt-4">
            <div className="flex flex-wrap gap-2" aria-label="Opciones de entorno">
              {sensoryOptions.map(pref => (
                <button 
                  key={pref}
                  onClick={() => toggleItem(sensoryPref, setSensoryPref, pref)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20
                    ${sensoryPref.includes(pref) 
                      ? 'bg-[#9d66ff]/10 border-[#9d66ff] text-[#9d66ff]' 
                      : 'bg-white border-gray-100 text-gray-500'}`}
                  aria-pressed={sensoryPref.includes(pref)}
                >
                  {pref}
                </button>
              ))}
            </div>
            </section>
          </details>
        </div>

        {/* Botón de Aplicar con Gradiente */}
        <div className="p-6 bg-white border-t border-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => {
                setSelectedTags([]);
                setCity('');
                setCommunicationStyle([]);
                setSensoryPref([]);
              }}
              className="sm:col-span-1 !bg-white border-2 border-gray-200 !text-gray-600 hover:!border-gray-400 hover:!text-gray-800"
            >
              Limpiar
            </Button>

            <Button 
              onClick={() => onApply({ 
                  selectedTags, 
                  city, 
                  communicationStyle, 
                  sensoryPref 
              })}
              className="sm:col-span-2 w-full py-4 from-bluvi-purple to-[#9d66ff] text-white rounded-2xl font-bold text-lg shadow-xl shadow-bluvi-purple/25 hover:opacity-90 active:scale-[0.98] transition-all focus-visible:ring-offset-2"
            >
              Ver resultados
            </Button>
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all shadow-sm bg-white/70 backdrop-blur-sm text-bluvi-purple border-bluvi-purple/20 hover:bg-bluvi-purple/10 hover:border-bluvi-purple/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/20"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
            <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
            </svg>
            <span>Filtros</span>
            {activeCount > 0 && (
            <span className="bg-bluvi-purple text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop">
                {activeCount}
            </span>
            )}
        </button>
);