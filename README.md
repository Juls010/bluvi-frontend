# Bluvi - Frontend

Bluvi is an inclusive social network designed to help people build safe, authentic and accessible connections. The frontend is built as a React SPA and pays particular attention to the experience of neurodivergent users through predictable flows, clear microcopy, accessibility, reduced cognitive load and a calm visual interface.

The project includes a public landing page, guided registration, login, a private area for discovering profiles, real-time messaging, profile management, settings, legal documents and an administration panel.

## Technologies Used

- **React 19**: component-based interface development.
- **TypeScript**: static typing across components, services and models.
- **Vite**: development environment, build pipeline and asset optimisation.
- **React Router DOM**: management of public, private, legal and administration routes.
- **Tailwind CSS**: utility-first styling and responsive visual system.
- **Framer Motion**: smooth transitions and animations.
- **React Aria Components**: accessible components compatible with keyboard navigation and screen readers.
- **TanStack Query**: asynchronous data handling and API cache management.
- **Axios**: HTTP client for communication with the backend.
- **Socket.IO Client**: real-time messaging and events.
- **Supabase**: integration for image storage and user assets.
- **Cloudflare Workers / Wrangler**: frontend deployment and SPA behaviour in production.
- **Vitest + Testing Library**: unit and component testing.

## Website Flow

1. **Public Entry Point**

   Users arrive at `/`, where they find the Bluvi landing page with product information, the accessibility approach, registration calls to action and legal links.

2. **Authentication**

   Users can log in from `/login`. If they already have an active session, the application can redirect them to the private area.

3. **Guided Registration**

   Sign-up is completed step by step under `/register`: name, age, gender, sexuality, neurodivergences, communication style, email, photos, location, interests, description, email verification and safety tips.

4. **Private Area**

   After authentication, the application enters `/app`, protected by `PrivateRoute`. From there, users can access the home page, profile discovery, messages, their own profile, settings, reports and blocks.

5. **Chat and Connections**

   Conversations are available under `/app/messages` and `/app/chat/:id`. The chat supports text messages, images, audio messages, manual audio transcription and real-time events through Socket.IO.

6. **Legal Pages and SEO**

   The routes `/privacidad`, `/cookies`, `/legal`, `/terminos`, `/faq` and `/accesibilidad` are public. The project includes `sitemap.xml`, `robots.txt`, a canonical URL and a meta description to improve visibility in Google Search Console.

7. **Administration**

   The `/admin` route is protected by `AdminRoute` and includes user management, reports, metrics and administrator creation.

## Screenshots

These screenshots show the main screens of the Bluvi experience.

| Screen | Screenshot |
| --- | --- |
| Public landing page | ![Bluvi public landing page](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788418/fcd8b17b-4d50-409f-8bcf-bed09e0bd2dd.png) |
| Guided registration | ![Bluvi guided registration](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788489/a979f1a0-d737-4581-a9ea-97808c9d8cca.png) |
| Profile discovery | ![Bluvi profile discovery](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788271/578051bd-f4f4-459b-980a-91c48f9cdd73.png) |
| Chat | ![Bluvi chat](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788147/16b84b51-1d09-48d8-a9c6-e1846f13951c.png) |
| User profile | ![Bluvi user profile](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788300/ee4c4970-8a08-462e-b43e-1dbceaa6ea56.png) |
| Administration panel | ![Bluvi administration panel](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779788381/03ea4956-1be6-4bbe-a87b-dedc8858a526.png) |

## Accessibility

Bluvi has been developed with particular attention to cognitive, visual and navigational accessibility. The interface prioritises predictable flows, clear text, careful contrast, keyboard compatibility and accessible components in forms, modals, calendars, tooltips and error messages.

This section includes audit evidence from external tools.

| Tool | Screenshot |
| --- | --- |
| Lighthouse - Chrome DevTools | ![Bluvi Lighthouse accessibility report](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779789518/Captura_de_pantalla_2026-05-26_111920_s6hyu9.png) |
| WAVE - Web Accessibility Evaluation Tool | ![Bluvi WAVE accessibility analysis](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779789523/Captura_de_pantalla_2026-05-26_112117_s0e8p7.png) |

## Main Code-Level Features

- **Centralised router**: `src/router/Router.tsx` defines public, private, legal, registration, chat and administration routes.
- **Route protection**: `PrivateRoute` controls access to the authenticated area, while `AdminRoute` restricts access to the administration panel.
- **Authentication context**: `AuthContext` keeps track of the session state, current user, login and logout.
- **Registration context**: `RegisterContext` stores multi-step form data, temporarily persists it and sends the completed registration to the backend.
- **API services**: `src/services` centralises HTTP calls for authentication, users, matches, chats, administration, narration, file uploads and transcription.
- **Real-time messaging**: `realtime.service.ts` and `chat.service.ts` coordinate events, conversations and messages.
- **Image uploads**: `uploadService.ts` manages profile photo uploads and related user assets.
- **Audio and transcription**: `AudioRecorder`, `AudioMessage` and `transcription.service.ts` allow users to record, play and manually transcribe audio messages.
- **Accessibility and narration**: components such as `NarrationButton`, `AccessibleErrorTooltip`, `DatePicker` and themed layouts strengthen the accessible experience.
- **Global notifications**: `GlobalToast` and `toastQueue` provide success and error feedback for key actions.
- **Basic SEO**: `public/sitemap.xml`, `public/robots.txt` and `index.html` include search engine signals without exposing private routes.
- **Tests**: `src/tests` and `src/pages/Register/__tests__` cover services, context, components and the registration flow.

## Installation and Running Locally

Requirements:

- Node.js 18 or above.
- npm.
- The Bluvi backend running locally, or a configured backend URL.

Installation:

```bash
npm install
```

Required environment variables:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Development:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Test Evidence

The project includes automated tests for services, shared context, UI components and the registration flow. This section is reserved for a test execution screenshot, useful for project presentation and technical review.

| Evidence | Screenshot |
| --- | --- |
| Automated test run | ![Bluvi automated test run](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1779791509/c8fd4838-365c-4901-83fe-f0ebc432359a.png) |

## Next Steps

- **Email verification during registration**: implement a complete email confirmation system within the sign-up flow. This feature was temporarily set aside due to limitations in the current deployment platform.
- **Individual chat atmospheres**: allow each conversation to have its own atmosphere state, adapting tone, rhythm and interface according to the context of the relationship between users.
- **Adaptive virtual assistant**: evolve the assistant so it can support the user and adjust the experience autonomously according to their needs, reducing friction and cognitive load.
- **Mutual consent for multimedia**: introduce an explicit authorisation system between both users before sensitive multimedia content can be shared in the chat.


---

Lovingly crafted by Julia 💞
