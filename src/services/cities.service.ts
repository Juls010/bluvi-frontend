const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface CitySuggestion {
    id: string;
    label: string;
    value: string;
    lat?: number;
    lng?: number;
}

/**
 * Lista de ciudades comunes para asegurar resultados rápidos en búsquedas cortas (ej: "SE").
 * Estas coordenadas son aproximadas (centros de ciudad).
 */
const COMMON_CITIES = [
    { label: 'Madrid, Comunidad de Madrid, España', lat: 40.4168, lng: -3.7038 },
    { label: 'Barcelona, Cataluña, España', lat: 41.3851, lng: 2.1734 },
    { label: 'Valencia, Comunidad Valenciana, España', lat: 39.4699, lng: -0.3763 },
    { label: 'Sevilla, Andalucía, España', lat: 37.3891, lng: -5.9845 },
    { label: 'Zaragoza, Aragón, España', lat: 41.6488, lng: -0.8891 },
    { label: 'Málaga, Andalucía, España', lat: 36.7213, lng: -4.4214 },
    { label: 'Murcia, Región de Murcia, España', lat: 37.9922, lng: -1.1307 },
    { label: 'Palma de Mallorca, Islas Baleares, España', lat: 39.5696, lng: 2.6502 },
    { label: 'Las Palmas de Gran Canaria, Canarias, España', lat: 28.1235, lng: -15.4363 },
    { label: 'Bilbao, País Vasco, España', lat: 43.2630, lng: -2.9350 },
    { label: 'Alicante, Comunidad Valenciana, España', lat: 38.3452, lng: -0.4810 },
    { label: 'Córdoba, Andalucía, España', lat: 37.8882, lng: -4.7794 },
    { label: 'Valladolid, Castilla y León, España', lat: 41.6523, lng: -4.7245 },
    { label: 'Vigo, Galicia, España', lat: 42.2328, lng: -8.7226 },
    { label: 'Gijón, Asturias, España', lat: 43.5357, lng: -5.6615 },
    { label: 'L Hospitalet de Llobregat, Cataluña, España', lat: 41.3597, lng: 2.1003 },
    { label: 'A Coruña, Galicia, España', lat: 43.3623, lng: -8.4115 },
    { label: 'Granada, Andalucía, España', lat: 37.1773, lng: -3.5986 },
    { label: 'Vitoria-Gasteiz, País Vasco, España', lat: 42.8467, lng: -2.6716 },
    { label: 'Elche, Comunidad Valenciana, España', lat: 38.2669, lng: -0.6983 },
    { label: 'Oviedo, Asturias, España', lat: 43.3603, lng: -5.8448 },
    { label: 'Santa Cruz de Tenerife, Canarias, España', lat: 28.4636, lng: -16.2518 },
    { label: 'Pamplona, Navarra, España', lat: 42.8125, lng: -1.6458 },
    { label: 'Almería, Andalucía, España', lat: 36.8340, lng: -2.4637 },
    { label: 'Donostia-San Sebastián, País Vasco, España', lat: 43.3183, lng: -1.9812 },
    { label: 'Logroño, La Rioja, España', lat: 42.4627, lng: -2.4450 },
    { label: 'Badajoz, Extremadura, España', lat: 38.8794, lng: -6.9706 },
    { label: 'Salamanca, Castilla y León, España', lat: 40.9701, lng: -5.6635 },
    { label: 'Huelva, Andalucía, España', lat: 37.2614, lng: -6.9447 },
    { label: 'Cádiz, Andalucía, España', lat: 36.5271, lng: -6.2886 },
];

interface OpenMeteoCityResult {
    id?: number;
    name?: string;
    admin1?: string;
    admin2?: string;
    admin3?: string;
    country?: string;
    country_code?: string;
    latitude?: number;
    longitude?: number;
}

interface OpenMeteoCitiesResponse {
    results?: OpenMeteoCityResult[];
}

const toCityValue = (label: string) => {
    const firstChunk = label.split(',')[0]?.trim();
    return firstChunk || label;
};

/**
 * Añade un ruido aleatorio de aproximadamente 500 metros a una coordenada para proteger la privacidad.
 */
const applyLocationFuzzing = (coord: number | undefined): number | undefined => {
    if (coord === undefined) return undefined;
    const offset = (Math.random() - 0.5) * 2 * 0.0045;
    return parseFloat((coord + offset).toFixed(6));
};

const toId = (label: string) =>
    label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const toSuggestion = (label: string, value?: string, lat?: number, lng?: number): CitySuggestion => ({
    id: toId(label),
    label,
    value: (value && value.trim()) || toCityValue(label),
    lat: applyLocationFuzzing(lat),
    lng: applyLocationFuzzing(lng),
});

const formatOpenMeteoLabel = (result: OpenMeteoCityResult) => {
    // Priorizamos admin3 (municipio) sobre name (que a veces es la comarca)
    const parts = [result.admin3, result.name, result.admin2, result.admin1, result.country]
        .map((part) => (typeof part === 'string' ? part.trim() : ''))
        .filter((part, index, self) => part.length > 0 && self.indexOf(part) === index);

    return parts.join(', ');
};

export const searchCities = async (
    query: string,
    limit = 8,
    signal?: AbortSignal
): Promise<CitySuggestion[]> => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length < 2) {
        return [];
    }

    // 1. Buscar primero en la lista local de ciudades comunes (para rapidez y prefijos cortos)
    const localMatches = COMMON_CITIES
        .filter(city => city.label.toLowerCase().includes(normalizedQuery))
        .slice(0, limit)
        .map(city => toSuggestion(city.label, undefined, city.lat, city.lng));

    // Si ya tenemos suficientes resultados locales exactos, podemos devolverlos directamente 
    // o continuar para completarlos con la API.
    
    try {
        const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(normalizedQuery)}&count=50&language=es&format=json`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`City search failed with status ${response.status}`);
        }

        const data = (await response.json()) as OpenMeteoCitiesResponse;
        const results = data.results ?? [];

        const unique = new Map<string, CitySuggestion>();
        
        // Añadir primero los locales para que tengan prioridad
        localMatches.forEach(s => unique.set(s.label, s));

        for (const result of results) {
            if (result.country_code !== 'ES') continue;
            
            const label = formatOpenMeteoLabel(result);
            if (!label || unique.has(label)) continue;
            
            const cityName = typeof result.name === 'string' ? result.name.trim() : undefined;
            const suggestion = toSuggestion(label, cityName, result.latitude, result.longitude);
            
            unique.set(suggestion.label, suggestion);
            
            if (unique.size >= limit + 5) break; 
        }

        return Array.from(unique.values()).slice(0, limit);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return [];
        }
        console.error('Error searching cities:', error);
        // En caso de error de red, devolvemos al menos lo que encontramos localmente
        return localMatches;
    }
};
