import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isValidIsoDate, normalizeIsoDate, isAtLeastAge } from '../AgeStep';

describe('AgeStep Logic Helpers', () => {
    describe('isValidIsoDate', () => {
        it('should return true for valid YYYY-MM-DD', () => {
            expect(isValidIsoDate('1990-01-01')).toBe(true);
            expect(isValidIsoDate('2000-12-31')).toBe(true);
        });

        it('should return false for invalid formats or dates', () => {
            expect(isValidIsoDate('01-01-1990')).toBe(false);
            expect(isValidIsoDate('1990-13-01')).toBe(false); // Invalid month
            expect(isValidIsoDate('1990-01-32')).toBe(false); // Invalid day
            expect(isValidIsoDate('not-a-date')).toBe(false);
        });
    });

    describe('normalizeIsoDate', () => {
        it('should add leading zeros to month and day', () => {
            expect(normalizeIsoDate('1990-1-1')).toBe('1990-01-01');
            expect(normalizeIsoDate('2000-12-5')).toBe('2000-12-05');
        });

        it('should return original if format is unknown', () => {
            expect(normalizeIsoDate('not-a-date')).toBe('not-a-date');
        });
    });

    describe('isAtLeastAge', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            // Set "today" to 2024-04-20
            const date = new Date(2024, 3, 20);
            vi.setSystemTime(date);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should return true if age is exactly 18', () => {
            expect(isAtLeastAge('2006-04-20', 18)).toBe(true);
        });

        it('should return true if age is more than 18', () => {
            expect(isAtLeastAge('1990-01-01', 18)).toBe(true);
        });

        it('should return false if age is less than 18', () => {
            expect(isAtLeastAge('2006-04-21', 18)).toBe(false);
            expect(isAtLeastAge('2020-01-01', 18)).toBe(false);
        });
    });
});
