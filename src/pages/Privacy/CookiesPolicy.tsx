
import React from 'react';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const CookiePolicy = () => {
    useScrollToTop();
    return (
        <div className="max-w-4xl mx-auto p-8 text-bluvi-purple leading-relaxed bg-white/90 shadow-sm mt-10 rounded-lg font-sans">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-bluvi-purple">Política de Cookies</h1>
        
        <p className="mb-6">
            En Bluvi utilizamos cookies propias y de terceros para garantizar el funcionamiento técnico de la plataforma 
            y mejorar su experiencia de usuario.
        </p>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. ¿Qué es una cookie?</h2>
            <p>Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Cookies utilizadas en Bluvi</h2>
            <p className="mb-3">Bluvi utiliza únicamente <strong>Cookies Técnicas (Esenciales)</strong>:</p>
            <table className="w-full text-left border-collapse border border-slate-200">
            <thead>
                <tr className="bg-slate-100">
                <th className="p-2 border border-slate-200 font-semibold text-sm">Nombre</th>
                <th className="p-2 border border-slate-200 font-semibold text-sm">Proveedor</th>
                <th className="p-2 border border-slate-200 font-semibold text-sm">Finalidad</th>
                <th className="p-2 border border-slate-200 font-semibold text-sm">Duración</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                <tr>
                <td className="p-2 border border-slate-200">sb-access-token</td>
                <td className="p-2 border border-slate-200">Supabase</td>
                <td className="p-2 border border-slate-200">Mantener la sesión del usuario iniciada de forma segura.</td>
                <td className="p-2 border border-slate-200">Sesión</td>
                </tr>
                <tr>
                <td className="p-2 border border-slate-200">sb-refresh-token</td>
                <td className="p-2 border border-slate-200">Supabase</td>
                <td className="p-2 border border-slate-200">Renovar la sesión automáticamente.</td>
                <td className="p-2 border border-slate-200">Persistente</td>
                </tr>
            </tbody>
            </table>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Desactivación de cookies</h2>
            <p>Usted puede restringir, bloquear o borrar las cookies de Bluvi utilizando la configuración de su navegador. Cada navegador tiene una operativa diferente, pero puede encontrar las instrucciones en su menú de ayuda.</p>
        </section>
        </div>
    );
    };

export default CookiePolicy;