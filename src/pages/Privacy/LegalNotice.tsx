import { LegalCallout, LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const LegalNotice = () => {
    useScrollToTop();

    return (
        <LegalDocument title="Aviso Legal">
            <LegalSection title="1. Datos Identificativos">
                <p>
                    En cumplimiento con el deber de informacion recogido en el articulo 10 de la Ley 34/2002, de 11 de julio,
                    de Servicios de la Sociedad de la Informacion y del Comercio Electronico (LSSI-CE), se facilitan los siguientes datos:
                </p>
                <LegalCallout>
                    <ul className="space-y-1">
                        <li><strong>Titular:</strong> Proyecto Academico Bluvi</li>
                        <li><strong>NIF:</strong> 54221932F</li>
                        <li><strong>Domicilio:</strong> Sevilla, Espana</li>
                        <li><strong>Email de contacto:</strong> hola@bluvi.io</li>
                    </ul>
                </LegalCallout>
            </LegalSection>

            <LegalSection title="2. Condiciones de Uso">
                <p>
                    El acceso y uso de Bluvi atribuye la condicion de usuario, que acepta las condiciones aqui reflejadas.
                    El usuario se compromete a hacer un uso adecuado de los contenidos y servicios, como chats y foros,
                    evitando conductas ilicitas, acoso o la difusion de contenidos de caracter racista o xenofobo.
                </p>
            </LegalSection>

            <LegalSection title="3. Propiedad Intelectual">
                <p>
                    Bluvi es titular de todos los derechos de propiedad intelectual e industrial de su pagina web,
                    asi como de los elementos contenidos en la misma, incluyendo imagenes, sonido, audio, video, software o textos.
                    Queda prohibida la reproduccion, distribucion y comunicacion publica sin la autorizacion del titular.
                </p>
            </LegalSection>

            <LegalSection title="4. Exclusion de Garantias y Responsabilidad">
                <p>
                    Bluvi no se hace responsable, en ningun caso, de los danos y perjuicios de cualquier naturaleza que pudieran ocasionar,
                    a titulo enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmision de virus o programas maliciosos.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default LegalNotice;
