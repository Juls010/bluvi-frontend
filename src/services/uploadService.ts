import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'Bluvi_photos';

interface UploadResponse {
  url: string | null;
  error: string | null;
}

/**
 * Sube un archivo a Supabase Storage y devuelve su URL pública.
 * @param file Archivo a subir.
 * @returns Object con la url y posible error.
 */
export const uploadUserPhoto = async (file: File): Promise<UploadResponse> => {
  try {
    // Sanitizamos el nombre del archivo para evitar caracteres no permitidos (acentos, espacios, etc.)
    const sanitizedName = file.name
      .normalize('NFD') // Descompone caracteres con acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
      .replace(/[^a-zA-Z0-9.\-_]/g, '_'); // Reemplaza lo que no sea seguro por guiones bajos

    const fileName = `${Date.now()}_${sanitizedName}`;
    const filePath = `registration/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : 'Error desconocido al subir' };
  }
};
