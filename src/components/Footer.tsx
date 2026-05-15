import React from 'react';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const NAV_SECTIONS = [
  {
    title: 'Comunidad',
    links: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Instagram', to: '/instagram' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', to: '/privacidad' },
      { label: 'Términos', to: '/terminos' },
      { label: 'Cookies', to: '/cookies' },
      { label: 'Accesibilidad', to: '/accesibilidad' },
    ],
  },
] as const;

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer
      className="w-full bg-[#221B5F]"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 pb-10 border-b border-white/[0.08]">

          <div className="flex flex-col gap-5">
            <img
              src={logo}
              alt="Bluvi"
              className="w-28 h-auto brightness-0 invert"
            />

            

            <p className="text-[14px] font-medium text-white/62 leading-7 max-w-[560px]">
              Bluvi nace como un Trabajo de Fin de Grado creado con muchas horas de diseño, desarrollo y cuidado, con la intención de imaginar una app de citas más tranquila, accesible y humana para personas neurodivergentes.
            </p>

            <a
              href="mailto:hola@bluvi.com"
              className="
                inline-flex items-center gap-2 self-start
                text-[13px] font-bold text-white/78
                border border-white/20 bg-white/[0.04]
                rounded-full px-4 py-2
                hover:text-white hover:border-white/40 hover:bg-white/[0.08]
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              "
            >
              <EnvelopeSimpleIcon size={14} weight="bold" aria-hidden="true" />
              hola@bluvi.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:max-w-sm lg:justify-self-end">
            {NAV_SECTIONS.map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <p className="mb-4 text-[10px] uppercase tracking-[0.18em] font-black text-white/45">
                  {section.title}
                </p>

                <ul className="flex flex-col gap-3 list-none">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => navigate(link.to)}
                        className="
                          text-[14px] font-semibold text-white/72
                          hover:text-white
                          transition-colors duration-150
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                          rounded
                        "
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6">
          <p className="text-[12px] text-white/45">
            © {currentYear} Bluvi. Todos los derechos reservados.
          </p>

        </div>

      </div>
    </footer>
  );
};