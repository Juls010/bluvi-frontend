import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileDetail } from '../../components/ProfileDetail';
import { Button } from '../../components/Button';
import { IceBreakerModal } from '../../components/IceBreakerModal';
import { DiscoveryFilter, FilterTriggerButton, type FilterData } from '../../components/DiscoveryFilter';
import { getExploreUsers, markDiscoverySeen } from '../../services/user.service';
import { sendMatchRequest } from '../../services/match.service';
import { authService } from '../../services/auth.service';
import type { User } from '../../types/User.types';

export const Discovery: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sendingLike, setSendingLike] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [includeSeenProfiles, setIncludeSeenProfiles] = useState(false);
  const [catalogOptions, setCatalogOptions] = useState({
    interests: [] as string[],
    communicationStyles: [] as string[],
    neurodivergences: [] as string[],
  });
  
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    selectedTags: [] as string[],
    city: '',
    distance: 0,
    communicationStyle: [] as string[],
    sensoryPref: [] as string[]
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const metadata = await authService.getMetadata();
        const data = metadata?.data || {};

        setCatalogOptions({
          interests: Array.isArray(data.interests) ? data.interests.map((item: { name: string }) => item.name).filter(Boolean) : [],
          communicationStyles: Array.isArray(data.communicationStyles) ? data.communicationStyles.map((item: { name: string }) => item.name).filter(Boolean) : [],
          neurodivergences: Array.isArray(data.neurodivergences) ? data.neurodivergences.map((item: { name: string }) => item.name).filter(Boolean) : [],
        });
      } catch (error) {
        console.error('Error cargando metadata de filtros:', error);
      }
    };

    loadMetadata();
  }, []);

  const exploreParams = useMemo(() => ({
    city: activeFilters.city,
    distance: activeFilters.distance > 0 ? String(activeFilters.distance) : undefined,
    interests: activeFilters.selectedTags.join(','),
    communicationStyle: activeFilters.communicationStyle.join(','),
    sensory: activeFilters.sensoryPref.join(','),
    excludeSeen: includeSeenProfiles ? 'false' : 'true',
  }), [activeFilters, includeSeenProfiles]);

  const filtersKey = useMemo(() => JSON.stringify(exploreParams), [exploreParams]);

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['explore-users', exploreParams],
    queryFn: ({ pageParam }) => getExploreUsers({ ...exploreParams, cursor: pageParam ?? undefined, limit: 20 }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const users: User[] = data?.pages.flatMap((page) => page.users || []) || [];

  useEffect(() => {
    setCurrentIndex(0);
  }, [filtersKey]);

  const currentUser = users[currentIndex];
  const isFinished = !isLoading && !isFetching && (currentIndex >= users.length);

  const activeFilterCount = 
    activeFilters.selectedTags.length + 
    (activeFilters.city ? 1 : 0) +
    (activeFilters.distance > 0 ? 1 : 0) +
    activeFilters.communicationStyle.length +
    activeFilters.sensoryPref.length;

  const activeFilterChips = [
    ...(activeFilters.city ? [`Ciudad: ${activeFilters.city}`] : []),
    ...(activeFilters.distance > 0 ? [`Radio: ${activeFilters.distance}km`] : []),
    ...activeFilters.selectedTags,
    ...activeFilters.communicationStyle,
    ...activeFilters.sensoryPref,
  ];

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    if (hasNextPage && !isFetchingNextPage && users.length - nextIndex <= 3) {
      fetchNextPage();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePass = async () => {
    if (!currentUser) return;

    const passedUser = currentUser;
    const previousIndex = currentIndex;

    handleNext();

    try {
      await markDiscoverySeen(passedUser.id_user, 'passed');
      await queryClient.invalidateQueries({ queryKey: ['explore-users', exploreParams] });
    } catch (error) {
      console.error('Error marcando perfil como pasado:', error);
      setCurrentIndex(previousIndex);
      alert('No se pudo guardar el descarte. Reintentamos en un momento.');
    }
  };

  const handleSendIcebreaker = async (message: string) => {
    if (!currentUser || sendingLike) return;

    try {
      setSendingLike(true);
      await sendMatchRequest(currentUser.id_user, message);
      await markDiscoverySeen(currentUser.id_user, 'liked');
      await queryClient.invalidateQueries({ queryKey: ['explore-users'] });
      setShowMatchModal(false);
      handleNext();
    } catch (error) {
      console.error('Error enviando icebreaker:', error);
      alert('No se pudo enviar el icebreaker. Inténtalo de nuevo.');
    } finally {
      setSendingLike(false);
    }
  };

  if (isLoading && users.length === 0) return <div className="pt-20 text-center text-app-primary font-medium">Cargando perfiles afines...</div>;

  if (isFinished && users.length === 0 && !includeSeenProfiles) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center">
        <h2 className="text-3xl font-heading font-bold text-app-primary mb-4">No hay perfiles nuevos ahora</h2>
        <p className="text-app-secondary mb-6">Puedes volver a explorar perfiles ya vistos mientras llegan personas nuevas.</p>
        <Button onClick={() => { setIncludeSeenProfiles(true); setCurrentIndex(0); }}>Mostrar perfiles vistos</Button>
      </div>
    );
  }

  if (!currentUser && hasNextPage) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-app-primary mb-4">Buscando más perfiles...</h2>
        <Button onClick={() => fetchNextPage()}>{isFetchingNextPage ? 'Cargando...' : 'Cargar más'}</Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center">
        <h2 className="text-3xl font-heading font-bold text-app-primary mb-4">¡No hay más perfiles!</h2>
        <Button onClick={() => {
          setIncludeSeenProfiles(false);
          setActiveFilters({ selectedTags: [], city: '', distance: 0, communicationStyle: [], sensoryPref: [] });
        }}>Reiniciar filtros</Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 pt-2 animate-fade-in motion-reduce:animate-none relative text-app-primary">
      {showMatchModal && currentUser && (
        <IceBreakerModal user={currentUser} onSend={handleSendIcebreaker} onCancel={() => setShowMatchModal(false)} />
      )}

      {/* ✅ USAMOS EL NUEVO FILTRO ZEN */}
      <DiscoveryFilter
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => { setActiveFilters(f); setShowFilters(false); }}
        initialFilters={activeFilters}
        interestsOptions={catalogOptions.interests}
        communicationOptions={catalogOptions.communicationStyles}
        sensoryOptions={catalogOptions.neurodivergences}
      />

      <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-20">
        <FilterTriggerButton activeCount={activeFilterCount} onClick={() => setShowFilters(true)} />
        {activeFilterChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" aria-live="polite" aria-label="Filtros activos">
            {activeFilterChips.slice(0, 8).map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-app-surface text-app-primary border border-app-soft"
              >
                {chip}
              </span>
            ))}
            {activeFilterChips.length > 8 && (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-app-surface-soft text-app-secondary border border-app-soft">
                +{activeFilterChips.length - 8}
              </span>
            )}
          </div>
        )}
      </div>

      {currentUser && (
        <div key={currentUser.id_user} className="px-4 md:px-0 relative z-0">
          <ProfileDetail
            user={{
            ...currentUser,
            photos: currentUser.photos && currentUser.photos.length > 0 ? currentUser.photos : ['/assets/images/default-avatar.png'], 
            }}
            onLike={() => setShowMatchModal(true)}
            onPass={handlePass}
            onClose={() => {}}
          />
        </div>
      )}
    </div>
  );
};
