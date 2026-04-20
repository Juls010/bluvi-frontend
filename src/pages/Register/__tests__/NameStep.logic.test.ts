import { describe, it, expect } from 'vitest';
import { toTitleCase, sanitizeNameInput } from '../NameStep';

describe('NameStep Logic Helpers', () => {
    describe('toTitleCase', () => {
        it('should capitalize the first letter of each word', () => {
            expect(toTitleCase('aurora')).toBe('Aurora');
            expect(toTitleCase('maría josé')).toBe('María José');
            expect(toTitleCase('de la fuente')).toBe('De La Fuente');
        });

        it('should handle already capitalized words', () => {
            expect(toTitleCase('Aurora')).toBe('Aurora');
        });

        it('should handle empty strings', () => {
            expect(toTitleCase('')).toBe('');
        });
    });

    describe('sanitizeNameInput', () => {
        it('should remove special characters and capitalize', () => {
            expect(sanitizeNameInput('aurora123')).toBe('Aurora');
            expect(sanitizeNameInput('maría@ josé!')).toBe('María José');
        });

        it('should prevent multiple spaces', () => {
            expect(sanitizeNameInput('aurora    montenegro')).toBe('Aurora Montenegro');
        });

        it('should limit length to 80 characters', () => {
            const longName = 'a'.repeat(100);
            expect(sanitizeNameInput(longName).length).toBe(80);
        });
    });
});
