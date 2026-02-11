import React, { useState } from 'react';
import { MOCK_USERS } from '../../data/mockUsers'; 
import { ProfileDetail } from '../../components/ProfileDetail';
import { Button } from '../../components/Button';
import { IceBreakerModal } from '../../components/IceBreakerModal';


const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor" 
        className={`w-5 h-5 transition-transform duration-600 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
    );

export const Discovery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [showMatchModal, setShowMatchModal] = useState(false);

    const currentUser = MOCK_USERS[currentIndex];
    const isFinished = currentIndex >= MOCK_USERS.length;

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveDropdown(null); 
    };

    const handleLike = () => {
        console.log("Like a:", currentUser.name);
        setTimeout(() => {
            setShowMatchModal(true);;
        }, 400);
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

    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
        setActiveDropdown(null);
        } else {
        setActiveDropdown(name);
        }
    };

    const btnBaseClass = "px-5 py-2.5 rounded-xl text-sm border transition-all shadow-sm flex items-center gap-2 whitespace-nowrap font-medium";

    const btnInactiveClass = "bg-white/50 backdrop-blur-sm text-bluvi-purple border-bluvi-purple/20 hover:bg-bluvi-purple/10 hover:border-bluvi-purple/40";

    const btnActiveClass = "bg-bluvi-purple text-white border-bluvi-purple shadow-md ring-2 ring-bluvi-purple/20";

    if (isFinished) {
        return (
            <div className="w-full max-w-2xl mx-auto px-6 pt-20 text-center animate-fade-in flex flex-col items-center">
                <h2 className="text-3xl font-heading font-bold text-bluvi-purple mb-4">¡Vaya! No hay más perfiles.</h2>
                <Button onClick={handleRestart}>Volver a empezar</Button>
            </div>
        );
    }

    return (
        <div className="w-full pb-24 pt-0 -mt-7 animate-fade-in relative">
        
        {showMatchModal && (
            <IceBreakerModal 
                user={currentUser}
                onSend={handleSendIceBreaker}
                onCancel={handleCancelIceBreaker}
            />
        )}

        {activeDropdown && (
            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
        )}

        <div className="w-full max-w-5xl mx-auto px-4 md:px-0 mb-6 relative z-20">
            <div className="flex gap-3 justify-start items-start">

                <button className={`${btnBaseClass} ${btnInactiveClass}`}>
                    <span>Cercanía</span>
                </button>

                <div className="relative">
                    <button 
                        onClick={() => toggleDropdown('rasgos')}
                        className={`${btnBaseClass} ${activeDropdown === 'rasgos' ? btnActiveClass : btnInactiveClass}`}
                    >
                        <span>Rasgos divergentes</span>
                        <ChevronIcon isOpen={activeDropdown === 'rasgos'} />
                    </button>

                    {activeDropdown === 'rasgos' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-bluvi-purple/10 p-2 animate-fade-in-down z-50">
                            <div className="flex flex-col gap-1">
                                {['Autismo', 'TDAH', 'Ansiedad Social', 'Altas Capacidades', 'Bipolaridad', 'Tourette'].map(rasgo => (
                                    <button key={rasgo} className="text-left px-4 py-2 hover:bg-bluvi-purple/5 rounded-xl text-sm text-gray-600 hover:text-bluvi-purple transition-colors font-medium">
                                        {rasgo}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => toggleDropdown('intereses')}
                        className={`${btnBaseClass} ${activeDropdown === 'intereses' ? btnActiveClass : btnInactiveClass}`}
                    >
                        <span>Intereses</span>
                        <ChevronIcon isOpen={activeDropdown === 'intereses'} />
                    </button>

                    {activeDropdown === 'intereses' && (
                        <div className="absolute top-full left-0 mt-2 w-35 bg-white rounded-2xl shadow-xl border border-bluvi-purple/10 p-2 animate-fade-in-down z-50">
                            <div className="flex flex-col gap-1">
                                {['Arte', 'Tecnología', 'Naturaleza', 'Videojuegos', 'Lectura', 'Música', 'Anime'].map(interes => (
                                    <button key={interes} className="text-left px-4 py-2 hover:bg-bluvi-purple/5 rounded-xl text-sm text-gray-600 hover:text-bluvi-purple transition-colors font-medium">
                                        {interes}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>

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