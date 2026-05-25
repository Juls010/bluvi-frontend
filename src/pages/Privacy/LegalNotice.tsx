import { LegalCallout, LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const LegalNotice = () => {
    useScrollToTop();

    return (
        <LegalDocument title="Aviso Legal">
            <LegalSection title="1. Datos Identificativos">
                <p>
                    En cumplimiento con el deber de información recogido en el articulo 10 de la Ley 34/2002, de 11 de julio,
                    de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
                </p>
                <LegalCallout>
                    <ul className="space-y-1">
                        <li><strong>Titular:</strong> Proyecto Académico Bluvi</li>
                        <li><strong>Domicilio:</strong> Sevilla, España</li>
                        <li><strong>Email de contacto:</strong> hola@bluvi.io</li>
                    </ul>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="2. Condiciones de Uso">
                <p>
                    El acceso y uso de Bluvi atribuye la condición de usuario, que acepta las condiciones aquí reflejadas.
                    El usuario se compromete a hacer un uso adecuado de los contenidos y servicios, como chats y foros,
                    evitando conductas ilícitas, acoso o la difusión de contenidos de carácter racista o xenófobo.
                </p>
            </LegalSection>

            <LegalSection title="3. Propiedad Intelectual">
                <p>
                    Bluvi es titular de todos los derechos de propiedad intelectual e industrial de su página web,
                    así como de los elementos contenidos en la misma, incluyendo imágenes, sonido, audio, vídeo, software o textos.
                    Queda prohibida la reproducción, distribución y comunicación pública sin la autorización del titular.
                </p>
            </LegalSection>

            <LegalSection title="4. Exclusión de Garantías y Responsabilidad">
                <p>
                    Bluvi no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar,
                    a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default LegalNotice;
