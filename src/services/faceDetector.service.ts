import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export type GestoReconocido = "SONRISA" | "GUINO_DERECHO" | "BOCA_ABIERTA" | "NINGUNO";

interface GestoScore {
    categoryName: string;
    score: number;
}

export const inicializarFaceDetector = async (): Promise<FaceLandmarker> => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    
    return await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
    });
};

export const detectarGesto = (results: FaceLandmarkerResult): GestoReconocido => {
    if (!results.faceBlendshapes || results.faceBlendshapes.length === 0) {
        return "NINGUNO";
    }

    const shapes: GestoScore[] = results.faceBlendshapes[0].categories;
    const gestos: Record<string, number> = {};
    
    shapes.forEach(shape => {
        gestos[shape.categoryName] = shape.score;
    });

    if ((gestos['mouthSmileLeft'] ?? 0) > 0.7 && (gestos['mouthSmileRight'] ?? 0) > 0.7) {
        return "SONRISA";
    }

    if ((gestos['eyeBlinkRight'] ?? 0) > 0.8 && (gestos['eyeBlinkLeft'] ?? 0) < 0.3) {
        return "GUINO_DERECHO";
    }

    if ((gestos['jawOpen'] ?? 0) > 0.5) {
        return "BOCA_ABIERTA";
    }

    return "NINGUNO";
};