import { LegalCallout, LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const PrivacyPolicy = () => {
    useScrollToTop();

    return (
        <LegalDocument title="Politica de Privacidad">
            <LegalSection title="1. Responsable del Tratamiento">
                <LegalCallout>
                    <p><strong>Identidad:</strong> Bluvi (Proyecto Academico)</p>
                    <p><strong>NIF:</strong> 54221932F</p>
                    <p><strong>Direccion postal:</strong> Sevilla, Espana</p>
                    <p><strong>Email:</strong> <span className="font-semibold text-app-accent">hola@bluvi.io</span></p>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="2. Finalidad del Tratamiento">
                <p>
                    En Bluvi tratamos la informacion que nos facilita con el fin de prestarle el servicio de red social solicitado,
                    permitir la conexion entre personas de la comunidad neurodivergente y gestionar su perfil de usuario.
                    Los datos se conservaran mientras se mantenga la relacion o durante el tiempo necesario para cumplir con las obligaciones legales.
                </p>
                <p>
                    <strong>Inteligencia Artificial:</strong> Contamos con un asistente virtual para soporte. Al interactuar con el,
                    acepta que sus consultas sean procesadas para ofrecer asistencia inmediata.
                </p>
            </LegalSection>

            <LegalSection title="3. Tratamiento de Datos Especiales" tone="warning">
                <LegalCallout tone="warning">
                    <p className="italic">
                        Dada la naturaleza de la plataforma, el usuario otorga su <strong>consentimiento explicito</strong>
                        {' '}para el tratamiento de datos relativos a su condicion de neurodivergencia, facilitados voluntariamente
                        para la personalizacion de su experiencia en la comunidad.
                    </p>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="4. Destinatarios">
                <p>No se cederan datos a terceros salvo obligacion legal. Para el funcionamiento tecnico, utilizamos los siguientes proveedores:</p>
                <ul className="list-disc space-y-1 pl-6">
                    <li><strong>Supabase, Inc:</strong> Alojamiento de datos y autenticacion (EE.UU/UE).</li>
                    <li><strong>Zoho Corporation:</strong> Gestion de correos electronicos del sistema (UE).</li>
                    <li><strong>Upstash, Inc:</strong> Gestion de cache y codigos de verificacion.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Sus Derechos">
                <p>
                    Usted tiene derecho a ejercer sus derechos de acceso, rectificacion, supresion y portabilidad de datos,
                    oposicion y limitacion a su tratamiento enviando un correo a <strong>hola@bluvi.io</strong> con su NIF/DNI.
                    Si considera que no ha obtenido satisfaccion, puede reclamar ante la Agencia Espanola de Proteccion de Datos.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default PrivacyPolicy;
