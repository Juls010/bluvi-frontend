import api from './api';

export const getNarrationAudio = async (text: string): Promise<Blob> => {
    const response = await api.post<Blob>(
        '/narration/speech',
        { text },
        { responseType: 'blob' }
    );

    return response.data;
};
