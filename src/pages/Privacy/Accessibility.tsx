import { LegalCallout, LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const Accessibility = () => {
    useScrollToTop();

    return (
        <LegalDocument
            title="Declaracion de Accesibilidad"
            intro={(
                <>
                    En <strong>Bluvi</strong>, trabajamos para que la tecnologia sea un espacio de encuentro sin barreras.
                    Nuestro objetivo es garantizar una navegacion fluida y comprensible para toda nuestra comunidad.
                </>
            )}
        >
            <LegalSection title="1. Compromiso de Cumplimiento">
                <p>
                    Esta plataforma ha sido desarrollada siguiendo las pautas de accesibilidad <strong>WCAG 2.1 en su nivel AA</strong>.
                    Ademas, hemos integrado criterios de <strong>Nivel AAA</strong> en areas criticas como el contraste visual y la simplicidad
                    de la interfaz para reducir la carga cognitiva.
                </p>
            </LegalSection>

            <LegalSection title="2. Caracteristicas de Accesibilidad">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <LegalCallout>
                        <strong>Contraste optimizado:</strong> cumplimiento de ratios de contraste para facilitar la lectura.
                    </LegalCallout>
                    <LegalCallout>
                        <strong>Semantica HTML5:</strong> estructura jerarquica correcta para lectores de pantalla.
                    </LegalCallout>
                    <LegalCallout>
                        <strong>Navegacion intuitiva:</strong> reduccion de elementos distractores y diseno predecible.
                    </LegalCallout>
                    <LegalCallout>
                        <strong>Foco de teclado:</strong> indicadores visuales claros para la navegacion sin raton.
                    </LegalCallout>
                </div>
            </LegalSection>

            <LegalSection title="3. Proceso de Mejora">
                <p>
                    Como proyecto en fase de desarrollo, realizamos pruebas de usabilidad continuas. Si detecta cualquier
                    barrera de acceso, le agradeceriamos que nos lo comunicara en: <strong>hola@bluvi.io</strong>.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default Accessibility;
