import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import logo from '../../assets/logo.svg';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useAuth } from '../../context/AuthContext';


export const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuth(); // Primero cogemos todo el objeto
    const authLogin = auth.login; // Luego sacamos la función con un nombre distinto

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                const success = await authLogin({ email, password });

                if (success) {
                    navigate('/app/home');
                } else {
                    setError('Credenciales incorrectas');
                }
            } catch (err) {
                console.error('Error en Login.tsx', err);
                setError('Error de conexión');
            }
    };

    return (
        <AnimatedStep>
                <div className="w-full flex justify-start px-8">
                    <button 
                        onClick={() => navigate('/welcome')}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors text-bluvi-purple cursor-pointer"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft size={28} />
                    </button>
                </div>

                <div className="flex flex-col items-center w-full max-w-md px-2">
                    <img src={logo} alt="Bluvi" className="w-60 mb-6 drop-shadow-sm" />

                    <div className="w-full space-y-8 bg-white/20 backdrop-blur-md p-10 rounded-[3rem] shadow-xl border border-white/30">
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-bluvi-purple">¡Hola de nuevo!</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    id="email"      
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full bg-white/50 border border-transparent focus:border-bluvi-purple focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full bg-white/50 border border-transparent focus:border-bluvi-purple focus:outline-none transition-all"
                                    required
                                />

                                <div className="flex justify-end px-4 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-xs font-semibold text-bluvi-purple/70 hover:text-bluvi-purple transition-colors cursor-pointer"
                                    >
                                        No recuerdo mi contraseña
                                    </button>
                                </div>
                            </div>

                            
                            {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}

                            <Button type="submit" className="w-full py-4 shadow-lg">
                                Entrar
                            </Button>
                        </form>

                        <p className="text-center text-gray-600 text-sm">
                            ¿No tienes cuenta?{' '}
                            <span 
                                onClick={() => navigate('/register/name')} 
                                className="text-bluvi-purple font-bold cursor-pointer hover:underline"
                            >
                                Regístrate
                            </span>
                        </p>
                    </div>
                </div>
            <div className="h-12" />  
        </AnimatedStep>
    );
};
