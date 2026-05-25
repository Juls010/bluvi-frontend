import { LegalCallout, LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const PrivacyPolicy = () => {
    useScrollToTop();

    return (
        <LegalDocument title="Política de Privacidad">
            <LegalSection title="1. Responsable del Tratamiento">
                <LegalCallout>
                    <p><strong>Identidad:</strong> Bluvi (Proyecto Académico)</p>
                    <p><strong>Dirección postal:</strong> Sevilla, España</p>
                    <p><strong>Email:</strong> <span className="font-semibold text-app-accent">hola@bluvi.io</span></p>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="2. Finalidad del Tratamiento">
                <p>
                    En Bluvi tratamos la información que nos facilita con el fin de prestarle el servicio de red social solicitado,
                    permitir la conexión entre personas de la comunidad neurodivergente y gestionar su perfil de usuario.
                    Los datos se conservarán mientras se mantenga la relación o durante el tiempo necesario para cumplir con las obligaciones legales.
                </p>
            </LegalSection>

            <LegalSection title="3. Tratamiento de Datos Especiales" tone="warning">
                <LegalCallout tone="warning">
                    <p className="italic">
                        Dada la naturaleza de la plataforma, el usuario otorga su <strong>consentimiento explícito</strong>
                        {' '}para el tratamiento de datos relativos a su condición de neurodivergencia, facilitados voluntariamente
                        para la personalización de su experiencia en la comunidad.
                    </p>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="4. Destinatarios">
                <p>No se cederán datos a terceros salvo obligación legal. Para el funcionamiento técnico, utilizamos los siguientes proveedores:</p>
                <ul className="list-disc space-y-1 pl-6">
                    <li><strong>Supabase, Inc:</strong> Alojamiento de datos y autenticación (UE).</li>
                    <li><strong>Zoho Corporation:</strong> Gestión de correos electrónicos del sistema (UE).</li>
                    <li><strong>Upstash, Inc:</strong> Gestión de caché y códigos de verificación.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Sus Derechos">
                <p>
                    Usted tiene derecho a ejercer sus derechos de acceso, rectificación, supresión y portabilidad de datos,
                    oposición y limitación a su tratamiento enviando un correo a <strong>hola@bluvi.io</strong> con su NIF/DNI.
                    Si considera que no ha obtenido satisfacción, puede reclamar ante la Agencia Espanola de Protección de Datos.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default PrivacyPolicy;
