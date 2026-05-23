import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { detectarGesto, inicializarFaceDetector } from '../../services/faceDetector.service';

vi.mock('@mediapipe/tasks-vision', () => ({
    FilesetResolver: {
        forVisionTasks: vi.fn(),
    },
    FaceLandmarker: {
        createFromOptions: vi.fn(),
    },
}));

const createResults = (scores: Record<string, number>): FaceLandmarkerResult => ({
    faceLandmarks: [],
    faceBlendshapes: [{
        categories: Object.entries(scores).map(([categoryName, score]) => ({
            categoryName,
            score,
            displayName: '',
            index: 0,
        })),
        headIndex: 0,
        headName: '',
    }],
    facialTransformationMatrixes: [],
});

describe('face detector service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes the MediaPipe face landmarker with video and blendshape output', async () => {
        const vision = { wasm: true };
        const landmarker = { detectForVideo: vi.fn() };
        vi.mocked(FilesetResolver.forVisionTasks).mockResolvedValueOnce(vision as never);
        vi.mocked(FaceLandmarker.createFromOptions).mockResolvedValueOnce(landmarker as never);

        await expect(inicializarFaceDetector()).resolves.toBe(landmarker);

        expect(FilesetResolver.forVisionTasks).toHaveBeenCalledWith(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        );
        expect(FaceLandmarker.createFromOptions).toHaveBeenCalledWith(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            outputFaceBlendshapes: true,
        });
    });

    it('returns NINGUNO when there are no blendshapes', () => {
        expect(detectarGesto({ faceLandmarks: [], faceBlendshapes: [], facialTransformationMatrixes: [] })).toBe('NINGUNO');
        expect(detectarGesto({ faceLandmarks: [], facialTransformationMatrixes: [] } as unknown as FaceLandmarkerResult)).toBe('NINGUNO');
    });

    it('detects a smile when both smile scores are high', () => {
        expect(detectarGesto(createResults({
            mouthSmileLeft: 0.82,
            mouthSmileRight: 0.91,
        }))).toBe('SONRISA');
    });

    it('detects a right wink when the right eye is closed and the left eye is open', () => {
        expect(detectarGesto(createResults({
            eyeBlinkRight: 0.86,
            eyeBlinkLeft: 0.12,
        }))).toBe('GUINO_DERECHO');
    });

    it('detects an open mouth from the jaw score', () => {
        expect(detectarGesto(createResults({
            jawOpen: 0.58,
        }))).toBe('BOCA_ABIERTA');
    });

    it('returns NINGUNO when scores do not pass any gesture threshold', () => {
        expect(detectarGesto(createResults({
            mouthSmileLeft: 0.7,
            mouthSmileRight: 0.95,
            eyeBlinkRight: 0.8,
            eyeBlinkLeft: 0.3,
            jawOpen: 0.5,
        }))).toBe('NINGUNO');
    });
});
