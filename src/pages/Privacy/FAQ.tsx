import React, { useState } from 'react';
import {
    useScrollToTop } from '../../hooks/useScrollToTop';
import { CaretDownIcon,
    CaretUpIcon
} from '@phosphor-icons/react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = React.useId();
  const headerId = `faq-header-${id}`;
  const panelId = `faq-panel-${id}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.currentTarget as HTMLElement;
    const container = target.closest('.faq-container');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('[data-faq-button]')) as HTMLButtonElement[];
    const currentIndex = items.indexOf(target as HTMLButtonElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  };

  return (
    <div className="border-b border-slate-200 last:border-0">
      <h3 className="m-0 p-0 text-base font-normal">
        <button
          id={headerId}
          data-faq-button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="w-full py-5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluvi-purple/20 group"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="text-lg font-semibold text-bluvi-purple pr-8 group-hover:text-bluvi-purple/80 transition-colors">{question}</span>
          {isOpen ? (
            <CaretUpIcon className="text-bluvi-purple shrink-0" size={20} weight="bold" />
          ) : (
            <CaretDownIcon className="text-slate-400 shrink-0" size={20} weight="bold" />
          )}
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 mb-5' : 'max-h-0 opacity-0 invisible'
        } ${isOpen ? 'visible' : ''}`}
      >
        <div className="px-4 text-bluvi-purple/90 leading-relaxed text-[15px]">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  useScrollToTop();

  const faqs = [
    {
      question: "Soy nuevo en Bluvi. ¿Para que sirve cada botón?",
      answer: (
        <p>
          El botón <strong>«Corazón»</strong> que aparece junto a cada sección del perfil de un usuario te permiten expresar tu interés y enviar una solicitud de emparejamiento a ese usuario. El botón <strong>«XIcon»</strong> sirve para saltarse o descartar a un usuario. Si le das a «XIcon» a un usuario, volverá a aparecer en tu lista de parejas compatibles en unos días. Si pulsas «XIcon» por error, el botón <strong>«Retroceder»</strong> te permite volver atrás y volver a ver inmediatamente el perfil anterior.
        </p>
      )
    },
    {
      question: "¿Bluvi es solo para gente que busca pareja?",
      answer: <p>¡Si! Sabemos que las relaciones románticas pueden ser complicadas de iniciar, y queremos ayudarte a dar ese paso.</p>
    },
    {
      question: "¿Dónde puedo cambiar mi configuración y mis preferencias de emparejamiento?",
      answer: (
        <p>
          Selecciona tu foto de perfil, situada en la parte superior derecha de la pantalla. Allí encontrarás <strong>"Ajustes"</strong>, donde podrás personalizar tu experiencia en Bluvi. Para editar tu información, ve a <strong>"Mi perfil"</strong>, donde podrás establecer la edad, la distancia y el género de tus posibles parejas.
        </p>
      )
    },
    {
      question: "¿Cómo puedo enviar un mensaje directo a alguien que me interesa?",
      answer: <p>Bluvi es una app que requiere el consentimiento mutuo de ambas partes. El chat privado se activa cuando ambos habéis mostrado interés mutuo. Todos los usuarios pueden enviar un primer mensaje personalizado en su <strong>«Me gusta»</strong>.</p>
    },
    {
      question: "¿Cómo puedo denunciar y bloquear a un usuario?",
      answer: <p>La app cuenta con un botón justo debajo del perfil de la persona. Toca ese botón para abrir un menú con opciones de bloquear o denunciar a un usuario, y nuestro equipo de moderación y seguridad revisará su perfil.</p>
    },
    {
      question: "¿Cómo garantiza Bluvi la seguridad de sus miembros?",
      answer: <p>La seguridad de nuestros miembros es la prioridad número uno de Bluvi. La app utiliza verificación de identidad para filtrar a los estafadores y usuarios menores de edad. Los usuarios pronto podrán verificar su identidad, ayudando a reforzar la confianza mediante una insignia de perfil verificado.</p>
    },
    {
      question: "¿Por qué se fundó Bluvi?",
      answer: <p>Bluvi nació en 2025 como un proyecto educativo sin ánimo de lucro, con el objetivo real de ayudar a los adultos neurodivergentes a forjar relaciones sentimentales y un sentido de comunidad accesible.</p>
    },
    {
      question: "¿Bluvi ha sido creado por personas neurodivergentes?",
      answer: <p>Sí, todos los miembros del equipo de Bluvi son neurodivergentes. También hemos contado con ayuda profesional específica para desarrollar un ambiente apropiado.</p>
    },
    {
      question: "¿Cómo me uno a Bluvi?",
      answer: <p>Bluvi nació como app social en formato web, aunque pronto contaremos con app disponible en PlayStore para que puedas disfrutar de él desde tu dispositivo movil.</p>
    },
    {
      question: "¿Quién puede unirse a Bluvi?",
      answer: <p>Bluvi está dirigido a cualquier persona que se identifique como neurodivergente, ya sea que haya recibido un diagnóstico profesional, se haya autodiagnosticado o esté explorando su identidad neurodivergente.</p>
    },
    {
      question: "¿A qué te refieres cuando dices «neurodivergente»?",
      answer: <p>Cuando alguien es neurodivergente, sus pensamientos y comportamientos no se ajustan a las expectativas habituales sobre cómo funciona el cerebro de las personas en un mundo neuronormativo. La neurodiversidad es única en cada persona, por lo que no hay dos personas neurodivergentes que tengan exactamente la misma experiencia. Esto significa que no hay una única forma «correcta» de ser neurodivergente. Todas los tipos de personas neurodivergentes son bienvenidas en Bluvi.</p>
    },
    {
      question: "¿Necesito un diagnóstico oficial para unirme a la comunidad?",
      answer: <p>No. Existen enormes obstáculos para obtener un diagnóstico oficial. En Bluvi, respetamos, valoramos y validamos el autodiagnóstico y la autoidentificación. Nunca tendrás que demostrarnos que tu lugar está en Bluvi.</p>
    },
    {
      question: "¿Qué edad hay que tener para registrarse en Bluvi?",
      answer: <p>18+</p>
    },
    {
      question: "¿Bluvi es un lugar inclusivo para la comunidad LGBTQ+?",
      answer: <p>Si, por supuesto :)</p>
    },
    {
      question: "¿Cómo puedo eliminar mi cuenta y mis datos?",
      answer: (
        <ul className="list-disc ml-5 space-y-1">
          <li>Ve a la pestaña <strong>«Perfil»</strong></li>
          <li>Haz click en <strong>«Ajustes de cuenta»</strong></li>
          <li>Desplázate hasta la parte inferior de la pantalla.</li>
          <li>Haz clic en <strong>«Eliminar cuenta»</strong> y sigue las instrucciones.</li>
          <li>Al eliminar tu cuenta, tus datos se borrarán automáticamente.</li>
        </ul>
      )
    },
    {
      question: "¿Vende Bluvi mis datos?",
      answer: <p>No. Bluvi es un proyecto académico sin ánimo de lucro y nunca venderá tus datos a terceros. Tu privacidad es nuestra prioridad y solo compartimos información con los proveedores técnicos necesarios para el funcionamiento de la app, siempre bajo estrictos contratos de confidencialidad.</p>
    },
    {
      question: "Tengo más preguntas que no se han respondido aquí.",
      answer: <p>¡No hay problema! Estamos aquí para ayudarte. Envía un correo electrónico al equipo a <span className="text-bluvi-purple font-semibold italic underline">hola@bluvi.io</span>, normalmente respondemos en un plazo de 1 a 3 días laborables.</p>
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 text-bluvi-purple leading-relaxed bg-white/95 shadow-sm mt-4 sm:mt-10 mb-20 rounded-lg font-sans border border-white/60">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-bluvi-purple">Preguntas Frecuentes (FAQ)</h1>
        <p className="text-bluvi-purple/70 font-medium">Todo lo que necesitas saber sobre Bluvi y nuestra comunidad.</p>
      </header>
      
      <div className="faq-container space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <footer className="mt-16 pt-10 border-t border-slate-100 text-center">
        <p className="text-xl font-semibold text-bluvi-purple mb-2">¡Únete a nuestra comunidad neurodivergente!</p>
        <p className="text-bluvi-purple/70">Estamos deseando conocerte :)</p>
      </footer>
    </div>
  );
};

export default FAQ;
