import { useId, useState } from 'react';
import type { FC } from 'react';
import { updateAtmosphere, type Atmosphere } from '../services/user.service';

type AtmosphereSelectorProps = {
    initialAtmosphere?: Atmosphere;
    onChange?: (atmosphere: Atmosphere) => void;
};

const atmosphereOptions: Array<{ value: Atmosphere; label: string }> = [
    { value: 'normal', label: 'Normal' },
    { value: 'tranquilo', label: 'Tranquilo' },
    { value: 'bajo', label: 'Energía baja' },
];

const atmosphereCopy: Record<Atmosphere, string> = {
    normal: 'Nada puede pararme.',
    tranquilo: 'Mi ritmo está en calma.',
    bajo: 'Necesito ir a mi ritmo. No se mostrará el "escribiendo" en los chats.',
};

export const AtmosphereSelector: FC<AtmosphereSelectorProps> = ({
    initialAtmosphere = 'normal',
    onChange,
}) => {
    const descriptionId = useId();
    const [selected, setSelected] = useState<Atmosphere>(initialAtmosphere);
    const [saving, setSaving] = useState(false);

    const handleSelect = async (atmosphere: Atmosphere) => {
        if (saving || atmosphere === selected) return;

        const previous = selected;
        setSelected(atmosphere);
        setSaving(true);

        try {
            const updatedAtmosphere = await updateAtmosphere(atmosphere);
            setSelected(updatedAtmosphere);
            onChange?.(updatedAtmosphere);
        } catch (error) {
            console.error('Error actualizando atmósfera:', error);
            setSelected(previous);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 pt-1">
            <div className="flex w-full flex-nowrap justify-center gap-2" aria-label="Seleccionar atmósfera">
                {atmosphereOptions.map((option) => {
                    const isActive = selected === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => void handleSelect(option.value)}
                            disabled={saving}
                            aria-pressed={isActive}
                            aria-describedby={descriptionId}
                            className={`flex min-w-[5.8rem] shrink-0 items-center justify-center rounded-xl border px-3.5 py-1.5 text-center text-[13px] font-bold transition-all duration-200 outline-none active:scale-95 focus-visible:ring-4 focus-visible:ring-app-focus/80 focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface ${
                                isActive
                                    ? 'border-app-accent bg-app-accent text-app-on-accent shadow-md shadow-app-accent/20 ring-2 ring-app-accent/20'
                                    : 'border-app-accent/25 bg-app-accent/10 text-app-accent-strong hover:-translate-y-0.5 hover:border-app-accent/60 hover:bg-app-accent/20 hover:shadow-md hover:shadow-app-accent/10'
                            } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <p
                id={descriptionId}
                className="mx-auto mt-1 flex min-h-[2.75rem] w-full max-w-[16rem] items-center justify-center text-center text-[13px] font-semibold leading-relaxed text-app-secondary"
            >
                {atmosphereCopy[selected]}
            </p>
        </div>
    );
};
