import { useScrollToTop } from '../../hooks/useScrollToTop';

const Accessibility = () => {
    useScrollToTop();
    return (
        <div className="max-w-4xl mx-auto p-8 text-bluvi-purple leading-relaxed bg-white/90 shadow-sm mt-10 rounded-lg font-sans" >
        <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-bluvi-purple">Declaración de Accesibilidad</h1>
        
        <p className="mb-6 italic text-bluvi-purple">
            En <strong>Bluvi</strong>, trabajamos para que la tecnología sea un espacio de encuentro sin barreras. 
            Nuestro objetivo es garantizar una navegación fluida y comprensible para toda nuestra comunidad.
        </p>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Compromiso de Cumplimiento</h2>
            <p>
            Esta plataforma ha sido desarrollada siguiendo las pautas de accesibilidad <strong>WCAG 2.1 en su nivel AA</strong>. 
            Además, hemos integrado criterios de <strong>Nivel AAA</strong> en áreas críticas como el contraste visual y la simplicidad 
            de la interfaz para reducir la carga cognitiva.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Características de Accesibilidad</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="p-3 bg-slate-50 rounded-lg border-l-3">
                <strong>Contraste Optimizada:</strong> Cumplimiento estricto de ratios de contraste para facilitar la lectura.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border-l-3">
                <strong>Semántica HTML5:</strong> Estructura jerárquica correcta para facilitar el uso de lectores de pantalla.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border-l-3">
                <strong>Navegación Intuitiva:</strong> Reducción de elementos distractores y diseño predecible.
            </li>
            <li className="p-3 bg-slate-50 rounded-lg border-l-3">
                <strong>Foco de Teclado:</strong> Indicadores visuales claros para la navegación sin ratón.
            </li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Proceso de Mejora</h2>
            <p>
            Como proyecto en fase de desarrollo, realizamos pruebas de usabilidad continuas. Si detecta cualquier 
            barrera de acceso, le agradeceríamos que nos lo comunicara en: <strong>hola@bluvi.io</strong>.
            </p>
        </section>
        </div>
    );
};

export default Accessibility;
