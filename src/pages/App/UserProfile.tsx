import React, { useState, useEffect } from 'react';
import { SimpleCarousel } from '../../components/SimpleCarousel';
import { EditInterestsModal } from '../../components/modals/EditInterestsModal';
import { EditMindModal } from '../../components/modals/EditMindModal';
import { EditPhotosModal } from '../../components/modals/EditPhotosModal';
import { EditBasicInfoModal } from '../../components/modals/EditBasicInfoModal';
import FaceVerification from '../../components/bioVerification';
import { getMyProfile, markFaceVerification, updateMyProfile, type UserProfileUpdatePayload } from '../../services/user.service';
import { X, Camera, Pencil, MapPin, Cake, User as UserIcon, Heart, Sprout, Brain, Settings, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type User, GENDER_LABELS,SEXUALITY_LABELS } from '../../types/User.types';
import { VerifiedIdentityIcon } from '../../components/VerifiedIdentityIcon';

type ProfileUser = User;

const buildProfileUpdate = (
  base: ProfileUser,
  overrides: UserProfileUpdatePayload | Partial<User>
): UserProfileUpdatePayload => {
  return { ...base, ...overrides } as UserProfileUpdatePayload;
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-app-surface backdrop-blur-md p-6 rounded-3xl border border-app-soft shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <h2 className="text-[12px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
    <span className="flex items-center gap-1.5">
      <span className="text-app-accent dark:text-app-orange">{icon}</span>
      {label}
    </span>
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

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showMindModal, setShowMindModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
  const handleFaceVerified = async () => {
    setSaveError(null);
    try {
      const saved = await markFaceVerification();
      setUser(saved);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'No se pudo guardar la verificación facial');
      throw err;
    }
  };

  const handleSave = async (updatedUser: UserProfileUpdatePayload) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const saved = await updateMyProfile(updatedUser);
      setUser(saved);
      setShowInterestsModal(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar los cambios');
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

  const interestNames = user.interest_names || [];
  const interestIds = user.id_interests || [];

  const features = user.neurodivergence_names || [];
  const featureIds = user.id_neurodivergences || [];

  const communication = user.communication_names || [];
  const communicationIds = user.id_communication_style || [];



  const age = user.birth_date
    ? Math.floor((Date.now() - new Date(user.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : 'â€”';

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

        <div className="flex items-center justify-between mb-8 pl-2">
            <div className="flex items-center gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-app-primary">
                  {user.first_name} {user.last_name}
                  </h1>
                  {user.is_face_verified && (
                    <VerifiedIdentityIcon />
                  )}
                </div>
                <button
                    onClick={() => setShowInfoModal(true)}
                    className="p-2 hover:bg-app-surface-soft rounded-full transition-all text-app-muted hover:text-bluvi-purple"
                    title="Editar informaciÃ³n bÃ¡sica"
                >
                    <Pencil className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-2">
              {!user.is_face_verified && (
                <button
                  onClick={() => setShowVerificationModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-bluvi-purple text-white rounded-2xl text-sm font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                  title="Verificar identidad"
                >
                  <ShieldCheck className="w-4.5 h-4.5" aria-hidden="true" />
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Verificar</span>
                </button>
              )}

                <button
                    onClick={() => navigate('/app/settings')}
                    className="flex items-center gap-2 px-3.5 py-2 bg-app-surface-soft hover:bg-app-surface-strong border border-app-soft rounded-2xl text-app-secondary transition-all hover:scale-105 active:scale-95 group"
                    title="Ajustes de cuenta"
                >
                    <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-500" />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Ajustes</span>
                </button>
            </div>
        </div>

        {saveError && (
          <div className="mb-4 px-4 py-3 bg-red-50/50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
            <p className="text-sm text-red-600 font-medium">{saveError}</p>

            <button
              onClick={() => setSaveError(null)}
              className="p-1.5 hover:bg-red-100 rounded-full transition-colors text-red-400 hover:text-red-600"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div className="md:col-span-4 flex flex-col gap-6">

            <div className="relative group rounded-3xl overflow-hidden shadow-sm">

              <SimpleCarousel photos={carouselPhotos} firstName={user.first_name} />

              <button
                onClick={() => setShowPhotosModal(true)}
                className="absolute bottom-4 right-4 p-3 bg-app-surface-strong backdrop-blur-md text-app-accent rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all border border-app-soft z-10"
                title="Gestionar fotos"
              >
                <Camera className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="bg-app-surface backdrop-blur-md p-4 rounded-2xl border border-app-soft shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-app-secondary">Perfil completado</p>
                <p className="text-xs font-bold text-app-accent-strong">{completeness}%</p>
              </div>
              <div className="w-full h-1.5 bg-app-surface-soft rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%`, backgroundImage: 'var(--app-accent-gradient)' }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-4">
            <Card>
              <ul className="flex flex-wrap gap-4 sm:gap-6 text-app-primary font-semibold mb-4 text-sm border-b border-app-soft pb-4">
                <li className="flex items-center gap-2">
                  <Cake className="w-4 h-4 text-app-accent dark:text-app-orange" /> {age} años
                </li>
                <li className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-app-accent dark:text-app-orange" /> {GENDER_LABELS[user.id_gender] ?? 'â€”'}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-app-accent dark:text-app-orange" /> {user.city}
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-app-accent dark:text-app-orange" />
                  {user.sexuality && user.sexuality.length > 0
                    ? (SEXUALITY_LABELS[user.sexuality[0]] ?? 'Sin especificar')
                    : 'Sin especificar'}
                </li>
              </ul>
              <p className="text-app-secondary leading-relaxed text-lg">{user.description}</p>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-6">
                <SectionLabel icon={<Sprout className="w-4.5 h-4.5" />} label="Mis intereses" />
                <button
                  onClick={() => setShowInterestsModal(true)}
                  className="text-xs font-semibold text-app-accent-strong hover:text-app-accent hover:underline underline-offset-2 dark:text-transparent dark:bg-clip-text dark:bg-app-accent-gradient"
                >
                  Editar
                </button>
              </div>
              <ul className="flex flex-wrap gap-2">
                {interestNames.map((name: string) => (
                  <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                    {name}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-6">
                <SectionLabel icon={<Brain className="w-4.5 h-4.5" />} label="Mente y Comunicación" />
                <button
                  onClick={() => setShowMindModal(true)}
                  className="text-xs font-semibold text-app-accent-strong hover:text-app-accent hover:underline underline-offset-2 outline-none dark:text-transparent dark:bg-clip-text dark:bg-app-accent-gradient"
                >
                  Editar
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                    Rasgos distintivos
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {features.length > 0 ? (
                      features.map((name: string) => (
                        <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                          {name}
                        </li>
                      ))
                    ) : (
                      <li className="text-app-muted italic text-sm">Sin rasgos definidos</li>
                    )}
                  </ul>
                </div>

                <div className="pt-6 border-t border-app-soft">
                  <h3 className="text-[10px] font-black text-app-secondary/80 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                    Estilo comunicativo
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {communication.length > 0 ? (
                      communication.map((name: string) => (
                        <li key={name} className="px-3.5 py-1.5 bg-app-accent/10 text-app-accent-strong border border-app-accent/20 rounded-xl text-[13px] font-bold">
                          {name}
                        </li>
                      ))
                    ) : (
                      <li className="text-app-muted italic text-sm">Sin estilo definido</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </article>

        {showInterestsModal && (
          <EditInterestsModal
            currentInterests={interestIds}
            isSaving={isSaving}
            onClose={() => setShowInterestsModal(false)}
            onSave={async (newIds: number[]) => {
              await handleSave(buildProfileUpdate(user, { interests: newIds }));
              setShowInterestsModal(false);
            }}
        />
      )}

      {showMindModal && (
        <EditMindModal
          currentFeatures={featureIds}
          currentCommunication={communicationIds}
          isSaving={isSaving}
          onClose={() => setShowMindModal(false)}
          onSave={async (newFeatures: number[], newComm: number[]) => {
            await handleSave(buildProfileUpdate(user, { features: newFeatures, communication_style: newComm }));
            setShowMindModal(false);
          }}
        />
      )}

      {showPhotosModal && (
        <EditPhotosModal
          currentPhotos={carouselPhotos}
          isSaving={isSaving}
          onClose={() => setShowPhotosModal(false)}
          onSave={async (newPhotos: string[]) => {
            await handleSave(buildProfileUpdate(user, { photos: newPhotos }));
            setShowPhotosModal(false);
          }}
        />
      )}

      {showInfoModal && (
        <EditBasicInfoModal
          user={user}
          isSaving={isSaving}
          onClose={() => setShowInfoModal(false)}
          onSave={async (newData) => {
            await handleSave(buildProfileUpdate(user, newData));
            setShowInfoModal(false);
          }}
        />
      )}
      {showVerificationModal && (
        <FaceVerification
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onVerified={handleFaceVerified}
        />
      )}
    </>
  );
};
