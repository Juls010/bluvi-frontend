import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../services/api';
import { getNarrationAudio } from '../../services/narration.service';

vi.mock('../../services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('narration service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('requests narration audio as a blob', async () => {
        const audioBlob = new Blob(['audio'], { type: 'audio/mpeg' });
        vi.mocked(api.post).mockResolvedValueOnce({ data: audioBlob });

        await expect(getNarrationAudio('Hola Bluvi')).resolves.toBe(audioBlob);

        expect(api.post).toHaveBeenCalledWith(
            '/narration/speech',
            { text: 'Hola Bluvi' },
            { responseType: 'blob' },
        );
    });
});
