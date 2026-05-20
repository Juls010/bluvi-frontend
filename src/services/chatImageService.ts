import { supabase } from '../lib/supabaseClient';

const CHAT_IMAGE_BUCKET = 'Bluvi_photos';
const CHAT_IMAGE_FOLDER = 'chat_images';
const MAX_CHAT_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CHAT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UploadChatImageResponse {
    url: string | null;
    error: string | null;
}

const sanitizeFileName = (name: string) =>
    name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_');

export const uploadChatImage = async (file: File, userId: number): Promise<UploadChatImageResponse> => {
    try {
        if (!ALLOWED_CHAT_IMAGE_TYPES.includes(file.type)) {
            return { url: null, error: 'Formato no permitido. Usa JPG, PNG, WEBP o GIF.' };
        }

        if (file.size > MAX_CHAT_IMAGE_BYTES) {
            return { url: null, error: 'La imagen no puede superar los 5 MB.' };
        }

        const safeName = sanitizeFileName(file.name);
        const filePath = `${CHAT_IMAGE_FOLDER}/${userId}_${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(CHAT_IMAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type,
            });

        if (uploadError) {
            return { url: null, error: uploadError.message };
        }

        const { data } = supabase.storage
            .from(CHAT_IMAGE_BUCKET)
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    } catch (err) {
        return { url: null, error: err instanceof Error ? err.message : 'Error desconocido al subir imagen' };
    }
};
