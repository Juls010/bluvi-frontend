import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SettingsButton } from '../components/SettingsButton';
import { useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react'; 

export const RegisterLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const steps = [
    '/register/name',
    '/register/age',
    '/register/gender',
    '/register/sexuality',
    '/register/neurodivergence',
    '/register/communication',
    '/register/email',
    '/register/photos',
    '/register/location',
    '/register/interests',
    '/register/description',
    '/register/safety-tips'
];

    const currentStepIndex = steps.indexOf(location.pathname);
    const progressLevel = currentStepIndex !== -1 ? currentStepIndex + 1 : 0;

    return (
        <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col items-center font-sans overflow-hidden relative">
            {progressLevel > 0 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white/30 z-50">
                    <div 
                        className="h-full bg-[#3f4a9b] transition-all duration-700 ease-out"
                        style={{ width: `${(progressLevel / steps.length) * 100}%` }}
                    />
                </div>
            )}

            <div className="w-full flex justify-between p-8 items-center z-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 text-[#3f4a9b]/90 hover:text-[#3f4a9b] hover:bg-white/40 rounded-full transition-all cursor-pointer group"
                    aria-label="Volver atrás"
                >
                    <ChevronLeft size={28} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <SettingsButton onClick={() => console.log("Ajustes")} />
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-center -mt-20">
                <Outlet /> 
            </div>
        </main>
    );
};