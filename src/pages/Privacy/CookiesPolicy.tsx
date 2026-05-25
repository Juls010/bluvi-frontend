import { LegalDocument, LegalSection } from '../../components/LegalDocument';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const CookiePolicy = () => {
    useScrollToTop();

    return (
        <LegalDocument
            title="Política de Cookies"
            intro="En Bluvi utilizamos cookies propias y de terceros para garantizar el funcionamiento técnico de la plataforma y mejorar su experiencia de usuario."
        >
            <LegalSection title="1. ¿Qué es una cookie?">
                <p>
                    Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita casi cualquier página web.
                    Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.
                </p>
            </LegalSection>

            <LegalSection title="2. Cookies utilizadas en Bluvi">
                <p>Bluvi utiliza únicamente <strong>cookies técnicas esenciales</strong>:</p>
                <div className="overflow-x-auto rounded-lg border border-app-strong/30">
                    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-app-surface-soft text-app-primary">
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Nombre</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Proveedor</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Finalidad</th>
                                <th className="border-b border-app-strong/30 p-3 font-semibold">Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-app-strong/20">
                                <td className="p-3 font-medium text-app-primary">sb-access-token</td>
                                <td className="p-3">Supabase</td>
                                <td className="p-3">Mantener la sesión del usuario iniciada de forma segura.</td>
                                <td className="p-3">Sesión</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-app-primary">sb-refresh-token</td>
                                <td className="p-3">Supabase</td>
                                <td className="p-3">Renovar la sesión automáticamente.</td>
                                <td className="p-3">Persistente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </LegalSection>

            <LegalSection title="3. Desactivación de cookies">
                <p>
                    Puedes restringir, bloquear o borrar las cookies de Bluvi utilizando la configuración de tu navegador.
                    Cada navegador tiene una operativa diferente, pero puedes encontrar las instrucciones en el menú de ayuda.
                </p>
            </LegalSection>
        </LegalDocument>
    );
};

export default CookiePolicy;
