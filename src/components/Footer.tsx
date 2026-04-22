import React from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const NAV_SECTIONS = [
  {
    title: 'Recursos',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Guías', to: '/guias' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Comunidad',
    links: [
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
      className="w-full bg-[#26215C]"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pb-10 border-b border-white/[0.08]">

          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <img src={logo} alt="Bluvi" className="w-28 h-auto brightness-0 invert" />
            <p className="text-[13px] text-white/70 leading-relaxed max-w-[210px]">
              Una comunidad para mentes únicas. Conecta siendo exactamente tú.
            </p>
            <a
              href="mailto:hola@bluvi.com"
              className="
                inline-flex items-center gap-2 self-start
                text-[13px] font-semibold text-white/70
                border border-white/25 rounded-full px-3.5 py-1.5
                hover:text-white hover:border-white/50
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                rounded-full
              "
            >
              <Mail size={13} aria-hidden="true" />
              hola@bluvi.com
            </a>
          </div>

          {NAV_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <p className="text-[9.5px] uppercase tracking-[0.15em] font-black text-white/50 mb-4">
                {section.title}
              </p>
              <ul className="flex flex-col gap-2.5 list-none">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => navigate(link.to)}
                      className="
                        text-[13px] text-white/70
                        hover:text-white
                        transition-colors duration-150
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6">
          <p className="text-[12px] text-white/50">
            © {currentYear} Bluvi. Todos los derechos reservados.
          </p>

          <p
            className="flex items-center gap-2 text-[12px] text-white/50"
            aria-label="Estado: comunidad activa con más de 2400 personas"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            Comunidad activa · 2.4k+
          </p>
        </div>

      </div>
    </footer>
  );
};
