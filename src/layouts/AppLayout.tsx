import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SettingsButton } from '../components/SettingsButton';
import { BluAssistant } from '../components/BluAssistant';

export const AppLayout: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-bluvi-gradient flex flex-col font-sans relative overflow-hidden">

      <div className="fixed top-0 left-0 w-full z-50 p-1 flex justify-center pointer-events-none">
          
          <div className="w-full max-w-[95%] pointer-events-auto">
              <Navbar />
          </div>

          <div className="absolute top-3 right-8 pointer-events-auto">
              <SettingsButton onClick={() => console.log("Ajustes")} />
          </div>

      </div>

      <div className="flex-1 w-full flex flex-col items-center pt-32 pb-10 overflow-y-auto">
        <Outlet />
      </div>

      <div className="relative z-10 w-full">
        <Footer />
      </div>
      
      <BluAssistant />

    </main>
  );
};