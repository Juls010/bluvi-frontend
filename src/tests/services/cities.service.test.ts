import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchCities } from '../../services/cities.service';

describe('cities service', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    it('returns an empty list for very short queries', async () => {
        await expect(searchCities('m')).resolves.toEqual([]);
    });

    it('combines prioritized local Spanish cities with API results', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    {
                        id: 99,
                        name: 'Alcobendas',
                        admin1: 'Comunidad de Madrid',
                        country: 'Espana',
                        country_code: 'ES',
                        latitude: 40.537,
                        longitude: -3.637,
                    },
                    {
                        id: 100,
                        name: 'Paris',
                        country: 'Francia',
                        country_code: 'FR',
                    },
                ],
            }),
        }));

        const results = await searchCities('mad', 4);

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('name=mad'), expect.objectContaining({ signal: undefined }));
        expect(results[0]).toEqual(expect.objectContaining({
            label: 'Madrid, Comunidad de Madrid, España',
            value: 'Madrid',
            lat: 40.4168,
            lng: -3.7038,
        }));
        expect(results).toEqual(expect.arrayContaining([
            expect.objectContaining({ label: 'Alcobendas, Comunidad de Madrid, Espana', value: 'Alcobendas' }),
        ]));
        expect(results.some((city) => city.value === 'Paris')).toBe(false);
    });

    it('falls back to local matches when the remote request fails', async () => {
        const originalError = console.error;
        console.error = vi.fn();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

        const results = await searchCities('sev', 3);

        expect(results).toEqual([
            expect.objectContaining({ value: 'Sevilla' }),
        ]);
        console.error = originalError;
    });

    it('returns empty results for aborted searches', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError')));

        await expect(searchCities('mad')).resolves.toEqual([]);
    });
});
