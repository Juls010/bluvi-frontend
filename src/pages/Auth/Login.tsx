import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '../../components/Button';
import logo from '../../assets/logo.svg';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../../components/InputField';


export const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuth(); 
    const authLogin = auth.login; 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (isLoading) return;

            setIsLoading(true);
            setError('');

            try {
                const sanitizedEmail = email.trim();
                const success = await authLogin({ email: sanitizedEmail, password });

                if (success) {
                    if (rememberMe) {
                        localStorage.setItem('rememberedEmail', sanitizedEmail);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }
                    navigate('/app/home');
                } else {
                    setError('Credenciales incorrectas');
                }
            } catch (err) {
                console.error('Error en Login.tsx', err);
                setError('Error de conexión');
            } finally {
                setIsLoading(false);
            }
    };

    return (
        <AnimatedStep className="!pt-4 sm:!pt-6">
                <header className="w-full px-6 sm:px-12 flex flex-col items-center relative z-10">
                    <nav className="w-full flex justify-start mb-6 sm:mb-10" aria-label="Navegación de acceso">
                        <button 
                            onClick={() => navigate('/welcome')}
                            className="flex items-center gap-2 text-bluvi-purple/60 hover:text-bluvi-purple font-bold text-sm transition-all active:scale-95 cursor-pointer py-1"
                            aria-label="Volver al inicio"
                        >
                            <ArrowLeft size={18} strokeWidth={3} />
                            <span>Volver</span>
                        </button>
                    </nav>

                    <div className="relative h-10 sm:h-12 flex items-center justify-center w-full max-w-md">
                        <img 
                            src={logo} 
                            alt="Bluvi" 
                            className="w-64 sm:w-80 h-auto drop-shadow-md select-none absolute top-1/2 -translate-y-1/2" 
                            draggable={false}
                        />
                    </div>
                </header>

                <div className="flex-1 flex flex-col justify-center w-full max-w-md px-1 sm:px-0">
                    <h1 className="sr-only">Acceder a Bluvi - Inicia sesión en tu cuenta</h1>
                    <div className="w-full space-y-6 bg-white/20 backdrop-blur-md p-7 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-white/30">
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-bluvi-purple">¡Hola de nuevo!</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10">
                            <div className="space-y-4">
                                <InputField
                                    id="email"      
                                    label="Email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    maxLength={255}
                                    disabled={isLoading}
                                />
                                
                                <div>
                                    <InputField
                                        id="password"
                                        label="Contraseña"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        maxLength={128}
                                        disabled={isLoading}
                                    />

                                    <div className="flex justify-between items-center px-2 mt-2">
                                        <div 
                                            className="flex items-center gap-2 cursor-pointer group focus-visible:outline-none"
                                            onClick={() => setRememberMe(!rememberMe)}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') {
                                                    e.preventDefault();
                                                    setRememberMe(!rememberMe);
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={rememberMe}
                                            tabIndex={0}
                                        >
                                            <div 
                                                className={`
                                                    w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center
                                                    ${rememberMe ? 'bg-bluvi-purple border-bluvi-purple shadow-sm' : 'border-bluvi-purple/30 group-hover:border-bluvi-purple/50 bg-white/50'}
                                                    group-focus-visible:ring-2 group-focus-visible:ring-bluvi-purple/40
                                                `}
                                            >
                                                {rememberMe && <Check size={10} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-medium text-bluvi-purple/70 group-hover:text-bluvi-purple transition-colors">
                                                Recordarme
                                            </span>
                                        </div>

                                        <button 
                                            type="button" 
                                            //onClick={() => navigate('/forgot-password')}
                                            className="text-xs font-semibold text-bluvi-purple/70 hover:text-bluvi-purple transition-colors cursor-pointer"
                                        >
                                            No recuerdo mi contraseña
                                        </button>
                                    </div>
                                </div>
                            </div>

                            
                             {error && (
                                <p className="text-red-500 text-center text-sm font-medium animate-shake" role="alert" aria-live="assertive">
                                    {error}
                                </p>
                             )}

                            <Button 
                                type="submit" 
                                className="w-full py-4 shadow-lg flex justify-center items-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Entrando...</span>
                                    </>
                                ) : (
                                    'Entrar'
                                )}
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
            <footer className="w-full text-[10px] text-bluvi-purple/60 mt-auto mb-4 text-center font-medium tracking-tight">
                &copy; {new Date().getFullYear()} Bluvi. Proyecto académico sin ánimo de lucro.
            </footer>
        </AnimatedStep>
    );
};
