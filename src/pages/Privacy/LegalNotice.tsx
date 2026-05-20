import { useScrollToTop } from '../../hooks/useScrollToTop';

const LegalNotice = () => {
    useScrollToTop();
    return (
        <div className="max-w-4xl mx-auto p-8 text-bluvi-purple leading-relaxed bg-white/90 shadow-sm mt-10 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-bluvi-purple">Aviso Legal</h1>
        
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Datos Identificativos</h2>
            <p>En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:</p>
            <ul className="mt-3 space-y-1">
            <li><strong>Titular:</strong> Proyecto Académico Bluvi</li>
            <li><strong>NIF:</strong> 54221932F</li>
            <li><strong>Domicilio:</strong> Sevilla, España</li>
            <li><strong>Email de contacto:</strong> hola@bluvi.io</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Condiciones de Uso</h2>
            <p>
            El acceso y uso de Bluvi atribuye la condición de USUARIO, que acepta las condiciones aquí reflejadas. 
            El usuario se compromete a hacer un uso adecuado de los contenidos y servicios (como chats y foros), 
            evitando conductas ilícitas, acoso o la difusión de contenidos de carácter racista o xenófobo.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. Propiedad Intelectual</h2>
            <p>
            Bluvi es titular de todos los derechos de propiedad intelectual e industrial de su página web, 
            así como de los elementos contenidos en la misma (imágenes, sonido, audio, vídeo, software o textos). 
            Queda prohibida la reproducción, distribución y comunicación pública sin la autorización del titular.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Exclusión de Garantías y Responsabilidad</h2>
            <p>
            Bluvi no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, 
            a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos.
            </p>
        </section>
        </div>
    );
    };

export default LegalNotice;
