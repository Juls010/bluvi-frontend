import React from 'react';
import { InstagramLogoIcon, EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Tooltip, TooltipTrigger, Button as AriaButton } from './Tooltip';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer
      className="w-full bg-[#221B5F] rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-12px_40px_-15px_rgba(34,27,95,0.15)] overflow-hidden"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 pb-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 pb-12">
          
          <div className="flex flex-col items-start gap-5">
            <img
              src={logo}
              alt="Bluvi"
              className="w-36 h-auto brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
            />
            
            <p className="text-[14px] font-medium leading-7 text-white/70 max-w-[500px] text-pretty">
              Bluvi ha sido creado con muchas horas de trabajo para crear un espacio único, accesible y humano para todos.
            </p>

            <a
              href="mailto:hola@bluvi.com"
              className="
                inline-flex items-center gap-2 
                text-[13px] font-bold text-[#D8D1FF]
                border border-[#D8D1FF]/20 bg-[#D8D1FF]/05
                rounded-2xl px-4 py-2.5
                hover:text-white hover:border-[#D8D1FF]/40 hover:bg-[#D8D1FF]/10
                transition-all duration-300 ease-out hover:shadow-md
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8D1FF]/50
              "
            >
              <EnvelopeSimpleIcon size={15} weight="bold" aria-hidden="true" />
              hola@bluvi.com
            </a>
          </div>

          <nav aria-label="Información legal" className="flex flex-col items-start lg:items-end text-left lg:text-right">
            <p className="mb-4 text-[11px] uppercase tracking-[0.2em] font-black text-white/40 select-none">
              Legal
            </p>
            <ul className="flex flex-col gap-3.5 list-none m-0 p-0 items-start lg:items-end">
              {[
                { label: 'Privacidad', to: '/privacidad' },
                { label: 'Términos', to: '/terminos' },
                { label: 'Cookies', to: '/cookies' },
                { label: 'Accesibilidad', to: '/accesibilidad' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.to)}
                    className="
                      text-[14px] font-bold text-white/75
                      hover:text-white hover:translate-x-0.5 lg:hover:-translate-x-0.5
                      transition-all duration-200 ease-out
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8D1FF]/50
                      rounded-lg px-1 py-0.5
                    "
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p className="text-[13px] font-medium text-white/45">
              © {currentYear} Bluvi. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-8">
            <button
              type="button"
              onClick={() => navigate('/faq')}
              className="
                text-[14px] font-bold text-white/75
                hover:text-white transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8D1FF]/50
                rounded-lg px-2 py-0.5
              "
            >
              FAQ
            </button>

            <TooltipTrigger delay={250}>
              <AriaButton
                onPress={() => window.open('https://www.instagram.com/bluvi.io', '_blank', 'noopener,noreferrer')}
                aria-label="Visita nuestro Instagram"
                className="
                  inline-flex items-center justify-center
                  text-white/60 hover:text-white transition-all duration-200 hover:scale-110
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8D1FF]/50
                  rounded-xl p-1.5
                "
              >
                <InstagramLogoIcon size={24} weight="bold" />
              </AriaButton>
              <Tooltip placement="top">Instagram de Bluvi</Tooltip>
            </TooltipTrigger>
          </div>

        </div>

      </div>
    </footer>
  );
};
