import { Outlet } from 'react-router-dom';
import { SettingsButton } from '../components/SettingsButton';

export const WelcomeLayout = () => {
    return (
        <main className="relative min-h-screen w-full bg-bluvi-gradient flex flex-col overflow-hidden">
        
        <header className="absolute top-0 right-0 p-6 md:p-8 z-50">
            <SettingsButton onClick={() => console.log("Abrir ajustes")} />
        </header>

        <div className="flex-grow flex flex-col items-center w-full">
            <Outlet />
        </div>
        
        </main>
    );
};