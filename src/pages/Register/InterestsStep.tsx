import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

const INTERESTS = [
    "Comida", "Historia", "Anime", "Salud", "Naturaleza", "Feminismo", 
    "Deporte", "Playa", "Magia", "Veganismo", "Música", "Mascotas",
    "LGTBIQ+", "Matemáticas", "Poliamor", "Diseño", "Moda", "Trenes",
    "Ciencia ficción", "Fotografía", "Videojuegos", "Humor", "Viajes", "Montaña",
    "Muñecos", "Cosplay", "Religión", "Lectura", "Comics", "Tecnología", "Picnic",
    "Puzzles", "Paseos", "Maquetas"
];

export const InterestsStep = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<string[]>([]);
    const MIN_SELECTION = 2;

    const handleNext = () => {
        if (selected.length >= MIN_SELECTION) {
            navigate('/register/safety-tips');
        }
    };

    const toggleInterest = (interest: string) => {
        setSelected(prev => 
            prev.includes(interest) 
                ? prev.filter(i => i !== interest) 
                : [...prev, interest]
        );
    };

    return (
        <div className="h-screen w-full flex flex-col items-center py-10 px-6 overflow-hidden fixed inset-0">
            <div className="max-w-2xl w-full flex flex-col h-full space-y-8 text-center animate-fade-in">
                
                <header className="space-y-2">
                    <h1 className="text-4xl font-bold text-bluvi-purple">Elige tus intereses</h1>
                    <p className="text-gray-600 font-medium">Selecciona al menos dos intereses</p>
                </header>

                <div className="flex-grow overflow-y-auto no-scrollbar py-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {INTERESTS.map((interest) => {
                            const isSelected = selected.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    aria-pressed={isSelected}
                                    className={`
                                        px-6 py-2.5 rounded-full border-2 font-medium transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-bluvi-purple border-bluvi-purple text-white shadow-lg scale-105' 
                                            : 'bg-white/40 border-white/60 text-bluvi-purple hover:bg-white/60'}
                                    `}
                                >
                                    {interest}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-6 pb-10">
                    <Button
                        onClick={handleNext}
                        disabled={selected.length < MIN_SELECTION}
                        className={`w-full max-w-sm py-4 rounded-full text-lg shadow-xl
                        ${selected.length >= MIN_SELECTION ? 'bg-bluvi-purple text-white' : 'bg-gray-200 text-gray-400 opacity-50'}`}
                    >
                        Siguiente {selected.length > 0 && `${selected.length}/5`}
                    </Button>
                </div>

            </div>
        </div>
    );
};