import React, { useState } from 'react';
import { MOCK_USERS } from '../../data/mockUsers';
import { ProfileDetail } from '../../components/ProfileDetail';
import { Button } from '../../components/Button';
import { IceBreakerModal } from '../../components/IceBreakerModal';
import { FilterBottomsheet, FilterTriggerButton } from '../../components/FilterBottomsheet';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  cercaniaKm: number;
  intereses: string[];
  comunicacion: string[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Discovery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    cercaniaKm: 50,
    intereses: [],
    comunicacion: [],
  });

  const currentUser = MOCK_USERS[currentIndex];
  const isFinished = currentIndex >= MOCK_USERS.length;

  // Cuenta cuántos filtros están activos para mostrar en el badge
  const activeFilterCount =
    (activeFilters.cercaniaKm < 50 ? 1 : 0) +
    activeFilters.intereses.length +
    activeFilters.comunicacion.length;

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = () => {
    console.log('Like a:', currentUser.name);
    setTimeout(() => setShowMatchModal(true), 400);
  };

  const handleSendIceBreaker = (message: string) => {
    console.log(`Mensaje enviado a ${currentUser.name}:`, message);
    setShowMatchModal(false);
    handleNext();
  };

  const handleCancelIceBreaker = () => {
    setShowMatchModal(false);
    handleNext();
  };

  const handlePass = () => handleNext();
  const handleRestart = () => setCurrentIndex(0);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    // Aquí también puedes filtrar MOCK_USERS si quieres
    console.log('Filtros aplicados:', filters);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center animate-fade-in flex flex-col items-center">
        <h2 className="text-3xl font-heading font-bold text-bluvi-purple mb-4">
          ¡Vaya! No hay más perfiles.
        </h2>
        <Button onClick={handleRestart}>Volver a empezar</Button>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 pt-0 -mt-7 animate-fade-in relative">

      {/* ── Modales ── */}
      {showMatchModal && (
        <IceBreakerModal
          user={currentUser}
          onSend={handleSendIceBreaker}
          onCancel={handleCancelIceBreaker}
        />
      )}

      <FilterBottomsheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />

      {/* ── Barra de filtros: ahora un único botón ── */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-0 mb-6 relative z-20">
        <FilterTriggerButton
          activeCount={activeFilterCount}
          onClick={() => setShowFilters(true)}
        />
      </div>

      {/* ── Perfil actual ── */}
      <div key={currentUser.id} className="px-4 md:px-0 relative z-0">
        <ProfileDetail
          user={currentUser}
          onClose={() => {}}
          onLike={handleLike}
          onPass={handlePass}
        />
      </div>

    </div>
  );
};