# Bluvi - Frontend

Bienvenido al repositorio del frontend de **Bluvi**. Esta es una aplicacion disenada para facilitar conexiones seguras y autenticas, con un enfoque especial en la neurodivergencia y la accesibilidad cognitiva.

## Requisitos previos

Antes de empezar, asegurate de tener instalado:

- **Node.js** version 18 o superior
- **npm** o **yarn**

## Instalacion

Sigue estos pasos para configurar el proyecto en tu maquina local:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Juls010/bluvi-frontend.git
   cd bluvi-frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Levanta el servidor:

   ```bash
   npm run dev
   ```

   La aplicacion estara disponible en http://localhost:5173.

## Librerias principales instaladas

- **react-router-dom**: gestion de rutas.
- **framer-motion**: animaciones y transiciones suaves.
- **react-aria-components**: componentes UI con accesibilidad de alto nivel.
- **lucide-react**: iconografia profesional.

## Transcripcion de audios

Los audios del chat no se transcriben automaticamente. El flujo es manual para ahorrar coste y respetar la intencion del usuario:

1. El usuario graba y envia el audio con normalidad.
2. El mensaje de audio muestra un boton **Transcribir**.
3. Al pulsarlo, el frontend llama al backend y el servidor usa OpenAI Whisper para guardar y devolver el texto.
4. La transcripcion aparece debajo del reproductor de audio en el mismo mensaje.

Para que funcione, el backend necesita `OPENAI_API_KEY` en su `.env`.

## Enfoque en neurodiversidad

Bluvi ha sido desarrollado siguiendo principios de diseno universal, priorizando la reduccion de la carga cognitiva y el estres visual para usuarios dentro del espectro autista y otras neurodivergencias:

- **Previsibilidad del flujo**: implementacion de una barra de progreso dinamica y segmentada para reducir la ansiedad ante procesos largos.
- **Interfaces de calma**: uso de una paleta de colores suaves y tipografias legibles para evitar la sobreestimulacion sensorial.
- **Navegacion fluida**: transiciones suavizadas mediante `Framer Motion` para evitar cambios de contexto bruscos.
- **Componentes accesibles**: uso de `React Aria` en elementos complejos como el calendario, garantizando compatibilidad con lectores de pantalla y navegacion por teclado.
- **Microcopy empatico**: mensajes de apoyo y validacion durante el registro para fomentar un entorno seguro y de confianza.

Actualmente en construccion.

Julia N.G
