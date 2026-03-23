import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import logo from '../../assets/logo.svg';
import { AnimatedStep } from '../../components/AnimatedStep';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // CAMBIO: Guardamos los dos tokens que genera el backend 
                // Nota: Asegúrate de que el backend los envíe como 'access' y 'refresh'
                localStorage.setItem('accessToken', data.access); 
                localStorage.setItem('refreshToken', data.refresh);
                
                // Mantenemos los datos del usuario para el resto de la app
                localStorage.setItem('user', JSON.stringify(data.user));
                
                navigate('/app/home'); 

            } else {
                // Manejo de errores que ya tenías...
                if (data.message === "Credenciales incorrectas") {
                    setError('El correo electrónico o la contraseña no coinciden.');
                } else {
                    setError(data.message);
                }
            }
        } catch (err) {
            setError('No hemos podido conectar con el servidor.');
        }
    };

    return (
        <AnimatedStep>
                <div className="w-full flex justify-start px-8">
                    <button 
                        onClick={() => navigate('/landing')}
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