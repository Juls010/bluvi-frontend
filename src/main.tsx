import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'

// AUTH
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// PÁGINAS PÚBLICAS
import { WelcomeLayout } from './layouts/WelcomeLayout'
import { Welcome } from './pages/Welcome/Welcome'
import { Intro } from './pages/Welcome/Intro'
import { Landing } from './pages/Welcome/Landing'
import { Login } from './pages/Auth/Login'

// REGISTER
import { RegisterLayout } from './layouts/RegisterLayout'
import { RegisterProvider } from './context/RegisterContext'
import { NameStep } from './pages/Register/NameStep'
import { AgeStep } from './pages/Register/AgeStep'
import { GenderStep } from './pages/Register/GenderStep'
import { SexualityStep } from './pages/Register/SexualityStep'
import { NeurodivergenceStep } from './pages/Register/NeurodivergenceStep'
import { CommunicationStyleStep } from './pages/Register/CommunicationsStyleStep'
import { EmailStep } from './pages/Register/EmailStep'
import { PhotoUploadStep } from './pages/Register/PhotoUploadStep'
import { LocationStep } from './pages/Register/LocationStep'
import { InterestsStep } from './pages/Register/InterestsStep'
import { ProfileDescriptionStep } from './pages/Register/ProfileDescriptionStep'
import { EmailVerificationStep } from './pages/Register/EmailVerificationStep'
import { SafetyTipsStep } from './pages/Register/SafetyTipsStep'

// APP PRIVADA
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/App/Home'
import { Discovery } from './pages/App/Discovery'
import { Messages } from './pages/Messages'
import { ChatDetail } from './pages/ChatDetails'
import { ChatLayout } from './layouts/ChatLayout'
import { UserProfile } from './pages/App/UserProfile'

// ─── Rutas animadas ───────────────────────────────────────────────────────────

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/* ZONA PÚBLICA */}
                <Route element={<WelcomeLayout />}>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/intro" element={<Intro />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* ZONA REGISTER */}
                <Route path="/register" element={
                    <RegisterProvider>
                        <RegisterLayout />
                    </RegisterProvider>
                }>
                    <Route path="name" element={<NameStep />} />
                    <Route path="age" element={<AgeStep />} />
                    <Route path="gender" element={<GenderStep />} />
                    <Route path="sexuality" element={<SexualityStep />} />
                    <Route path="neurodivergence" element={<NeurodivergenceStep />} />
                    <Route path="communication" element={<CommunicationStyleStep />} />
                    <Route path="email" element={<EmailStep />} />
                    <Route path="photos" element={<PhotoUploadStep />} />
                    <Route path="location" element={<LocationStep />} />
                    <Route path="interests" element={<InterestsStep />} />
                    <Route path="description" element={<ProfileDescriptionStep />} />
                    <Route path="verificationemail" element={<EmailVerificationStep />} />
                    <Route path="safety-tips" element={<SafetyTipsStep />} />
                </Route>

                {/* ZONA APP — protegida */}
                <Route path="/app" element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="/app/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="discovery" element={<Discovery />} />
                    <Route path="messages" element={<Messages />} />
                    {/* UserProfile carga sus propios datos desde la API — no necesita props */}
                    <Route path="profile" element={<UserProfile />} />
                </Route>

                <Route element={<ChatLayout />}>
                    <Route path="/app/chat/:id" element={<ChatDetail />} />
                </Route>

                {/* REDIRECCIÓN POR DEFECTO */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </AnimatePresence>
    );
};

// ─── Entry point ──────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AnimatedRoutes />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);