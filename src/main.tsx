import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// PAGINAS PÚBLICAS
import { Welcome } from './pages/Welcome'
import { Intro } from './pages/Intro'
import { Landing } from './pages/Landing'

// REGISTER
import { RegisterLayout } from './layouts/RegisterLayout';
import { RegisterProvider } from './context/RegisterContext';
import { NameStep } from './pages/Register/NameStep'; 
import { AgeStep } from './pages/Register/AgeStep'
import { GenderStep } from './pages/Register/GenderStep'
import { SexualityStep } from './pages/Register/SexualityStep'
import { NeurodivergenceStep } from './pages/Register/NeurodivergenceStep'
import { CommunicationStyleStep } from './pages/Register/CommunicationsStyleStep' 
import { EmailStep } from './pages/Register/EmailStep'
import { DocumentStep } from './pages/Register/DocumentStep'
import { PhotoUploadStep } from './pages/Register/PhotoUploadStep'
import { LocationStep } from './pages/Register/LocationStep'
import { InterestsStep } from './pages/Register/InterestsStep'
import { ProfileDescriptionStep } from './pages/Register/ProfileDescriptionStep'
import { SafetyTipsStep } from './pages/Register/SafetyTipsStep'


// APP PRIVADA
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/App/Home'
import { Discovery } from './pages/App/Discovery';
import { Messages } from './pages/Messages';
import { ChatDetail } from './pages/ChatDetails'
import { ChatLayout } from './layouts/ChatLayout'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* --- ZONA 1: PÚBLICA --- */}
        <Route path="/" element={<Welcome />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/landing" element={<Landing />} />

        {/* --- ZONA 2: REGISTRO --- */}
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
            <Route path="safety-tips" element={<SafetyTipsStep />} />

            {/* <Route path="document" element={<DocumentStep />} /> */} 
        </Route> 
        


        {/* --- ZONA 3: APLICACIÓN (USUARIO LOGUEADO) --- */}

        <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="messages" element={<Messages />} />
            {/* <Route path="chats" element={<Chats />} /> */}
            {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
        
        <Route element={<ChatLayout />} >
          <Route path="/app/chat/:id" element={<ChatDetail />} />
        </Route>
        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)