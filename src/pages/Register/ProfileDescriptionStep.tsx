import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';


export const ProfileDescriptionStep = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const MAX_CHARS = 200;

    return (
        <div className="h-screen w-full flex flex-col items-center justify-between py-16 px-6 bg-transparent fixed inset-0">
            
            <div className="max-w-2xl w-full flex flex-col items-center text-start space-y-8 animate-fade-in">
                <header className="space-y-4">
                    <h1 className="text-3xl font-bold text-[#2d3a7d]">Cuéntanos más sobre ti</h1>
                    <div className="text-[#5b6bb1] font-medium">
                        <p>Respira y tómate tu tiempo ...</p>
                        <p className="text-m ">Es importante que cuentes algo sobre ti para que los demás te conozcan</p>
                    </div>
                </header>

                <div className="w-full max-w-md relative mt-10">
                    <span className="absolute -top-6 right-0 text-xs text-[#5b6bb1] opacity-80">
                        Máx {MAX_CHARS}
                    </span>

                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
                        className="w-full h-64 p-6 rounded-3xl bg-white/40 border border-white/20 shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#3f4a9b]/20 text-gray-700 resize-none placeholder:text-gray-400/80 transition-all"
                        placeholder="Escribe aquí..."
                    />
                </div>
            </div>

            <div className="w-full max-w-sm">
                <Button 
                    onClick={() => navigate('/register/safety-tips')}
                    disabled={description.length === 0}
                    className="w-full py-3 bg-[#3f4a9b] text-white rounded-lg shadow-md font-semibold"
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};