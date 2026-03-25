import React, { useState, useEffect } from 'react';
import { SimpleCarousel } from '../../components/SimpleCarousel';
import { EditInterestsModal } from '../../components/modals/EditInterestsModal';
import { getMyProfile, updateMyProfile } from '../../services/user.service';
import {
  type User,
  GENDER_LABELS,
  SEXUALITY_LABELS
} from '../../types/User.types';

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

// ─── Main component ───────────────────────────────────────────────────────────

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showInterestsModal, setShowInterestsModal] = useState(false);

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

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updatedUser: User) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const saved = await updateMyProfile(updatedUser);
      setUser(saved); // Actualizamos la vista con lo que devuelve el Back
      setShowInterestsModal(false);
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

  const carouselPhotos = (user.photos || []).filter(p => typeof p === 'string');
  
  const interestNames = (user as any).interest_names || [];

  const interestIds = user.interests || (user as any).id_interests || [];
  const features = (user as any).neurodivergence_names || [];
  const communication = (user as any).communication_names || [];

  const age = user.birth_date 
    ? Math.floor((Date.now() - new Date(user.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) 
    : '—';

  const completeness = Math.round(
    ([
      carouselPhotos.length > 0,
      !!user.description,
      interestNames.length > 0,
      features.length > 0,
      communication.length > 0,
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
            <SimpleCarousel photos={carouselPhotos} firstName={user.first_name} />
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
                <li className="flex items-center gap-1"><span>🌈</span>{user.sexuality && user.sexuality.length > 0 
                  ? (SEXUALITY_LABELS[user.sexuality[0]] ?? 'Sin especificar') 
                  : 'Sin especificar'}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed text-lg">{user.description}</p>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <SectionLabel emoji="🌱" label="Mis intereses" />
                <button 
                  onClick={() => setShowInterestsModal(true)} // 👈 Abrimos el modal
                  className="text-xs font-bold text-bluvi-purple hover:underline"
                >
                  EDITAR
                </button>
              </div>
              <ul className="flex flex-wrap gap-2">
                {interestNames.map((name: string) => (
                  <li key={name} className="px-4 py-2 bg-gray-100 text-bluvi-purple rounded-xl text-sm font-medium">{name}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <SectionLabel emoji="🧠" label="Mente y Comunicación" />
              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Rasgos</h3>
                <ul className="flex flex-wrap gap-2">
                  {features.map((name: string) => (
                    <li key={name} className="px-4 py-2 bg-gray-100 text-bluvi-purple border border-purple-100 rounded-xl text-sm font-semibold">{name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Comunicación</h3>
                <ul className="flex flex-wrap gap-2">
                  {communication.map((name: string) => (
                    <li key={name} className="px-4 py-2 bg-gray-100 text-bluvi-purple border border-blue-100 rounded-xl text-sm font-semibold">{name}</li>
                  ))}
                </ul>
              </div>
            </Card>

          </div>
        </div>
      </article>

        {showInterestsModal && (
          <EditInterestsModal 
            currentInterests={interestIds as unknown as number[]} 
            isSaving={isSaving}
            onClose={() => setShowInterestsModal(false)}
            onSave={async (newIds) => {
              const updatedData = { 
                ...user, 
                interests: newIds 
              } as any; 

              await handleSave(updatedData);
              setShowInterestsModal(false);
            }}
        />
      )}
    </>
  );
};