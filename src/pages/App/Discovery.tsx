import React, { useState, useEffect } from 'react';
import { ProfileDetail } from '../../components/ProfileDetail';
import { Button } from '../../components/Button';
import { IceBreakerModal } from '../../components/IceBreakerModal';
import { DiscoveryFilter, FilterTriggerButton } from '../../components/DiscoveryFilter';
import { getExploreUsers } from '../../services/user.service';
import type { User } from '../../types/User.types';

export const Discovery: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    selectedTags: [] as string[],
    city: ''
  });

  const fetchUsers = async (filters = activeFilters) => {
    setLoading(true);
    try {
      const data = await getExploreUsers({
        search: filters.search,
        city: filters.city,
        interests: filters.selectedTags.join(',')
      });
      setUsers(data.users || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const currentUser = users[currentIndex];
  const isFinished = !loading && (currentIndex >= users.length);

  const activeFilterCount = 
    (activeFilters.search ? 1 : 0) + 
    activeFilters.selectedTags.length + 
    (activeFilters.city ? 1 : 0);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && users.length === 0) return <div className="pt-20 text-center text-bluvi-purple font-medium">Cargando perfiles afines...</div>;

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center">
        <h2 className="text-3xl font-heading font-bold text-bluvi-purple mb-4">¡No hay más perfiles!</h2>
        <Button onClick={() => fetchUsers({ search: '', selectedTags: [], city: '' })}>Reiniciar filtros</Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 pt-0 -mt-7 animate-fade-in relative">
      {showMatchModal && currentUser && (
        <IceBreakerModal user={currentUser} onSend={() => { setShowMatchModal(false); handleNext(); }} onCancel={() => setShowMatchModal(false)} />
      )}

      {/* ✅ USAMOS EL NUEVO FILTRO ZEN */}
      <DiscoveryFilter
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => { setActiveFilters(f); setShowFilters(false); fetchUsers(f); }}
        initialFilters={activeFilters}
      />

      <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-20">
        <FilterTriggerButton activeCount={activeFilterCount} onClick={() => setShowFilters(true)} />
      </div>

      {currentUser && (
        <div key={currentUser.id_user} className="px-4 md:px-0 relative z-0">
          <ProfileDetail
            user={{
            ...currentUser,
            photos: currentUser.photos && currentUser.photos.length > 0 ? currentUser.photos : ['/assets/images/default-avatar.png'], 
            }}
            onLike={() => setShowMatchModal(true)}
            onPass={handleNext}
            onClose={() => {}}
          />
        </div>
      )}
    </div>
  );
};