import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NarrationButton } from '../../components/NarrationButton';
import { getNarrationAudio } from '../../services/narration.service';

vi.mock('../../services/narration.service', () => ({
    getNarrationAudio: vi.fn(),
}));

type MockAudioInstance = {
    ended: boolean;
    onplay: (() => void) | null;
    onpause: (() => void) | null;
    onended: (() => void) | null;
    onerror: (() => void) | null;
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    src: string;
};

const audioInstances: MockAudioInstance[] = [];
const synth = {
    cancel: vi.fn(),
    speak: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
};

class MockSpeechSynthesisUtterance {
    lang = '';
    rate = 1;
    pitch = 1;
    onstart: (() => void) | null = null;
    onresume: (() => void) | null = null;
    onpause: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(public text: string) {}
}

class MockAudio {
    ended = false;
    onplay: (() => void) | null = null;
    onpause: (() => void) | null = null;
    onended: (() => void) | null = null;
    onerror: (() => void) | null = null;
    play = vi.fn(() => {
        this.onplay?.();
        return Promise.resolve();
    });
    pause = vi.fn(() => {
        this.onpause?.();
    });
    src = '';

    constructor(public audioUrl: string) {
        audioInstances.push(this);
    }
}

describe('NarrationButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        audioInstances.length = 0;
        vi.mocked(getNarrationAudio).mockResolvedValue(new Blob(['audio'], { type: 'audio/mpeg' }));
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:narration');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
        vi.stubGlobal('Audio', MockAudio);
        vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
        Object.defineProperty(window, 'speechSynthesis', {
            configurable: true,
            value: synth,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        delete (window as Partial<Window>).speechSynthesis;
    });

    it('renders the idle label, status, custom class, and hover styles', () => {
        render(<NarrationButton text="Pantalla de inicio" label="Escuchar inicio" className="mt-2" />);
        const button = screen.getByRole('button', { name: /escuchar inicio/i });

        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button.parentElement).toHaveClass('mt-2');
        expect(screen.getByRole('status')).toHaveTextContent('Narracion detenida');

        fireEvent.mouseEnter(button);
        expect(button).toHaveStyle({ backgroundColor: 'var(--app-control-surface-hover)' });
        fireEvent.mouseLeave(button);
        expect(button).toHaveStyle({ backgroundColor: 'var(--app-control-surface)' });
    });

    it('loads backend audio, pauses, resumes, stops, and revokes the object url', async () => {
        const user = userEvent.setup();
        render(<NarrationButton text="Texto narrado" />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));

        expect(getNarrationAudio).toHaveBeenCalledWith('Texto narrado');
        await waitFor(() => expect(screen.getByRole('button', { name: /pausar narracion/i })).toBeInTheDocument());
        expect(screen.getByRole('status')).toHaveTextContent('Narracion en curso');
        expect(audioInstances[0].play).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole('button', { name: /pausar narracion/i }));
        expect(audioInstances[0].pause).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: /reanudar narracion/i })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /reanudar narracion/i }));
        expect(audioInstances[0].play).toHaveBeenCalledTimes(2);

        const stopButton = screen.getByRole('button', { name: /detener narracion/i });
        fireEvent.mouseEnter(stopButton);
        expect(stopButton).toHaveStyle({ backgroundColor: 'var(--app-control-surface-hover)' });
        fireEvent.mouseLeave(stopButton);
        expect(stopButton).toHaveStyle({ backgroundColor: 'var(--app-control-surface)' });
        await user.click(stopButton);

        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:narration');
        expect(screen.getByRole('button', { name: /escuchar esta pantalla/i })).toBeInTheDocument();
    });

    it('returns to idle when backend audio finishes', async () => {
        const user = userEvent.setup();
        render(<NarrationButton text="Texto narrado" />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));
        await waitFor(() => expect(audioInstances[0]).toBeDefined());

        act(() => {
            audioInstances[0].ended = true;
            audioInstances[0].onended?.();
        });

        expect(screen.getByRole('button', { name: /escuchar esta pantalla/i })).toBeInTheDocument();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:narration');
    });

    it('shows an error state when backend audio cannot load', async () => {
        const user = userEvent.setup();
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(getNarrationAudio).mockRejectedValueOnce(new Error('network'));

        render(<NarrationButton text="Texto narrado" />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));

        await waitFor(() => expect(screen.getByRole('button', { name: /reintentar narracion/i })).toBeInTheDocument());
        expect(screen.getByRole('status')).toHaveTextContent('No se pudo preparar la narracion');
        expect(consoleError).toHaveBeenCalled();
    });

    it('uses browser speech synthesis as fallback after backend errors', async () => {
        const user = userEvent.setup();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(getNarrationAudio).mockRejectedValueOnce(new Error('network'));

        render(<NarrationButton text="Texto narrado" allowBrowserFallback />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));

        await waitFor(() => expect(synth.speak).toHaveBeenCalledTimes(1));
        const utterance = synth.speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
        expect(utterance.text).toBe('Texto narrado');
        expect(utterance.lang).toBe('es-ES');
        expect(utterance.rate).toBe(0.92);
        expect(utterance.pitch).toBe(1);

        act(() => utterance.onstart?.());
        expect(screen.getByRole('button', { name: /pausar narracion/i })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Narracion local en curso');

        await user.click(screen.getByRole('button', { name: /pausar narracion/i }));
        expect(synth.pause).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole('button', { name: /reanudar narracion/i }));
        expect(synth.resume).toHaveBeenCalledTimes(1);

        act(() => utterance.onpause?.());
        expect(screen.getByRole('button', { name: /reanudar narracion/i })).toBeInTheDocument();
        act(() => utterance.onresume?.());
        expect(screen.getByRole('button', { name: /pausar narracion/i })).toBeInTheDocument();
        act(() => utterance.onend?.());
        expect(screen.getByRole('button', { name: /escuchar esta pantalla/i })).toBeInTheDocument();
    });

    it('uses fallback after an audio element error', async () => {
        const user = userEvent.setup();
        render(<NarrationButton text="Texto narrado" allowBrowserFallback />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));
        await waitFor(() => expect(audioInstances[0]).toBeDefined());

        act(() => audioInstances[0].onerror?.());

        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:narration');
        expect(synth.speak).toHaveBeenCalledTimes(1);
    });

    it('shows an error when fallback is requested but speech synthesis is unavailable', async () => {
        const user = userEvent.setup();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(getNarrationAudio).mockRejectedValueOnce(new Error('network'));
        delete (window as Partial<Window>).speechSynthesis;

        render(<NarrationButton text="Texto narrado" allowBrowserFallback />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));

        await waitFor(() => expect(screen.getByRole('button', { name: /reintentar narracion/i })).toBeInTheDocument());
    });

    it('shows an error when the fallback utterance fails', async () => {
        const user = userEvent.setup();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        vi.mocked(getNarrationAudio).mockRejectedValueOnce(new Error('network'));

        render(<NarrationButton text="Texto narrado" allowBrowserFallback />);

        await user.click(screen.getByRole('button', { name: /escuchar esta pantalla/i }));
        await waitFor(() => expect(synth.speak).toHaveBeenCalledTimes(1));

        const utterance = synth.speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
        act(() => utterance.onerror?.());

        expect(screen.getByRole('button', { name: /reintentar narracion/i })).toBeInTheDocument();
    });
});
