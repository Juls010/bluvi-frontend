import React, { useState, useEffect, useCallback } from 'react';


export interface FilterState {
  cercaniaKm: number;
  intereses: string[];
  comunicacion: string[];
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}


const INTEREST_CATEGORIES = [
  { id: 'ocio',         label: 'Ocio & entretenimiento', items: ['Gaming', 'Videojuegos', 'Anime', 'Cine', 'Humor', 'Magia', 'Puzzles', 'Comics'] },
  { id: 'creatividad',  label: 'Creatividad', items: ['Diseño', 'Fotografía', 'Cosplay', 'Moda', 'Maquetas', 'Muñecos'] },
  { id: 'naturaleza',   label: 'Naturaleza & aire libre', items: ['Senderismo', 'Naturaleza', 'Montaña', 'Playa', 'Picnic', 'Paseos'] },
  { id: 'conocimiento', label: 'Conocimiento', items: ['Historia', 'Matemáticas', 'Ciencia ficción', 'Tecnología', 'Lectura'] },
  { id: 'cuerpo',       label: 'Cuerpo & salud', items: ['Gimnasio', 'Deporte', 'Salud', 'Veganismo'] },
  { id: 'lifestyle',    label: 'Lifestyle', items: ['Viajar', 'Cocina', 'Comida', 'Mascotas', 'Música', 'Trenes'] },
  { id: 'identidad',    label: 'Identidad & valores', items: ['Feminismo', 'LGTBIQ+', 'Poliamor', 'Religión'] },
];

const COMUNICACION = [
  { label: 'Texto',  desc: 'Prefiero escribir' },
  { label: 'Audio', desc: 'Me expreso mejor hablando' },
  { label: 'Vídeo', desc: 'Me gusta verme en cámara' },
  { label: 'Presencial', desc: 'Quedar en persona primero' },
  { label: 'Sin prisa', desc: 'Respondo cuando puedo' },
  { label: 'Directo', desc: 'Conversaciones al grano' },
];

const PURPLE = '#7c3aed';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
};

const useAnimatedVisibility = (isOpen: boolean, duration = 320) => {
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);
    useEffect(() => {
        if (isOpen) {
        setVisible(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
        } else {
        setAnimating(false);
        const t = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(t);
        }
    }, [isOpen, duration]);
    return { visible, animating };
};


const countActiveFilters = (f: FilterState) =>
    (f.cercaniaKm < 50 ? 1 : 0) +
    (f.intereses.length > 0 ? 1 : 0) +
    (f.comunicacion.length > 0 ? 1 : 0);

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
    );
    const ArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
    );
    const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);

const ComunicacionGrid: React.FC<{
    selected: string[];
    onChange: (items: string[]) => void;
    }> = ({ selected, onChange }) => {
    const toggle = (label: string) =>
        onChange(selected.includes(label) ? selected.filter((i) => i !== label) : [...selected, label]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {COMUNICACION.map(({ label, desc }) => {
            const sel = selected.includes(label);
            return (
            <button
                key={label}
                onClick={() => toggle(label)}
                style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 14, textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.15s',
                border: `1.5px solid ${sel ? PURPLE : '#e5e7eb'}`,
                background: sel ? '#f5f3ff' : '#fff',
                }}
            >
                <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: sel ? PURPLE : '#374151' }}>{label}</p>
                <p style={{ margin: 0, fontSize: 11, color: sel ? '#a78bfa' : '#9ca3af', lineHeight: 1.3 }}>{desc}</p>
                </div>
            </button>
            );
        })}
        </div>
    );
};

const InterestsNavigator: React.FC<{
    selected: string[];
    onChange: (items: string[]) => void;
    onBack: () => void;
    isMobile: boolean;
    }> = ({ selected, onChange, onBack, isMobile }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const currentCategory = INTEREST_CATEGORIES.find((c) => c.id === activeCategory);
    const toggle = (item: string) =>
        onChange(selected.includes(item) ? selected.filter((i) => i !== item) : [...selected, item]);

    return (
        <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', flexShrink: 0 }}>
            <button
            onClick={activeCategory ? () => setActiveCategory(null) : onBack}
            style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
            >
            {activeCategory ? <ArrowLeft /> : <XIcon />}
            </button>
            <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111827' }}>
                {currentCategory ? currentCategory.label : 'Intereses'}
            </p>
            {!activeCategory && selected.length > 0 && (
                <p style={{ margin: 0, fontSize: 12, color: PURPLE, fontWeight: 500 }}>{selected.length} seleccionados</p>
            )}
            </div>
            {selected.length > 0 && !activeCategory && (
            <button onClick={() => onChange([])} style={{ border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
                Limpiar
            </button>
            )}
        </div>
        <div style={{ height: 1, background: '#e5e7eb', margin: '0 20px', flexShrink: 0 }} />

        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 20px' }}>
            {!activeCategory ? (
            INTEREST_CATEGORIES.map((cat) => {
                const n = cat.items.filter((i) => selected.includes(i)).length;
                return (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    padding: '12px 14px', borderRadius: 14, textAlign: 'left', marginBottom: 8,
                    border: `1px solid ${n > 0 ? PURPLE + '40' : '#e5e7eb'}`,
                    background: n > 0 ? '#f5f3ff' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                    }}
                >
                    <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: n > 0 ? PURPLE : '#374151' }}>{cat.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{cat.items.length} intereses</p>
                    </div>
                    {n > 0 && (
                    <span style={{ background: PURPLE, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{n}</span>
                    )}
                    <span style={{ color: '#d1d5db' }}><ChevronRight /></span>
                </button>
                );
            })
            ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentCategory?.items.map((item) => {
                const sel = selected.includes(item);
                return (
                    <button
                    key={item}
                    onClick={() => toggle(item)}
                    style={{
                        padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                        border: `1px solid ${sel ? PURPLE : '#e5e7eb'}`,
                        background: sel ? PURPLE : '#fff',
                        color: sel ? '#fff' : '#4b5563',
                        cursor: 'pointer', transition: 'all 0.15s',
                        transform: sel ? 'scale(1.04)' : 'scale(1)',
                    }}
                    >
                    {item}
                    </button>
                );
                })}
            </div>
            )}
        </div>

        {isMobile && (
            <div style={{ padding: '12px 20px', flexShrink: 0, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
            <button
                onClick={onBack}
                style={{
                width: '100%', padding: 13, borderRadius: 14, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 14,
                background: selected.length > 0 ? PURPLE : '#e9d5ff',
                color: selected.length > 0 ? '#fff' : PURPLE,
                boxShadow: selected.length > 0 ? `0 4px 18px ${PURPLE}44` : 'none',
                }}
            >
                {selected.length > 0 ? `Confirmar (${selected.length} intereses)` : 'Cerrar'}
            </button>
            </div>
        )}
        </>
    );
};

const MobileSheet: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxHeight?: string;
    zIndex?: number;
    }> = ({ isOpen, onClose, children, maxHeight = '90vh', zIndex = 50 }) => {
    const { visible, animating } = useAnimatedVisibility(isOpen);
    if (!visible) return null;
    return (
        <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: zIndex - 1, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', transition: 'opacity 320ms ease', opacity: animating ? 1 : 0 }} />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex, background: '#f9fafb', borderRadius: '22px 22px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', maxHeight, display: 'flex', flexDirection: 'column', transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)', transform: animating ? 'translateY(0)' : 'translateY(100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 38, height: 4, borderRadius: 99, background: '#d1d5db' }} />
            </div>
            {children}
        </div>
        </>
    );
};

const DesktopModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    }> = ({ isOpen, onClose, children }) => {
    const { visible, animating } = useAnimatedVisibility(isOpen);
    if (!visible) return null;
    return (
        <>
        <div
            onClick={onClose}
            style={{
            position: 'fixed', inset: 0, zIndex: 39,
            background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)',
            transition: 'opacity 320ms ease', opacity: animating ? 1 : 0,
            }}
        />
        <div
            style={{
            position: 'fixed', inset: 0, zIndex: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            }}
        >
            <div
            style={{
                width: 500, maxWidth: '95vw',
                background: '#f9fafb',
                borderRadius: 24,
                boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
                display: 'flex', flexDirection: 'column',
                pointerEvents: 'auto',
                transition: 'opacity 320ms ease, transform 320ms cubic-bezier(0.32,0.72,0,1)',
                opacity: animating ? 1 : 0,
                transform: animating ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(12px)',
            }}
            >
            {children}
            </div>
        </div>
        </>
    );
};

type SubView = 'main' | 'intereses' | 'comunicacion';

const FilterBody: React.FC<{
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    onApply: () => void;
    onClose: () => void;
    isMobile: boolean;
    onOpenMobileInterests?: () => void;
    onOpenMobileComunicacion?: () => void;
    subView?: SubView;
    setSubView?: (v: SubView) => void;
}> = ({
    filters, setFilters, onApply, onClose, isMobile,
    onOpenMobileInterests, onOpenMobileComunicacion,
    subView = 'main', setSubView,
}) => {
    const activeCount = countActiveFilters(filters);
    const P = '20px';

    const rowStyle = (hasValue: boolean): React.CSSProperties => ({
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', padding: '13px 14px', borderRadius: 14,
        border: `1px solid ${hasValue ? PURPLE + '40' : '#e5e7eb'}`,
        background: hasValue ? '#f5f3ff' : '#fff',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
    });

    if (!isMobile && subView === 'intereses') {
        return (
        <InterestsNavigator
            selected={filters.intereses}
            onChange={(items) => setFilters((p) => ({ ...p, intereses: items }))}
            onBack={() => setSubView?.('main')}
            isMobile={false}
        />
        );
    }

    if (!isMobile && subView === 'comunicacion') {
        return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', flexShrink: 0 }}>
            <button onClick={() => setSubView?.('main')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <XIcon />
            </button>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111827' }}>Tipo de comunicación</p>
                {filters.comunicacion.length > 0 && <p style={{ margin: 0, fontSize: 12, color: PURPLE, fontWeight: 500 }}>{filters.comunicacion.length} seleccionados</p>}
            </div>
            {filters.comunicacion.length > 0 && (
                <button onClick={() => setFilters((p) => ({ ...p, comunicacion: [] }))} style={{ border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Limpiar</button>
            )}
            </div>
            <div style={{ height: 1, background: '#e5e7eb', margin: '0 20px', flexShrink: 0 }} />
            <div style={{ padding: '16px 20px' }}>
            <ComunicacionGrid
                selected={filters.comunicacion}
                onChange={(items) => setFilters((p) => ({ ...p, comunicacion: items }))}
            />
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', background: '#fff', borderRadius: '0 0 24px 24px' }}>
            <button
                onClick={() => setSubView?.('main')}
                style={{ width: '100%', padding: 13, borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, background: filters.comunicacion.length > 0 ? PURPLE : '#e9d5ff', color: filters.comunicacion.length > 0 ? '#fff' : PURPLE, boxShadow: filters.comunicacion.length > 0 ? `0 4px 18px ${PURPLE}44` : 'none' }}
            >
                {filters.comunicacion.length > 0 ? `Confirmar (${filters.comunicacion.length} estilos)` : 'Volver'}
            </button>
            </div>
        </>
        );
    }

    return (
        <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `14px ${P}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#111827' }}>Filtros</p>
            {activeCount > 0 && (
                <span style={{ background: PURPLE, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{activeCount}</span>
            )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setFilters({ cercaniaKm: 50, intereses: [], comunicacion: [] })} style={{ border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
                Limpiar todo
            </button>
            {!isMobile && (
                <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <XIcon />
                </button>
            )}
            </div>
        </div>

        <div style={{ height: 1, background: '#e5e7eb', margin: `0 ${P}`, flexShrink: 0 }} />

        <div style={{ padding: `18px ${P}`, display: 'flex', flexDirection: 'column', gap: 22 }}>

            <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cercanía</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: PURPLE }}>
                {filters.cercaniaKm >= 50 ? 'Cualquier distancia' : `${filters.cercaniaKm} km`}
                </p>
            </div>
            <input
                type="range" min={1} max={50} value={filters.cercaniaKm}
                onChange={(e) => setFilters((p) => ({ ...p, cercaniaKm: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: PURPLE }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>1 km</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Sin límite</span>
            </div>
            </section>

            <section>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Intereses</p>
            <button
                style={rowStyle(filters.intereses.length > 0)}
                onClick={isMobile ? onOpenMobileInterests : () => setSubView?.('intereses')}
            >
                <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: filters.intereses.length > 0 ? PURPLE : '#374151' }}>
                    {filters.intereses.length === 0
                    ? 'Seleccionar intereses'
                    : `${filters.intereses.length} interés${filters.intereses.length !== 1 ? 'es' : ''} seleccionado${filters.intereses.length !== 1 ? 's' : ''}`}
                </p>
                {filters.intereses.length > 0 && (
                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    {filters.intereses.slice(0, 4).join(', ')}{filters.intereses.length > 4 ? ` +${filters.intereses.length - 4}` : ''}
                    </p>
                )}
                </div>
                <span style={{ color: '#d1d5db' }}><ChevronRight /></span>
            </button>
            </section>

            <section>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tipo de comunicación</p>
            <button
                style={rowStyle(filters.comunicacion.length > 0)}
                onClick={isMobile ? onOpenMobileComunicacion : () => setSubView?.('comunicacion')}
            >
                <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: filters.comunicacion.length > 0 ? PURPLE : '#374151' }}>
                    {filters.comunicacion.length === 0
                    ? 'Seleccionar estilos'
                    : `${filters.comunicacion.length} estilo${filters.comunicacion.length !== 1 ? 's' : ''} seleccionado${filters.comunicacion.length !== 1 ? 's' : ''}`}
                </p>
                {filters.comunicacion.length > 0 && (
                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{filters.comunicacion.join(', ')}</p>
                )}
                </div>
                <span style={{ color: '#d1d5db' }}><ChevronRight /></span>
            </button>
            </section>
        </div>

        <div style={{ padding: `12px ${P}`, borderTop: '1px solid #e5e7eb', background: '#fff', borderRadius: isMobile ? 0 : '0 0 24px 24px' }}>
            <button
            onClick={onApply}
            style={{
                width: '100%', padding: 14, borderRadius: 14, border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#fff',
                background: PURPLE, boxShadow: `0 4px 20px ${PURPLE}44`,
                transition: 'opacity 0.2s',
            }}
            >
            {activeCount > 0 ? `Aplicar filtros (${activeCount})` : 'Aplicar'}
            </button>
        </div>
        </>
    );
};

export const FilterBottomsheet: React.FC<FilterBottomSheetProps> = ({
    isOpen, onClose, onApply, initialFilters,
    }) => {
    const isMobile = useIsMobile();
    const defaultFilters: FilterState = { cercaniaKm: 50, intereses: [], comunicacion: [] };
    const [filters, setFilters] = useState<FilterState>(initialFilters ?? defaultFilters);

    const [subView, setSubView] = useState<SubView>('main');

    const [showMobileInterests, setShowMobileInterests] = useState(false);
    const [showMobileComunicacion, setShowMobileComunicacion] = useState(false);

    useEffect(() => { if (isOpen) setSubView('main'); }, [isOpen]);

    const handleApply = useCallback(() => {
        onApply(filters);
        onClose();
    }, [filters, onApply, onClose]);

    const sharedProps = {
        filters, setFilters,
        onApply: handleApply,
        onClose,
        isMobile,
    };

    if (isMobile) {
        return (
        <>
            <MobileSheet isOpen={isOpen} onClose={onClose}>
            <FilterBody
                {...sharedProps}
                onOpenMobileInterests={() => setShowMobileInterests(true)}
                onOpenMobileComunicacion={() => setShowMobileComunicacion(true)}
            />
            </MobileSheet>

            <MobileSheet isOpen={showMobileInterests} onClose={() => setShowMobileInterests(false)} maxHeight="85vh" zIndex={60}>
            <InterestsNavigator
                selected={filters.intereses}
                onChange={(items) => setFilters((p) => ({ ...p, intereses: items }))}
                onBack={() => setShowMobileInterests(false)}
                isMobile={true}
            />
            </MobileSheet>

            <MobileSheet isOpen={showMobileComunicacion} onClose={() => setShowMobileComunicacion(false)} maxHeight="70vh" zIndex={60}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', flexShrink: 0 }}>
                <button onClick={() => setShowMobileComunicacion(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <XIcon />
                </button>
                <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111827' }}>Tipo de comunicación</p>
                {filters.comunicacion.length > 0 && <p style={{ margin: 0, fontSize: 12, color: PURPLE, fontWeight: 500 }}>{filters.comunicacion.length} seleccionados</p>}
                </div>
                {filters.comunicacion.length > 0 && (
                <button onClick={() => setFilters((p) => ({ ...p, comunicacion: [] }))} style={{ border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>Limpiar</button>
                )}
            </div>
            <div style={{ height: 1, background: '#e5e7eb', margin: '0 20px', flexShrink: 0 }} />
            <div style={{ overflowY: 'auto', flex: 1, padding: '14px 20px' }}>
                <ComunicacionGrid
                selected={filters.comunicacion}
                onChange={(items) => setFilters((p) => ({ ...p, comunicacion: items }))}
                />
            </div>
            <div style={{ padding: '12px 20px', flexShrink: 0, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
                <button
                onClick={() => setShowMobileComunicacion(false)}
                style={{ width: '100%', padding: 13, borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, background: filters.comunicacion.length > 0 ? PURPLE : '#e9d5ff', color: filters.comunicacion.length > 0 ? '#fff' : PURPLE, boxShadow: filters.comunicacion.length > 0 ? `0 4px 18px ${PURPLE}44` : 'none' }}
                >
                {filters.comunicacion.length > 0 ? `Confirmar (${filters.comunicacion.length} estilos)` : 'Cerrar'}
                </button>
            </div>
            </MobileSheet>
        </>
        );
    }

    return (
        <DesktopModal isOpen={isOpen} onClose={onClose}>
        <FilterBody
            {...sharedProps}
            subView={subView}
            setSubView={setSubView}
        />
        </DesktopModal>
    );
};

export const FilterTriggerButton: React.FC<{
    activeCount: number;
    onClick: () => void;
    }> = ({ activeCount, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all shadow-sm bg-white/50 backdrop-blur-sm text-bluvi-purple border-bluvi-purple/20 hover:bg-bluvi-purple/10 hover:border-bluvi-purple/40"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
        <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
        </svg>
        <span>Filtros</span>
        {activeCount > 0 && (
        <span className="bg-bluvi-purple text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
        </span>
        )}
    </button>
);