import React, { useEffect, useState } from 'react';
import bluAntenna from '../assets/blu_antenna.svg';
import bluBody from '../assets/blu_body.svg';
import bluEyes from '../assets/blu_eye_left.svg';

type BluMascotProps = {
    size?: 'sm' | 'md';
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const BluMascot: React.FC<BluMascotProps> = ({ size = 'md' }) => {
    const [look, setLook] = useState({ x: 0, y: 0 });
    const [reduceMotion, setReduceMotion] = useState(false);
    const dimensions = size === 'sm' ? 'h-12 w-12' : 'h-28 w-28';
    const eyeRange = size === 'sm' ? 2.2 : 4;
    const antennaRange = size === 'sm' ? 5 : 7;
    const visualScale = size === 'sm' ? 1.14 : 1.28;

    useEffect(() => {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotionPreference = () => setReduceMotion(motionQuery.matches);

        updateMotionPreference();
        motionQuery.addEventListener('change', updateMotionPreference);
        return () => motionQuery.removeEventListener('change', updateMotionPreference);
    }, []);

    useEffect(() => {
        if (reduceMotion) {
            setLook({ x: 0, y: 0 });
            return;
        }

        let frame = 0;
        const handlePointerMove = (event: PointerEvent) => {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                const x = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
                const y = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);
                setLook({ x, y });
            });
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, [reduceMotion]);

    const eyeTransform = `translate3d(${look.x * eyeRange}px, ${look.y * eyeRange}px, 0)`;
    const antennaRotation = `${look.x * antennaRange}deg`;

    return (
        <span className={`relative block overflow-visible ${dimensions}`} aria-hidden="true">
            <span
                className="absolute inset-0 block overflow-visible"
                style={{ transform: `scale(${visualScale})`, transformOrigin: '50% 54%' }}
            >
                <img
                    src={bluAntenna}
                    alt=""
                    className={`pointer-events-none absolute inset-0 h-full w-full select-none ${reduceMotion ? '' : 'blu-mascot-antenna'}`}
                    draggable={false}
                    style={{
                        '--blu-antenna-rotation': antennaRotation,
                        transformOrigin: '47.5% 26%',
                        transition: 'transform 140ms ease-out',
                    } as React.CSSProperties}
                />
                <img
                    src={bluBody}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full select-none"
                    draggable={false}
                />
                <img
                    src={bluEyes}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full select-none"
                    draggable={false}
                    style={{
                        transform: eyeTransform,
                        transition: 'transform 110ms ease-out',
                    }}
                />
            </span>
        </span>
    );
};
