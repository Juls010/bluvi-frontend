import { LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const CookiePolicy = () => {
    useScrollToTop();

    return (
        <LegalDocument
            title="Politica de Cookies"
            intro="En Bluvi utilizamos cookies propias y de terceros para garantizar el funcionamiento tecnico de la plataforma y mejorar su experiencia de usuario."
        >
            <LegalSection title="1. Que es una cookie">
                <p>
                    Una cookie es un pequeno archivo de texto que se almacena en su navegador cuando visita casi cualquier pagina web.
                    Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa pagina.
                </p>
            </LegalSection>

            <LegalSection title="2. Cookies utilizadas en Bluvi">
                <p>Bluvi utiliza unicamente <strong>cookies tecnicas esenciales</strong>:</p>
                <div className="overflow-x-auto rounded-lg border border-app-strong/30">
                    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-app-surface-soft text-app-primary">
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Nombre</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Proveedor</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Finalidad</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Duracion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-app-strong/20">
                                <td className="p-3 font-medium text-app-primary">sb-access-token</td>
                                <td className="p-3">Supabase</td>
                                <td className="p-3">Mantener la sesion del usuario iniciada de forma segura.</td>
                                <td className="p-3">Sesion</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-app-primary">sb-refresh-token</td>
                                <td className="p-3">Supabase</td>
                                <td className="p-3">Renovar la sesion automaticamente.</td>
                                <td className="p-3">Persistente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </LegalSection>

            <LegalSection title="3. Desactivacion de cookies">
                <p>
                    Usted puede restringir, bloquear o borrar las cookies de Bluvi utilizando la configuracion de su navegador.
                    Cada navegador tiene una operativa diferente, pero puede encontrar las instrucciones en su menu de ayuda.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default CookiePolicy;
