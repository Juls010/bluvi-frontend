import React, { useState, useEffect } from 'react';
import { SimpleCarousel } from '../../components/SimpleCarousel';
import { getMyProfile, updateMyProfile } from '../../services/user.service';
import {
  type User,
  GENDER_LABELS,
  SEXUALITY_LABELS,
  NEURODIVERGENCE_LABELS,
  COMMUNICATION_LABELS,
  INTEREST_LABELS,
  idsToLabels,
} from '../../types/User.types';

interface UserProfileProps {
  onSave?: (updated: User) => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 22, height: 22 }}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

// ─── Subcomponents ────────────────────────────────────────────────────────────

const Chip: React.FC<{
  label: string;
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
}> = ({ label, selected, onClick, removable }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
      border transition-all duration-150 select-none
      ${selected
        ? 'bg-bluvi-purple text-white border-bluvi-purple'
        : removable
          ? 'bg-bluvi-purple/10 text-bluvi-purple border-bluvi-purple/20 hover:bg-bluvi-purple/20'
          : 'bg-white text-gray-600 border-gray-200 hover:border-bluvi-purple/40 hover:bg-bluvi-purple/5'
      }
    `}
  >
    {label}
    {removable && <span className="opacity-60"><XIcon /></span>}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ emoji: string; label: string }> = ({ emoji, label }) => (
  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
    <span aria-hidden="true">{emoji}</span> {label}
  </h2>
);

const Divider = () => <div className="border-t border-gray-100 my-6" />;

const ProfileSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto p-4 md:p-0 animate-pulse">
    <div className="h-10 w-48 bg-gray-200 rounded-xl mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4"><div className="aspect-square rounded-3xl bg-gray-200" /></div>
      <div className="md:col-span-8 flex flex-col gap-4">
        <div className="h-32 rounded-3xl bg-gray-200" />
        <div className="h-24 rounded-3xl bg-gray-200" />
        <div className="h-24 rounded-3xl bg-gray-200" />
      </div>
    </div>
  </div>
);

// ─── Edit modal ───────────────────────────────────────────────────────────────

const EditModal: React.FC<{
  user: User;
  onSave: (u: User) => void;
  onClose: () => void;
  isSaving: boolean;
}> = ({ user, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState<User>({ ...user });
  const [interestSearch, setInterestSearch] = useState('');

  const set = <K extends keyof User>(key: K, value: User[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleId = (key: 'interests' | 'neurodivergences' | 'communication_style', id: number) => {
    const arr = form[key] as number[];
    set(key, arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]);
  };

  const filteredInterests = Object.entries(INTEREST_LABELS).filter(([, label]) =>
    label.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-bluvi-purple/30 focus:border-bluvi-purple/50 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

  const age = form.birth_date
    ? Math.floor((Date.now() - new Date(form.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-lg bg-gray-50 rounded-3xl shadow-2xl flex flex-col pointer-events-auto animate-fade-in"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-800">Editar perfil</h2>
            <button onClick={onClose} disabled={isSaving} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50">
              <XIcon />
            </button>
          </div>
          <div className="h-px bg-gray-200 mx-6 flex-shrink-0" />

          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

            {/* Fotos */}
            <section>
              <p className={labelCls}>Fotos</p>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const photo = form.photos?.[i];
                  return (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-100 flex items-center justify-center relative group cursor-pointer hover:border-bluvi-purple/40 transition-colors">
                      {photo ? (
                        <>
                          <img src={photo} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...form.photos];
                              updated[i] = null;
                              set('photos', updated);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XIcon />
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-300"><PlusIcon /></span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">La primera foto es tu foto principal.</p>
            </section>

            <Divider />

            {/* Info básica */}
            <section className="space-y-4">
              <p className={labelCls}>Información básica</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nombre</label>
                  <input className={inputCls} value={form.first_name} onChange={(e) => set('first_name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Apellido</label>
                  <input className={inputCls} value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Fecha de nacimiento {age !== null && <span className="text-bluvi-purple">({age} años)</span>}
                  </label>
                  <input
                    type="date"
                    className={inputCls}
                    value={form.birth_date?.split('T')[0] ?? ''}
                    onChange={(e) => set('birth_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ciudad</label>
                  <input className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Género</label>
                  <select className={inputCls} value={form.id_gender} onChange={(e) => set('id_gender', Number(e.target.value))}>
                    {Object.entries(GENDER_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sexualidad</label>
                  <select
                    className={inputCls}
                    value={form.sexuality[0] ?? ''}
                    onChange={(e) => set('sexuality', e.target.value ? [Number(e.target.value)] : [])}
                  >
                    <option value="">Sin especificar</option>
                    {Object.entries(SEXUALITY_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <Divider />

            {/* Descripción */}
            <section>
              <label className={labelCls}>Descripción</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={4}
                value={form.description}
                maxLength={300}
                onChange={(e) => set('description', e.target.value)}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{form.description?.length ?? 0}/300</p>
            </section>

            <Divider />

            {/* Intereses */}
            <section>
              <p className={labelCls}>
                Intereses
                {form.interests.length > 0 && (
                  <span className="ml-2 text-bluvi-purple normal-case font-medium">· {form.interests.length} seleccionados</span>
                )}
              </p>
              {form.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.interests.map((id) => (
                    <Chip key={id} label={INTEREST_LABELS[id] ?? String(id)} removable onClick={() => toggleId('interests', id)} />
                  ))}
                </div>
              )}
              <input className={inputCls} placeholder="Buscar interés..." value={interestSearch} onChange={(e) => setInterestSearch(e.target.value)} />
              <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto pr-1">
                {filteredInterests.map(([id, label]) => (
                  <Chip key={id} label={label} selected={form.interests.includes(Number(id))} onClick={() => toggleId('interests', Number(id))} />
                ))}
              </div>
            </section>

            <Divider />

            {/* Neurodivergencias */}
            <section>
              <p className={labelCls}>Rasgos neurodivergentes</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(NEURODIVERGENCE_LABELS).map(([id, label]) => (
                  <Chip key={id} label={label} selected={form.neurodivergences.includes(Number(id))} onClick={() => toggleId('neurodivergences', Number(id))} />
                ))}
              </div>
            </section>

            <Divider />

            {/* Comunicación */}
            <section>
              <p className={labelCls}>Estilo de comunicación</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COMMUNICATION_LABELS).map(([id, label]) => (
                  <Chip key={id} label={label} selected={form.communication_style.includes(Number(id))} onClick={() => toggleId('communication_style', Number(id))} />
                ))}
              </div>
            </section>

          </div>

          <div className="px-6 py-4 flex-shrink-0 border-t border-gray-200 bg-white rounded-b-3xl flex gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onSave(form)}
              disabled={isSaving}
              className="flex-1 py-3 rounded-2xl bg-bluvi-purple text-white text-sm font-semibold shadow-lg shadow-bluvi-purple/25 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando...
                </>
              ) : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const UserProfile: React.FC<UserProfileProps> = ({ onSave }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMyProfile()
      .then((data) => { if (!cancelled) setUser(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Error al cargar el perfil'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const handleSave = async (updated: User) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const saved = await updateMyProfile(updated);
      setUser(saved);
      onSave?.(saved);
      setShowEdit(false);
    } catch (err: any) {
      setSaveError(err.message ?? 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (error) return (
    <div className="w-full max-w-5xl mx-auto p-8 text-center">
      <p className="text-red-500 font-medium mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-bluvi-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
        Reintentar
      </button>
    </div>
  );

  if (!user) return null;

  const age = Math.floor((Date.now() - new Date(user.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  const activePhotos = user.photos.filter(Boolean) as string[];
  const carouselPhotos = activePhotos.map((url, i) => ({ id: i, image: url, alt: `Foto ${i + 1} de ${user.first_name}` }));
  const completeness = Math.round(
    ([
      activePhotos.length > 0,
      user.description,
      user.interests.length > 0,
      user.neurodivergences.length > 0,
      user.communication_style.length > 0,
    ].filter(Boolean).length / 5) * 100
  );

  return (
    <>
      <article className="w-full max-w-5xl mx-auto p-4 md:p-0 animate-fade-in motion-reduce:animate-none">

        <div className="flex items-end justify-between mb-6 pl-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-bluvi-purple">
            {user.first_name} {user.last_name}
          </h1>
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bluvi-purple text-white text-sm font-semibold shadow-md shadow-bluvi-purple/25 hover:opacity-90 active:scale-95 transition-all"
          >
            <EditIcon />
            Editar perfil
          </button>
        </div>

        {saveError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
            <p className="text-sm text-red-600">{saveError}</p>
            <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600 ml-4"><XIcon /></button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div className="md:col-span-4 flex flex-col gap-6">
            <SimpleCarousel photos={carouselPhotos} />
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500">Perfil completado</p>
                <p className="text-xs font-bold text-bluvi-purple">{completeness}%</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-bluvi-purple rounded-full transition-all duration-500" style={{ width: `${completeness}%` }} />
              </div>
              {completeness < 100 && (
                <button onClick={() => setShowEdit(true)} className="text-xs text-bluvi-purple font-medium mt-2 hover:underline">
                  Completar perfil →
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-4">
            <Card>
              <ul className="flex flex-wrap gap-4 sm:gap-6 text-bluvi-purple font-semibold mb-4 text-sm border-b border-bluvi-purple/10 pb-4">
                <li className="flex items-center gap-1"><span>🎂</span>{age} años</li>
                <li className="flex items-center gap-1"><span>👤</span>{GENDER_LABELS[user.id_gender] ?? '—'}</li>
                <li className="flex items-center gap-1"><span>📍</span>{user.city}</li>
                <li className="flex items-center gap-1"><span>🌈</span>{SEXUALITY_LABELS[user.sexuality[0]] ?? '—'}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed text-lg">{user.description}</p>
            </Card>

            <Card>
              <SectionLabel emoji="🌱" label="Mis intereses" />
              <ul className="flex flex-wrap gap-2">
                {idsToLabels(user.interests, INTEREST_LABELS).map((label) => (
                  <li key={label} className="px-4 py-2 bg-gray-100 text-bluvi-purple rounded-xl text-sm font-medium">{label}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <SectionLabel emoji="🧠" label="Mente y Comunicación" />
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Rasgos</h3>
                <ul className="flex flex-wrap gap-2">
                  {idsToLabels(user.neurodivergences, NEURODIVERGENCE_LABELS).map((label) => (
                    <li key={label} className="px-4 py-2 bg-gray-100 text-bluvi-purple border border-purple-100 rounded-xl text-sm font-semibold">{label}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Comunicación</h3>
                <ul className="flex flex-wrap gap-2">
                  {idsToLabels(user.communication_style, COMMUNICATION_LABELS).map((label) => (
                    <li key={label} className="px-4 py-2 bg-gray-100 text-bluvi-purple border border-blue-100 rounded-xl text-sm font-semibold">{label}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <div className="flex justify-end mt-1">
              <button className="text-xs font-medium text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </article>

      {showEdit && (
        <EditModal
          user={user}
          onSave={handleSave}
          onClose={() => !isSaving && setShowEdit(false)}
          isSaving={isSaving}
        />
      )}
    </>
  );
};