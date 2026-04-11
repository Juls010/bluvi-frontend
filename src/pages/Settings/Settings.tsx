import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '../../context/AuthContext';
import {
    getPrivacy,
    updatePrivacy,
    getAccessibilityPreferences,
    updateAccessibilityPreferences,
    type Privacy,
    type AccessibilityPreferences,
} from '../../services/user.service';
import { DeleteAccountModal } from '../../components/DeleteAccountModal';
import {
    Contrast,
    Droplets,
    Eye,
    LogOut,
    RotateCcw,
    ShieldCheck,
    Trash2,
    Type,
    MessageSquare,
    ZapOff,
    Flag,
    Monitor,
    Sun,
    Moon,
    Palette,
} from 'lucide-react';

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
    <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-app-primary">
            {title}
        </h2>
        {description && <p className="text-sm text-app-muted mt-1">{description}</p>}
    </div>
);

const Toggle: React.FC<{
    label: string;
    enabled: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    labelledBy?: string;
    describedBy?: string;
}> = ({ label, enabled, onChange, disabled, labelledBy, describedBy }) => {
    const switchId = useId();

    return (
    <button
        id={switchId}
        role="switch"
        aria-checked={enabled}
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        style={{ backgroundColor: enabled ? 'var(--app-switch-on)' : 'var(--app-switch-off)' }}
        className={`
            relative w-12 h-6 rounded-full transition-colors duration-200 border border-app-soft
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluvi-purple/50
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
    >
        <span className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-200 border border-app-soft
            ${enabled ? 'translate-x-6' : 'translate-x-0'}
        `} style={{ backgroundColor: 'var(--app-switch-thumb)' }} />
    </button>
);
};

const SettingRow: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    enabled: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    saving?: boolean;
}> = ({ icon, title, description, enabled, onChange, disabled, saving }) => {
    const rowId = useId();
    const titleId = `${rowId}-title`;
    const descId = `${rowId}-desc`;

    return (
    <div className="flex items-start justify-between gap-4 py-4">
        <div className="flex-1 pr-2">
            <p id={titleId} className="text-sm font-semibold text-app-primary flex items-center gap-2">
                <span aria-hidden="true" className="text-app-accent">{icon}</span>
                {title}
            </p>
            <p id={descId} className="text-xs text-app-muted mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <Toggle
                label={title}
                enabled={enabled}
                onChange={onChange}
                disabled={disabled || saving}
                labelledBy={titleId}
                describedBy={descId}
            />
        </div>
    </div>
);
};

const Card: React.FC<{
    children: React.ReactNode;
    ariaLabel?: string;
    busy?: boolean;
}> = ({ children, ariaLabel, busy = false }) => (
    <div
        className="bg-app-surface backdrop-blur-md rounded-[24px] border border-app-soft shadow-sm px-5 md:px-6"
        role={ariaLabel ? 'region' : undefined}
        aria-label={ariaLabel}
        aria-busy={busy || undefined}
    >
        {children}
    </div>
);


type FontSize = 'normal' | 'large' | 'xlarge';
type Contrast = 'normal' | 'high';

const FONT_SIZES: { value: FontSize; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'large',  label: 'Grande' },
    { value: 'xlarge', label: 'Muy grande' },
];

const FONT_SIZE_MAP: Record<FontSize, string> = {
    normal: '100%',
    large: '112.5%',
    xlarge: '125%',
};

type ThemeChoice = 'light' | 'dark' | 'system';

const THEME_OPTIONS: Array<{ value: ThemeChoice; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Claro', icon: <Sun size={14} aria-hidden="true" /> },
    { value: 'dark', label: 'Oscuro', icon: <Moon size={14} aria-hidden="true" /> },
    { value: 'system', label: 'Sistema', icon: <Monitor size={14} aria-hidden="true" /> },
];

const useFontSize = () => {
    const getStoredFont = (): FontSize => {
        const saved = localStorage.getItem('a11y_font');
        if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
        return 'normal';
    };

    const [size, setSize] = useState<FontSize>(getStoredFont);

    const apply = (s: FontSize) => {
        setSize(s);
        localStorage.setItem('a11y_font', s);
        document.documentElement.style.fontSize = FONT_SIZE_MAP[s];
    };

    useEffect(() => {
        const saved = getStoredFont();
        document.documentElement.style.fontSize = FONT_SIZE_MAP[saved];
        setSize(saved);
    }, []);

    return { size, apply };
};

const useContrast = () => {
    const getStoredContrast = (): Contrast => {
        const saved = localStorage.getItem('a11y_contrast');
        return saved === 'high' ? 'high' : 'normal';
    };

    const [contrast, setContrast] = useState<Contrast>(getStoredContrast);

    const apply = (c: Contrast) => {
        setContrast(c);
        localStorage.setItem('a11y_contrast', c);
        document.documentElement.classList.toggle('high-contrast', c === 'high');
    };

    useEffect(() => {
        const saved = getStoredContrast();
        document.documentElement.classList.toggle('high-contrast', saved === 'high');
        setContrast(saved);
    }, []);

    return { contrast, apply };
};

// Main page

export const Settings: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [privacy, setPrivacy] = useState<Privacy>({ is_visible: true, messages_only_matches: false, show_online_status: true });
    const [loadingPrivacy, setLoadingPrivacy] = useState(true);
    const [savingField, setSavingField] = useState<keyof Privacy | null>(null);
    const [savingAccessibility, setSavingAccessibility] = useState(false);
    const [privacyError, setPrivacyError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const { size: fontSize, apply: applyFont } = useFontSize();
    const { contrast, apply: applyContrast } = useContrast();
    const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
        const saved = localStorage.getItem('a11y_motion');
        if (saved === 'reduce') return true;
        if (saved === 'normal') return false;
        return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    const [reduceTransparency, setReduceTransparency] = useState<boolean>(() => {
        const saved = localStorage.getItem('a11y_transparency');
        return saved === 'reduce';
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        getPrivacy()
            .then(setPrivacy)
            .catch(() => {
                setPrivacyError(null);
                setStatusMessage('No se pudo sincronizar privacidad al cargar. Puedes seguir usando ajustes locales.');
            })
            .finally(() => setLoadingPrivacy(false));
    }, []);

    useEffect(() => {
        let cancelled = false;

        const syncAccessibility = async () => {
            try {
                const prefs = await getAccessibilityPreferences();
                if (cancelled) return;

                applyFont(prefs.font_size);
                applyContrast(prefs.contrast);
                setReduceMotion(Boolean(prefs.reduce_motion));
            } catch {
                if (!cancelled) {
                    setStatusMessage('No se pudo sincronizar accesibilidad. Usaremos tus ajustes locales en este dispositivo.');
                }
            }
        };

        syncAccessibility();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('reduce-motion', reduceMotion);
        localStorage.setItem('a11y_motion', reduceMotion ? 'reduce' : 'normal');
        window.dispatchEvent(new Event('bluvi:a11y-sync'));
    }, [reduceMotion]);

    useEffect(() => {
        document.documentElement.classList.toggle('low-transparency', reduceTransparency);
        localStorage.setItem('a11y_transparency', reduceTransparency ? 'reduce' : 'normal');
        window.dispatchEvent(new Event('bluvi:a11y-sync'));
    }, [reduceTransparency]);

    const handlePrivacyChange = async (key: keyof Privacy, value: boolean) => {
        setPrivacyError(null);
        setStatusMessage(null);
        setPrivacy((prev) => ({ ...prev, [key]: value }));
        setSavingField(key);

        try {
            const updated = await updatePrivacy({ [key]: value });
            setPrivacy(updated);
            setStatusMessage('Ajuste de privacidad guardado.');
        } catch {
            setPrivacy((prev) => ({ ...prev, [key]: !value }));
            setPrivacyError('No se pudo guardar el cambio de privacidad. Hemos restaurado el estado anterior.');
        } finally {
            setSavingField(null);
        }
    };

    const handleRetryPrivacy = async () => {
        setPrivacyError(null);
        setLoadingPrivacy(true);
        try {
            const response = await getPrivacy();
            setPrivacy(response);
            setStatusMessage('Privacidad actualizada.');
        } catch {
            setPrivacyError('No hemos podido cargar la privacidad. Intentalo mas tarde.');
        } finally {
            setLoadingPrivacy(false);
        }
    };

    const handleReduceMotion = (val: boolean) => {
        setReduceMotion(val);
        void persistAccessibility({ reduce_motion: val }, 'Preferencias de movimiento actualizadas.');
    };

    const handleReduceTransparency = (val: boolean) => {
        setReduceTransparency(val);
        setStatusMessage(val ? 'Transparencias reducidas activadas.' : 'Transparencias reducidas desactivadas.');
    };

    const persistAccessibility = async (
        patch: Partial<AccessibilityPreferences>,
        successMessage: string
    ) => {
        setSavingAccessibility(true);
        try {
            await updateAccessibilityPreferences(patch);
            setStatusMessage(successMessage);
        } catch {
            setStatusMessage('No se pudo guardar accesibilidad en tu cuenta. El cambio queda solo en este dispositivo.');
        } finally {
            setSavingAccessibility(false);
        }
    };

    const handleResetAccessibility = () => {
        applyFont('normal');
        applyContrast('normal');
        setReduceMotion(false);
        setReduceTransparency(false);
        void persistAccessibility(
            { font_size: 'normal', contrast: 'normal', reduce_motion: false },
            'Ajustes de accesibilidad restaurados.'
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleThemeSelect = (value: ThemeChoice) => {
        setTheme(value);
        const selected = THEME_OPTIONS.find((option) => option.value === value);
        if (selected) {
            setStatusMessage(`Tema ${selected.label.toLowerCase()} activado.`);
        }
    };

    const handleFontSizeSelect = (value: FontSize) => {
        applyFont(value);
        const selected = FONT_SIZES.find((option) => option.value === value);
        const selectedLabel = selected ? selected.label.toLowerCase() : value;
        void persistAccessibility({ font_size: value }, `Tamaño de texto ${selectedLabel} activado.`);
    };

    const handleRadioGroupKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        currentIndex: number,
        total: number,
        groupName: 'theme' | 'font-size',
        onSelect: (index: number) => void
    ) => {
        let nextIndex: number | null = null;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % total;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + total) % total;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = total - 1;
        }

        if (nextIndex === null) {
            return;
        }

        event.preventDefault();
        onSelect(nextIndex);

        window.requestAnimationFrame(() => {
            const selector = `[data-radio-group="${groupName}"][data-radio-index="${nextIndex}"]`;
            const targetButton = document.querySelector<HTMLButtonElement>(selector);
            targetButton?.focus();
        });
    };

    return (
        <>
            <article className="w-full max-w-3xl mx-auto p-4 md:p-0 pb-16 animate-fade-in motion-reduce:animate-none space-y-7">

                <div className="space-y-3 md:space-y-4">
                    <span className="inline-flex w-fit items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-app-secondary bg-app-surface-soft border border-app-soft px-3 py-1 rounded-full">
                        <ShieldCheck size={12} aria-hidden="true" />
                        Preferencias
                    </span>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-app-primary">Ajustes</h1>
                    <p className="max-w-2xl text-sm text-app-secondary/90">Personaliza tu experiencia en Bluvi sin perder claridad.</p>
                </div>

                <p className="sr-only" aria-live="polite">{statusMessage ?? ''}</p>

                <section>
                    <SectionTitle
                        title="Privacidad"
                        description="Controla quien puede encontrarte y escribirte."
                    />

                    {privacyError && (
                        <div className="mb-3 rounded-2xl border border-red-100 bg-red-50/70 px-4 py-3">
                            <p className="text-sm text-red-600">{privacyError}</p>
                            <button
                                type="button"
                                onClick={handleRetryPrivacy}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                            >
                                <RotateCcw size={14} aria-hidden="true" />
                                Reintentar
                            </button>
                        </div>
                    )}

                    <Card
                        ariaLabel="Ajustes de privacidad"
                        busy={loadingPrivacy || savingField !== null}
                    >
                        <SettingRow
                            icon={<Eye size={15} />}
                            title="Aparecer en Explorar"
                            description="Si lo desactivas, nadie nuevo podrá encontrar tu perfil. Puedes reactivarlo cuando quieras."
                            enabled={loadingPrivacy ? true : privacy.is_visible}
                            onChange={(val) => handlePrivacyChange('is_visible', val)}
                            disabled={loadingPrivacy}
                            saving={savingField === 'is_visible'}
                        />
                        <SettingRow
                            icon={<MessageSquare size={15} />}
                            title="Mostrar estado en línea"
                            description="Si lo desactivas, tus matches no verán si estás conectada/o ahora mismo."
                            enabled={loadingPrivacy ? true : privacy.show_online_status}
                            onChange={(val) => handlePrivacyChange('show_online_status', val)}
                            disabled={loadingPrivacy}
                            saving={savingField === 'show_online_status'}
                        />
                    </Card>
                </section>

                <section>
                    <SectionTitle
                        title="Apariencia"
                        description="Elige entre modo claro, oscuro o automático según tu sistema."
                    />
                    <Card ariaLabel="Ajustes de apariencia">
                        <div className="py-4">
                            <p className="text-sm font-semibold text-app-primary mb-1 flex items-center gap-2">
                                <Palette size={15} aria-hidden="true" />
                                Tema de la interfaz
                            </p>
                            <p className="text-xs text-app-muted mb-3">Puedes cambiarlo cuando quieras desde aquí.</p>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tema visual de la aplicación">
                                {THEME_OPTIONS.map(({ value, label, icon }) => {
                                    const optionIndex = THEME_OPTIONS.findIndex((option) => option.value === value);
                                    const isActive = (theme ?? 'system') === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={isActive}
                                            tabIndex={isActive ? 0 : -1}
                                            data-radio-group="theme"
                                            data-radio-index={optionIndex}
                                            onClick={() => handleThemeSelect(value)}
                                            onKeyDown={(event) =>
                                                handleRadioGroupKeyDown(event, optionIndex, THEME_OPTIONS.length, 'theme', (nextIndex) => {
                                                    handleThemeSelect(THEME_OPTIONS[nextIndex].value);
                                                })
                                            }
                                            disabled={!mounted}
                                            className={`
                                                min-w-[110px] flex-1 py-2 rounded-xl text-sm font-medium border transition-all inline-flex items-center justify-center gap-2
                                                ${isActive
                                                    ? 'bg-bluvi-purple text-white border-bluvi-purple shadow-sm'
                                                    : 'bg-app-surface-soft text-app-primary border-app-soft hover:border-bluvi-purple/40'
                                                }
                                                ${!mounted ? 'opacity-70 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </section>

                <section>
                    <SectionTitle
                        title="Accesibilidad"
                        description="Estos ajustes se guardan en este dispositivo para una navegación más cómoda."
                    />
                    <Card
                        ariaLabel="Ajustes de accesibilidad"
                        busy={savingAccessibility}
                    >
                        <div className="py-4">
                            <p className="text-sm font-semibold text-app-primary mb-1 flex items-center gap-2">
                                <Type size={15} aria-hidden="true" />
                                Tamaño del texto
                            </p>
                            <p className="text-xs text-app-muted mb-3">Cambia el tamaño de todo el texto de la app.</p>
                            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tamaño del texto">
                                {FONT_SIZES.map(({ value, label }, optionIndex) => {
                                    const isActive = fontSize === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            role="radio"
                                            aria-checked={isActive}
                                            tabIndex={isActive ? 0 : -1}
                                            data-radio-group="font-size"
                                            data-radio-index={optionIndex}
                                            onClick={() => handleFontSizeSelect(value)}
                                            onKeyDown={(event) =>
                                                handleRadioGroupKeyDown(event, optionIndex, FONT_SIZES.length, 'font-size', (nextIndex) => {
                                                    handleFontSizeSelect(FONT_SIZES[nextIndex].value);
                                                })
                                            }
                                            disabled={savingAccessibility}
                                            className={`
                                                min-w-[110px] flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                                                ${isActive
                                                    ? 'bg-bluvi-purple text-white border-bluvi-purple shadow-sm'
                                                    : 'bg-app-surface-soft text-app-primary border-app-soft hover:border-bluvi-purple/40'
                                                }
                                                ${savingAccessibility ? 'opacity-80 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <SettingRow
                            icon={<Contrast size={15} />}
                            title="Alto contraste"
                            description="Aumenta el contraste de colores para facilitar la lectura."
                            enabled={contrast === 'high'}
                            onChange={(val) => {
                                const nextContrast = val ? 'high' : 'normal';
                                applyContrast(nextContrast);
                                void persistAccessibility(
                                    { contrast: nextContrast },
                                    nextContrast === 'high' ? 'Alto contraste activado.' : 'Alto contraste desactivado.'
                                );
                            }}
                            saving={savingAccessibility}
                        />

                        <SettingRow
                            icon={<Droplets size={15} />}
                            title="Reducir transparencias"
                            description="Disminuye desenfoques y capas translúcidas para una lectura más estable."
                            enabled={reduceTransparency}
                            onChange={handleReduceTransparency}
                        />

                        <SettingRow
                            icon={<ZapOff size={15} />}
                            title="Reducir animaciones"
                            description="Desactiva las animaciones y transiciones. Útil si el movimiento te genera distracción o malestar."
                            enabled={reduceMotion}
                            onChange={handleReduceMotion}
                        />

                        <div className="py-4">
                            <button
                                type="button"
                                onClick={handleResetAccessibility}
                                className="inline-flex items-center gap-2 rounded-xl border border-app-soft bg-app-surface-soft px-3 py-2 text-xs font-semibold text-app-primary hover:bg-app-surface-strong hover:border-app-strong transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-light-purple/40"
                            >
                                <RotateCcw size={14} aria-hidden="true" />
                                Restablecer accesibilidad
                            </button>
                        </div>
                    </Card>
                </section>

                <section>
                    <SectionTitle
                        title="Cuenta"
                        description="Acciones de sesión y administración de tu cuenta."
                    />
                    <Card ariaLabel="Ajustes de cuenta">
                        <div className="py-4">
                            <button
                                type="button"
                                data-account-action="true"
                                onClick={() => navigate('/app/settings/reports-blocks')}
                                className="w-full py-3 rounded-2xl border border-app-soft text-app-primary text-sm font-semibold hover:bg-app-surface-soft hover:border-app-strong transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm text-left px-4 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-light-purple/35"
                            >
                                <span className="mt-0.5 inline-flex items-center gap-1 text-app-accent" aria-hidden="true">
                                    <Flag size={16} />
                                </span>
                                <div>
                                    <p className="font-semibold">Reportes y bloqueos</p>
                                    <p className="text-xs text-app-muted font-normal">Revisa reportes enviados y gestiona perfiles bloqueados.</p>
                                </div>
                            </button>
                        </div>
                        <div className="py-4">
                            <button
                                type="button"
                                data-account-action="true"
                                onClick={handleLogout}
                                className="w-full py-3 rounded-2xl border border-app-soft text-app-primary text-sm font-semibold hover:bg-app-surface-soft hover:border-app-strong transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm text-left px-4 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-light-purple/35"
                            >
                                <LogOut size={18} aria-hidden="true" className="mt-0.5" />
                                <div>
                                    <p className="font-semibold">Cerrar sesión</p>
                                    <p className="text-xs text-app-muted font-normal">Sal de tu cuenta en este dispositivo.</p>
                                </div>
                            </button>
                        </div>
                        <div className="py-4">
                            <button
                                type="button"
                                data-account-action="true"
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-3 rounded-2xl border border-red-100 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm text-left px-4 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                            >
                                <Trash2 size={18} aria-hidden="true" className="mt-0.5" />
                                <div>
                                    <p className="font-semibold">Eliminar cuenta</p>
                                    <p className="text-xs text-red-400 font-normal">Borra todos tus datos de forma permanente.</p>
                                </div>
                            </button>
                        </div>
                    </Card>
                </section>
            </article>

            {showDeleteModal && (
                <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
            )}
        </>
    );
};