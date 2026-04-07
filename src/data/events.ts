export interface HomeEvent {
    id: string;
    title: string;
    text: string;
    meta: string;
    dateLabel: string;
    place: string;
    mode: 'online' | 'presencial' | 'hibrido';
    description: string;
    agenda: string[];
}

export const HOME_EVENTS: HomeEvent[] = [
    {
        id: 'discover-refresh',
        title: 'Nueva forma de descubrir perfiles',
        text: 'Hemos simplificado el inicio para que puedas entrar directamente a explorar sin ruido visual.',
        meta: 'Hoy',
        dateLabel: 'Disponible desde hoy',
        place: 'En la app de Bluvi',
        mode: 'online',
        description:
            'Presentamos una experiencia de descubrimiento mas clara para que explores personas con menos sobrecarga visual y mas control de filtros reales.',
        agenda: [
            'Recorrido guiado de los nuevos filtros y chips activos.',
            'Como usar el pass y el match de forma tranquila.',
            'Consejos para ajustar tu ritmo y evitar saturacion.',
        ],
    },
    {
        id: 'community-session',
        title: 'Sesion de comunidad esta semana',
        text: 'Proximo encuentro de bienvenida para personas nuevas y curiosas sobre Bluvi.',
        meta: 'Jueves · 19:00',
        dateLabel: 'Jueves, 19:00',
        place: 'Sala virtual de comunidad',
        mode: 'hibrido',
        description:
            'Un espacio de presentacion calmado para conocer la comunidad, resolver dudas y escuchar experiencias reales de otras personas.',
        agenda: [
            'Bienvenida y dinamica de presentacion opcional.',
            'Preguntas frecuentes sobre seguridad y limites.',
            'Bloque final para conectar con intereses comunes.',
        ],
    },
    {
        id: 'accessibility-settings',
        title: 'Ajustes pensados para ti',
        text: 'Contraste, movimiento y navegacion clara ya estan disponibles desde el menu superior.',
        meta: 'Siempre disponible',
        dateLabel: 'Disponible siempre',
        place: 'Ajustes de tu perfil',
        mode: 'online',
        description:
            'Repasa todas las opciones de accesibilidad y personalizacion para que la interfaz se adapte a tu forma de navegar.',
        agenda: [
            'Ajuste rapido de contraste y legibilidad.',
            'Reduccion de movimiento para menor estimulacion.',
            'Atajos de navegacion para acceder a secciones clave.',
        ],
    },
];

export const getHomeEventById = (eventId?: string) => HOME_EVENTS.find((event) => event.id === eventId);
