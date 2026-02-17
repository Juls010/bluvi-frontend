import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '../../components/Button';
import { AnimatedStep } from '../../components/AnimatedStep';

export const EmailVerificationStep = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value !== '' && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <AnimatedStep>
            <div className="h-[100dvh] w-full flex flex-col items-center justify-between py-16 px-6 bg-transparent fixed inset-0 animate-fade-in">
                
                <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
                    <header className="space-y-4">
                        <div className="bg-white/40 p-4 rounded-full w-fit mx-auto backdrop-blur-sm border border-white/20 shadow-sm">
                            <Mail className="text-[#3f4a9b]" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-[#2d3a7d]">Verifica tu correo</h1>
                        <div className="text-[#5b6bb1] font-medium max-w-sm mx-auto">
                            <p>Te hemos enviado un código de 4 dígitos para proteger tu cuenta.</p>
                        </div>
                    </header>

                    {/* Inputs del Código */}
                    <div className="flex gap-4">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-16 text-center text-2xl font-bold rounded-2xl bg-white/50 border border-white/30 shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#3f4a9b]/30 text-[#2d3a7d] transition-all"
                            />
                        ))}
                    </div>

                    <button className="flex items-center gap-2 text-[#5b6bb1] hover:text-[#3f4a9b] text-sm font-semibold transition-colors">
                        <RefreshCw size={16} />
                        Reenviar código
                    </button>
                </div>

                <div className="w-full max-w-sm">
                    <Button 
                        onClick={() => navigate('/register/description')}
                        disabled={code.some(d => d === '')}
                        className="w-full py-3 bg-[#3f4a9b] text-white rounded-lg shadow-md font-semibold disabled:opacity-50"
                    >
                        Verificar y continuar
                    </Button>
                </div>
            </div>
        </AnimatedStep>
    );
};