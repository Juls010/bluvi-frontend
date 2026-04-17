

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 text-gray-800 leading-relaxed bg-white/90 shadow-sm mt-10 rounded-lg font-sans">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4 text-slate-900">Política de Privacidad</h1>
        
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Responsable del Tratamiento</h2>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <p><strong>Identidad:</strong> Bluvi (Proyecto Académico)</p>
            <p><strong>NIF:</strong> 54221932F</p>
            <p><strong>Dirección postal:</strong> Sevilla, España</p>
            <p><strong>Email:</strong> <span className="text-blue-600">hola@bluvi.io</span></p>
            </div>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Finalidad del Tratamiento</h2>
            <p>
            En Bluvi tratamos la información que nos facilita con el fin de prestarle el servicio de red social solicitado, 
            permitir la conexión entre personas de la comunidad neurodivergente y gestionar su perfil de usuario. 
            Los datos se conservarán mientras se mantenga la relación o durante el tiempo necesario para cumplir con las obligaciones legales.
            </p>
            <p className="mt-3">
            <strong>Inteligencia Artificial:</strong> Contamos con un asistente virtual para soporte. Al interactuar con él, 
            acepta que sus consultas sean procesadas para ofrecer asistencia inmediata.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-red-600">3. Tratamiento de Datos Especiales</h2>
            <p className="italic bg-red-50 p-4 border-l-4 border-red-500">
            Dada la naturaleza de la plataforma, el usuario otorga su <strong>consentimiento explícito</strong> 
            para el tratamiento de datos relativos a su condición de neurodivergencia, facilitados voluntariamente 
            para la personalización de su experiencia en la comunidad.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Destinatarios</h2>
            <p>No se cederán datos a terceros salvo obligación legal. Para el funcionamiento técnico, utilizamos los siguientes proveedores:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-sm text-gray-600">
            <li><strong>Supabase, Inc:</strong> Alojamiento de datos y autenticación (EE.UU/UE).</li>
            <li><strong>Zoho Corporation:</strong> Gestión de correos electrónicos del sistema (UE).</li>
            <li><strong>Upstash, Inc:</strong> Gestión de caché y códigos de verificación.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Sus Derechos</h2>
            <p>
            Usted tiene derecho a ejercer sus derechos de acceso, rectificación, supresión y portabilidad de datos, 
            oposición y limitación a su tratamiento enviando un correo a <strong>hola@bluvi.io</strong> con su NIF/DNI. 
            Si considera que no ha obtenido satisfacción, puede reclamar ante la Agencia Española de Protección de Datos.
            </p>
        </section>
        </div>
    );
    };

export default PrivacyPolicy;