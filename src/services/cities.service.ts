const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const FALLBACK_CITIES = [
    'Madrid, Comunidad de Madrid, Espana',
    'Barcelona, Cataluna, Espana',
    'Valencia, Comunidad Valenciana, Espana',
    'Sevilla, Andalucia, Espana',
    'Zaragoza, Aragon, Espana',
    'Malaga, Andalucia, Espana',
    'Murcia, Region de Murcia, Espana',
];

export interface CitySuggestion {
    id: string;
    label: string;
    value: string;
}

interface OpenMeteoCityResult {
    id?: number;
    name?: string;
    admin1?: string;
    country?: string;
}

interface OpenMeteoCitiesResponse {
    results?: OpenMeteoCityResult[];
}

const toCityValue = (label: string) => {
    const firstChunk = label.split(',')[0]?.trim();
    return firstChunk || label;
};

const toId = (label: string) =>
    label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const toSuggestion = (label: string, value?: string): CitySuggestion => ({
    id: toId(label),
    label,
    value: (value && value.trim()) || toCityValue(label),
});

const formatOpenMeteoLabel = (result: OpenMeteoCityResult) => {
    const parts = [result.name, result.admin1, result.country]
        .map((part) => (typeof part === 'string' ? part.trim() : ''))
        .filter((part) => part.length > 0);

    return parts.join(', ');
};

const filterFallbackSuggestions = (query: string, limit: number): CitySuggestion[] => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return [];
    }

    return FALLBACK_CITIES
        .filter((city) => city.toLowerCase().includes(normalizedQuery))
        .slice(0, limit)
        .map((city) => toSuggestion(city));
};

export const searchCities = async (
    query: string,
    limit = 8,
    signal?: AbortSignal
): Promise<CitySuggestion[]> => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
        return [];
    }

    try {
        const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(normalizedQuery)}&count=${limit}&language=es&format=json&countryCode=ES`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`City search failed with status ${response.status}`);
        }

        const data = (await response.json()) as OpenMeteoCitiesResponse;
        const results = data.results ?? [];

        const unique = new Map<string, CitySuggestion>();
        for (const result of results) {
            const label = formatOpenMeteoLabel(result);
            if (!label) {
                continue;
            }
            const cityName = typeof result.name === 'string' ? result.name.trim() : undefined;
            const suggestion = toSuggestion(label, cityName);
            if (!unique.has(suggestion.label)) {
                unique.set(suggestion.label, suggestion);
            }
        }

        if (unique.size === 0) {
            return filterFallbackSuggestions(normalizedQuery, limit);
        }

        return Array.from(unique.values()).slice(0, limit);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return [];
        }

        return filterFallbackSuggestions(normalizedQuery, limit);
    }
};
