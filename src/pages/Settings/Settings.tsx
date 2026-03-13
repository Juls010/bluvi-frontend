import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPrivacy, updatePrivacy, type Privacy } from '../../services/user.service';
import { DeleteAccountModal } from '../../components/DeleteAccountModal';

// ─── Subcomponents ────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ emoji: string; title: string; description?: string }> = ({ emoji, title, description }) => (
    <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span>{emoji}</span>{title}
        </h2>
        {description && <p className="text-xs text-gray-400 mt-1 ml-6">{description}</p>}
    </div>
);

const Toggle: React.FC<{
    enabled: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => (
    <button
        role="switch"
        aria-checked={enabled}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
            relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluvi-purple/50
            ${enabled ? 'bg-bluvi-purple' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
    >
        <span className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${enabled ? 'translate-x-6' : 'translate-x-0'}
        `} />
    </button>
);

const SettingRow: React.FC<{
    title: string;
    description: string;
    enabled: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    saving?: boolean;
}> = ({ title, description, enabled, onChange, disabled, saving }) => (
    <div className="flex items-start justify-between gap-4 py-4">
        <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            {saving && (
                <svg className="animate-spin h-3.5 w-3.5 text-bluvi-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            )}
            <Toggle enabled={enabled} onChange={onChange} disabled={disabled || saving} />
        </div>
    </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm divide-y divide-gray-100 px-6">
        {children}
    </div>
);

// ─── Accesibilidad ────────────────────────────────────────────────────────────

type FontSize = 'normal' | 'large' | 'xlarge';
type Contrast = 'normal' | 'high';

const FONT_SIZES: { value: FontSize; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'large',  label: 'Grande' },
    { value: 'xlarge', label: 'Muy grande' },
];

const useFontSize = () => {
    const [size, setSize] = useState<FontSize>(() =>
        (localStorage.getItem('a11y_font') as FontSize) ?? 'normal'
    );
    const apply = (s: FontSize) => {
        setSize(s);
        localStorage.setItem('a11y_font', s);
        const map = { normal: '100%', large: '112.5%', xlarge: '125%' };
        document.documentElement.style.fontSize = map[s];
    };
    useEffect(() => {
        const saved = (localStorage.getItem('a11y_font') as FontSize) ?? 'normal';
        const map = { normal: '100%', large: '112.5%', xlarge: '125%' };
        document.documentElement.style.fontSize = map[saved];
    }, []);
    return { size, apply };
};

const useContrast = () => {
    const [contrast, setContrast] = useState<Contrast>(() =>
        (localStorage.getItem('a11y_contrast') as Contrast) ?? 'normal'
    );
    const apply = (c: Contrast) => {
        setContrast(c);
        localStorage.setItem('a11y_contrast', c);
        document.documentElement.classList.toggle('high-contrast', c === 'high');
    };
    useEffect(() => {
        const saved = (localStorage.getItem('a11y_contrast') as Contrast) ?? 'normal';
        document.documentElement.classList.toggle('high-contrast', saved === 'high');
    }, []);
    return { contrast, apply };
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const Settings: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Privacidad
    const [privacy, setPrivacy] = useState<Privacy>({ is_visible: true, messages_only_matches: false });
    const [loadingPrivacy, setLoadingPrivacy] = useState(true);
    const [savingField, setSavingField] = useState<keyof Privacy | null>(null);

    // Accesibilidad
    const { size: fontSize, apply: applyFont } = useFontSize();
    const { contrast, apply: applyContrast } = useContrast();
    const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('a11y_motion') === 'reduce');

    // UI
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        getPrivacy()
            .then(setPrivacy)
            .finally(() => setLoadingPrivacy(false));
    }, []);

    const handlePrivacyChange = async (key: keyof Privacy, value: boolean) => {
        setPrivacy((prev) => ({ ...prev, [key]: value }));
        setSavingField(key);
        try {
            const updated = await updatePrivacy({ [key]: value });
            setPrivacy(updated);
        } catch {
            // revertir si falla
            setPrivacy((prev) => ({ ...prev, [key]: !value }));
        } finally {
            setSavingField(null);
        }
    };

    const handleReduceMotion = (val: boolean) => {
        setReduceMotion(val);
        localStorage.setItem('a11y_motion', val ? 'reduce' : 'normal');
        document.documentElement.classList.toggle('reduce-motion', val);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <article className="w-full max-w-2xl mx-auto p-4 md:p-0 pb-16 animate-fade-in space-y-8">

                <div className="pl-2">
                    <h1 className="text-3xl font-heading font-bold text-bluvi-purple">Ajustes</h1>
                    <p className="text-sm text-gray-400 mt-1">Personaliza tu experiencia en Bluvi</p>
                </div>

                {/* ── Privacidad ── */}
                <section>
                    <SectionTitle emoji="🔒" title="Privacidad" />
                    <Card>
                        <SettingRow
                            title="Aparecer en Explorar"
                            description="Si lo desactivas, nadie nuevo podrá encontrar tu perfil. Puedes reactivarlo cuando quieras."
                            enabled={loadingPrivacy ? true : privacy.is_visible}
                            onChange={(val) => handlePrivacyChange('is_visible', val)}
                            disabled={loadingPrivacy}
                            saving={savingField === 'is_visible'}
                        />
                        <SettingRow
                            title="Mensajes solo de personas con match"
                            description="Si lo activas, solo recibirás mensajes de personas con las que hayas hecho match. El resto no podrá escribirte."
                            enabled={loadingPrivacy ? false : privacy.messages_only_matches}
                            onChange={(val) => handlePrivacyChange('messages_only_matches', val)}
                            disabled={loadingPrivacy}
                            saving={savingField === 'messages_only_matches'}
                        />
                    </Card>
                </section>

                {/* ── Accesibilidad ── */}
                <section>
                    <SectionTitle
                        emoji="♿"
                        title="Accesibilidad"
                        description="Estos ajustes se guardan en este dispositivo."
                    />
                    <Card>
                        {/* Tamaño de texto */}
                        <div className="py-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Tamaño del texto</p>
                            <p className="text-xs text-gray-400 mb-3">Cambia el tamaño de todo el texto de la app.</p>
                            <div className="flex gap-2">
                                {FONT_SIZES.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => applyFont(value)}
                                        className={`
                                            flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                                            ${fontSize === value
                                                ? 'bg-bluvi-purple text-white border-bluvi-purple'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-bluvi-purple/40'
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Alto contraste */}
                        <SettingRow
                            title="Alto contraste"
                            description="Aumenta el contraste de colores para facilitar la lectura."
                            enabled={contrast === 'high'}
                            onChange={(val) => applyContrast(val ? 'high' : 'normal')}
                        />

                        {/* Reducir movimiento */}
                        <SettingRow
                            title="Reducir animaciones"
                            description="Desactiva las animaciones y transiciones. Útil si el movimiento te genera distracción o malestar."
                            enabled={reduceMotion}
                            onChange={handleReduceMotion}
                        />
                    </Card>
                </section>

                {/* ── Cuenta ── */}
                <section>
                    <SectionTitle emoji="👤" title="Cuenta" />
                    <Card>
                        <div className="py-4">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors text-left px-4 flex items-center gap-3"
                            >
                                <span className="text-lg">🚪</span>
                                <div>
                                    <p className="font-semibold">Cerrar sesión</p>
                                    <p className="text-xs text-gray-400 font-normal">Sal de tu cuenta en este dispositivo.</p>
                                </div>
                            </button>
                        </div>
                        <div className="py-4">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-3 rounded-2xl border border-red-100 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors text-left px-4 flex items-center gap-3"
                            >
                                <span className="text-lg">🗑️</span>
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