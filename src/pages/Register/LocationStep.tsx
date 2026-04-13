import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext'; 
import { searchCities, type CitySuggestion } from '../../services/cities.service';

const MAX_CITY_QUERY_LENGTH = 120;
const CITY_LISTBOX_ID = 'register-city-results';
const SEARCH_DEBOUNCE_MS = 250;

export const LocationStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();

    const [query, setQuery] = useState(formData.city || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [citySearchError, setCitySearchError] = useState<string | null>(null);
    const [liveMessage, setLiveMessage] = useState('');
    const comboboxContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const sanitizeQuery = (value: string) =>
        value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, MAX_CITY_QUERY_LENGTH);

    const normalizedQuery = query.trim().toLowerCase();
    const normalizedSelectedCity = formData.city.trim().toLowerCase();
    const hasSelectedCityInInput = normalizedSelectedCity.length > 0 && normalizedQuery === normalizedSelectedCity;
    const hasSuggestions = showSuggestions && query.length > 0 && !hasSelectedCityInInput;
    const activeSuggestion = activeIndex >= 0 ? suggestions[activeIndex] : null;
    const activeDescendantId = activeSuggestion ? `city-option-${activeSuggestion.id}` : undefined;

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            setCitySearchError(null);
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setIsLoading(true);
            setCitySearchError(null);

            const results = await searchCities(trimmedQuery, 8, controller.signal);

            if (!controller.signal.aborted) {
                setSuggestions(results);
                if (results.length === 0) {
                    setCitySearchError('No encontramos ciudades con ese nombre.');
                    setLiveMessage('No se encontraron ciudades para esa busqueda.');
                } else {
                    setLiveMessage(`${results.length} ${results.length === 1 ? 'resultado disponible' : 'resultados disponibles'}.`);
                }
                setActiveIndex(-1);
                setIsLoading(false);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [query]);

    useEffect(() => {
        const handleDocumentPointerDown = (event: PointerEvent) => {
            if (!comboboxContainerRef.current?.contains(event.target as Node)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('pointerdown', handleDocumentPointerDown);
        return () => {
            document.removeEventListener('pointerdown', handleDocumentPointerDown);
        };
    }, []);

    const handleNext = () => {
        if (formData.city) {
            navigate('/register/interests');
        }
    };

    const handleCitySelect = (city: CitySuggestion) => {
        setQuery(city.value);
        updateFormData({ city: city.value });
        setShowSuggestions(false);
        setActiveIndex(-1);
        setCitySearchError(null);
        setLiveMessage(`Ciudad seleccionada: ${city.value}.`);
    };

    const handleInputChange = (value: string) => {
        const sanitizedValue = sanitizeQuery(value);
        setQuery(sanitizedValue);
        setShowSuggestions(true);
        setLiveMessage('Buscando ciudades...');

        const normalizedTypedValue = sanitizedValue.trim().toLowerCase();
        const normalizedSelectedCity = formData.city.trim().toLowerCase();

        if (sanitizedValue.length === 0) {
            updateFormData({ city: '' });
        } else if (normalizedTypedValue !== normalizedSelectedCity) {
            // Force a valid selection from suggestions before allowing next step.
            updateFormData({ city: '' });
        }

        setActiveIndex(-1);
    };

    const handleClearQuery = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
        setCitySearchError(null);
        updateFormData({ city: '' });
        setLiveMessage('Ciudad eliminada.');
        inputRef.current?.focus();
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!hasSuggestions) {
            return;
        }

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

    return (
        <AnimatedStep>
            <div className="fixed inset-0 w-full flex flex-col items-center justify-center px-6 overflow-hidden animate-fade-in">
                <div className="max-w-xl w-full space-y-15 text-center">

                    <header className="space-y-6">
                        <h1 className="text-4xl font-bold text-bluvi-purple">¿Desde dónde conectas?</h1>
                        <p className="text-gray-600 font-medium">Busca tu ciudad para encontrar personas cerca de ti.</p>
                        <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center shadow-lg border border-white/10">
                            <MapPin size={40} className="text-bluvi-purple" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                    </header>

                    <div className="relative" ref={comboboxContainerRef}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bluvi-purple/40 group-focus-within:text-bluvi-purple transition-colors" size={20} />
                            <input 
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                onFocus={() => {
                                    if (!hasSelectedCityInInput) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                placeholder="Escribe el nombre de tu ciudad..."
                                className="w-full bg-white/50 backdrop-blur-xl border border-white/60 py-5 pl-12 pr-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-bluvi-purple/10 text-bluvi-purple placeholder:text-bluvi-purple/30 text-lg shadow-inner transition-all"
                                aria-label="Buscar ciudad"
                                aria-describedby="city-combobox-help"
                                aria-expanded={hasSuggestions}
                                role="combobox"
                                aria-controls={CITY_LISTBOX_ID}
                                aria-autocomplete="list"
                                aria-activedescendant={activeDescendantId}
                            />
                            {query.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearQuery}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-bluvi-purple/45 hover:text-bluvi-purple transition-colors rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluvi-purple/30"
                                    aria-label="Limpiar ciudad seleccionada"
                                >
                                    <X size={18} aria-hidden="true" />
                                </button>
                            )}
                            <p id="city-combobox-help" className="sr-only">
                                Escribe al menos dos letras. Usa flechas arriba y abajo para navegar sugerencias y Enter para seleccionar.
                            </p>
                            <p className="sr-only" role="status" aria-live="polite">
                                {liveMessage}
                            </p>
                        </div>

                        {hasSuggestions && (
                            <ul 
                                id={CITY_LISTBOX_ID}
                                className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
                                role="listbox"
                            >
                                {isLoading ? (
                                    <li className="px-6 py-4 text-bluvi-purple/70" role="presentation">Buscando ciudades...</li>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((city, index) => (
                                        <li
                                            key={city.id}
                                            id={`city-option-${city.id}`}
                                            role="option"
                                            aria-selected={formData.city === city.value}
                                            tabIndex={-1}
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                handleCitySelect(city);
                                            }}
                                            onClick={() => handleCitySelect(city)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`w-full flex items-center justify-between px-6 py-4 text-left text-bluvi-purple font-medium transition-colors cursor-pointer ${index === activeIndex ? 'bg-bluvi-purple/10' : 'hover:bg-bluvi-purple/5'}`}
                                        >
                                            <span>{city.label}</span>
                                            {formData.city === city.value ? <CheckCircle2 size={18} /> : <ChevronRight size={18} className="opacity-30" />}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-6 py-4 text-gray-400 italic" role="presentation">{citySearchError ?? 'No encontramos esa ciudad...'}</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="pt-10 md:pt-16 animate-fade-in"> 
                        <Button
                            onClick={handleNext}
                            disabled={!formData.city}
                            className={`w-full py-4 rounded-full text-lg shadow-xl ${
                                formData.city 
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
        </AnimatedStep>
    );
};