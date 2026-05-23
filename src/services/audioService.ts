import { supabase } from '../lib/supabaseClient';

const AUDIO_BUCKET = 'Bluvi_photos'; 
const AUDIO_FOLDER = 'chat_audio';

interface UploadAudioResponse {
    url: string | null;
    error: string | null;
}

/**
 * Sube un archivo de audio a Supabase Storage y devuelve su URL pública.
 * @param audioBlob Blob del archivo de audio.
 * @param userId ID del usuario que sube el audio.
 * @returns Object con la url y posible error.
 */
export const uploadAudioMessage = async (audioBlob: Blob, userId: number): Promise<UploadAudioResponse> => {
    try {
        const fileName = `${userId}_${Date.now()}.webm`;
        const filePath = `${AUDIO_FOLDER}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(AUDIO_BUCKET)
            .upload(filePath, audioBlob, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'audio/webm',
            });

        if (uploadError) {
            return { url: null, error: uploadError.message };
        }

        const { data } = supabase.storage
            .from(AUDIO_BUCKET)
            .getPublicUrl(filePath);

        return { url: data.publicUrl, error: null };
    } catch (err) {
        return { url: null, error: err instanceof Error ? err.message : 'Error desconocido al subir audio' };
    }
};

/**
 * Elimina un archivo de audio de Supabase Storage.
 * @param audioUrl URL pública del audio.
 */
export const deleteAudioMessage = async (audioUrl: string): Promise<void> => {
    try {
        const url = new URL(audioUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(pathParts.indexOf(AUDIO_FOLDER)).join('/');

        if (!filePath.includes(AUDIO_FOLDER)) {
            return;
        }

        await supabase.storage
            .from(AUDIO_BUCKET)
            .remove([filePath]);
    } catch (err) {
        console.error('Error deleting audio:', err);
    }
};
