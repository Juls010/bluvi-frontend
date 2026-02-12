import React, { useState } from 'react';
import { Search, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

// Esto es un ejemplo, luego podrás conectarlo con una API de ciudades
const MOCK_CITIES = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia"];

export const LocationStep = () => {
    const navigate = useNavigate();
    
    const [query, setQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleNext = () => {
        if (selectedCity) {
            navigate('/register/interests');
        }
    };

    const filteredCities = MOCK_CITIES.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 w-full flex flex-col items-center justify-center px-6 overflow-hidden animate-fade-in">
            <div className="max-w-xl w-full space-y-15 text-center">

                <header className="space-y-6">
                    <h1 className="text-4xl font-bold text-bluvi-purple">¿Desde dónde conectas?</h1>
                    <p className="text-gray-600 font-medium">Busca tu ciudad para encontrar personas cerca de ti.</p>
                    <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center shadow-lg border border-white/10">
                        <MapPin size={40} className="text-bluvi-purple" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                </header>

                <div className="relative">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bluvi-purple/40 group-focus-within:text-bluvi-purple transition-colors" size={20} />
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            placeholder="Escribe el nombre de tu ciudad..."
                            className="w-full bg-white/50 backdrop-blur-xl border border-white/60 py-5 pl-12 pr-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-bluvi-purple/10 text-bluvi-purple placeholder:text-bluvi-purple/30 text-lg shadow-inner transition-all"
                            aria-label="Buscar ciudad"
                            aria-expanded={showSuggestions}
                            role="combobox"
                            aria-controls="city-results"
                        />
                    </div>

                    {showSuggestions && query.length > 0 && (
                        <ul 
                            id="city-results"
                            className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
                            role="listbox"
                        >
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                    <li key={city} role="option" aria-selected={selectedCity === city}>
                                        <button
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setQuery(city);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-bluvi-purple/5 text-left text-bluvi-purple font-medium transition-colors"
                                        >
                                            {city}
                                            {selectedCity === city ? <CheckCircle2 size={18} /> : <ChevronRight size={18} className="opacity-30" />}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-6 py-4 text-gray-400 italic">No encontramos esa ciudad...</li>
                            )}
                        </ul>
                    )}
                </div>

                <div className="pt-10 md:pt-16 animate-fade-in"> 
                    <Button
                        onClick={handleNext}
                        disabled={!selectedCity}
                        className={`w-full py-4 rounded-full text-lg shadow-xl ${
                            selectedCity 
                            ? 'bg-bluvi-purple text-white' 
                            : 'bg-gray-200 text-gray-400 opacity-50'
                        }`}
                        aria-label="Confirmar ciudad y continuar"
                    >
                        Confirmar y continuar
                    </Button>
                </div>

            </div>
        </div>
    );
};