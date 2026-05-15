import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadUserPhoto } from '../../services/uploadService';
import { supabase } from '../../lib/supabaseClient';

const upload = vi.fn();
const getPublicUrl = vi.fn();
const from = vi.fn((_bucket: string) => ({ upload, getPublicUrl }));

vi.mock('../../lib/supabaseClient', () => ({
    supabase: {
        storage: {
            from: (bucket: string) => from(bucket),
        },
    },
}));

describe('upload service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Date, 'now').mockReturnValue(12345);
    });

    it('uploads a sanitized file name and returns the public URL', async () => {
        upload.mockResolvedValueOnce({ error: null });
        getPublicUrl.mockReturnValueOnce({ data: { publicUrl: 'https://cdn.test/photo.png' } });
        const file = new File(['image'], 'my photo!.png', { type: 'image/png' });

        await expect(uploadUserPhoto(file)).resolves.toEqual({ url: 'https://cdn.test/photo.png', error: null });

        expect(supabase.storage.from).toBeDefined();
        expect(from).toHaveBeenCalledWith('Bluvi_photos');
        expect(upload).toHaveBeenCalledWith(
            'registration/12345_my_photo_.png',
            file,
            { cacheControl: '3600', upsert: false },
        );
        expect(getPublicUrl).toHaveBeenCalledWith('registration/12345_my_photo_.png');
    });

    it('returns the Supabase upload error message', async () => {
        upload.mockResolvedValueOnce({ error: { message: 'Bucket unavailable' } });
        const file = new File(['image'], 'photo.png', { type: 'image/png' });

        await expect(uploadUserPhoto(file)).resolves.toEqual({ url: null, error: 'Bucket unavailable' });
    });

    it('returns a generic error when an unexpected exception is thrown', async () => {
        upload.mockRejectedValueOnce('boom');
        const file = new File(['image'], 'photo.png', { type: 'image/png' });

        await expect(uploadUserPhoto(file)).resolves.toEqual({ url: null, error: 'Error desconocido al subir' });
    });
});
