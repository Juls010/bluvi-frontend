import React, { useState } from 'react';

interface FilterData {
  search: string;
  selectedTags: string[];
  city: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters: FilterData;
}

export const DiscoveryFilter: React.FC<Props> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [search, setSearch] = useState(initialFilters.search);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.selectedTags);
  const [city, setCity] = useState(initialFilters.city);

  // Tags sugeridos: Lo que más une a la comunidad Bluvi
  const QUICK_TAGS = ['🎮 Gaming', '🎨 Arte', '🌿 Naturaleza', '🎶 Música', '🐾 Mascotas', '📚 Lectura', '🍿 Cine', '🧩 Puzzles'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Fondo desenfocado */}
      <div className="absolute inset-0 bg-bluvi-purple/20 backdrop-blur-md animate-fade-in" onClick={onClose} />

      {/* Panel Principal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[40px] md:rounded-[32px] shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Decoración superior */}
        <div className="h-1.5 w-12 bg-gray-200 rounded-full mx-auto mt-4 mb-2 md:hidden" />

        <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto">
          <header className="flex justify-between items-center">
            <h2 className="text-3xl font-heading font-bold text-gray-800">Filtros</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">✕</button>
          </header>

          {/* Buscador de intereses */}
          <section>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">¿Qué te apetece encontrar?</label>
            <div className="group relative">
              <input 
                type="text" 
                placeholder="Busca un interés (ej. Ajedrez...)" 
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-700 focus:bg-white focus:border-bluvi-purple/20 focus:ring-4 focus:ring-bluvi-purple/5 transition-all outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>
          </section>

          {/* Tags Rápidos */}
          <section>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Sugerencias rápidas</label>
            <div className="flex flex-wrap gap-2.5">
              {QUICK_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all border-2
                      ${isSelected 
                        ? 'bg-bluvi-purple text-white border-bluvi-purple shadow-lg shadow-bluvi-purple/20 scale-105' 
                        : 'bg-white text-gray-500 border-gray-100 hover:border-bluvi-purple/30 hover:text-bluvi-purple'}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Ubicación */}
          <section>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Ciudad o zona</label>
            <div className="relative">
              <input 
                  type="text" 
                  placeholder="Madrid, Remoto..." 
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-gray-700 outline-none focus:ring-2 focus:ring-bluvi-purple/10 transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-30">📍</span>
            </div>
          </section>
        </div>

        {/* Botón de Aplicar con Gradiente */}
        <div className="p-6 bg-white border-t border-gray-50">
          <button 
            onClick={() => onApply({ search, selectedTags, city })}
            className="w-full py-4 bg-gradient-to-r from-bluvi-purple to-[#9d66ff] text-white rounded-2xl font-bold text-lg shadow-xl shadow-bluvi-purple/30 hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Ver resultados
          </button>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all shadow-sm bg-white/50 backdrop-blur-sm text-bluvi-purple border-bluvi-purple/20 hover:bg-bluvi-purple/10 hover:border-bluvi-purple/40"
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