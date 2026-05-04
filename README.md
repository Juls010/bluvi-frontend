# 🫧 Bluvi - Frontend

¡Bienvenido al repositorio del frontend de **Bluvi**! Esta es una aplicación diseñada para facilitar conexiones seguras y auténticas, con un enfoque especial en la neurodivergencia y la accesibilidad cognitiva.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:
* **Node.js** (versión 18 o superior)
* **npm** o **yarn**

##  Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio:**
   ```bash
   git clone [URL-DE-TU-REPOSITORIO]
   cd bluvi-frontend
   ```
2. **Instala las dependencias:**
    ```bash
    npm install
    ```
3. **Levantar servidor:**
   ```
   npm run dev
   ```
   La aplicación estará disponible en http://localhost:5173.

## Librerías principales instaladas
      
  * **react-router-dom**: Gestión de rutas.  
  * **framer-motion**: Animaciones y transiciones suaves.
  * **react-aria-components**: Componentes UI con accesibilidad de alto nivel.
  * **lucide-react**: Iconografía profesional.

## Transcripción de audios

Los audios del chat no se transcriben automáticamente. El flujo es manual para ahorrar coste y respetar la intención del usuario:

1. El usuario graba y envía el audio con normalidad.
2. El mensaje de audio muestra un botón **Transcribir**.
3. Al pulsarlo, el frontend llama al backend y el servidor usa OpenAI Whisper para guardar y devolver el texto.
4. La transcripción aparece debajo del reproductor de audio en el mismo mensaje.

Para que funcione, el backend necesita `OPENAI_API_KEY` en su `.env`.
    

## Enfoque en Neurodiversidad

Bluvi ha sido desarrollado siguiendo principios de **Diseño Universal**, priorizando la reducción de la carga cognitiva y el estrés visual para usuarios dentro del espectro autista y otras neurodivergencias:

* **Previsibilidad del Flujo**: Implementación de una barra de progreso dinámica y segmentada para reducir la ansiedad ante procesos largos.
* **Interfaces de Calma**: Uso de una paleta de colores suaves (estilo *glassmorphism*) y tipografías legibles para evitar la sobreestimulación sensorial.
* **Navegación Fluida**: Transiciones suavizadas mediante `Framer Motion` para evitar cambios de contexto bruscos.
* **Componentes Accesibles**: Uso de `React Aria` en elementos complejos como el calendario, garantizando compatibilidad total con lectores de pantalla y navegación por teclado.
* **Microcopy Empático**: Mensajes de apoyo y validación durante el registro para fomentar un entorno seguro y de confianza.

Actualmente en construcción - 
Julia N.G 💕