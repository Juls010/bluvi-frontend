import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { WelcomeLayout } from '../layouts/WelcomeLayout';
import { RegisterLayout } from '../layouts/RegisterLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ChatLayout } from '../layouts/ChatLayout';

// Contexts
import { RegisterProvider } from '../context/RegisterContext';

// Pages
import { Welcome } from '../pages/Welcome/Welcome';
import { Login } from '../pages/Auth/Login';
import { NameStep } from '../pages/Register/NameStep';
import { AgeStep } from '../pages/Register/AgeStep';
import { GenderStep } from '../pages/Register/GenderStep';
import { SexualityStep } from '../pages/Register/SexualityStep';
import { NeurodivergenceStep } from '../pages/Register/NeurodivergenceStep';
import { CommunicationStyleStep } from '../pages/Register/CommunicationsStyleStep';
import { EmailStep } from '../pages/Register/EmailStep';
import { PhotoUploadStep } from '../pages/Register/PhotoUploadStep';
import { LocationStep } from '../pages/Register/LocationStep';
import { InterestsStep } from '../pages/Register/InterestsStep';
import { ProfileDescriptionStep } from '../pages/Register/ProfileDescriptionStep';
import { EmailVerificationStep } from '../pages/Register/EmailVerificationStep';
import { SafetyTipsStep } from '../pages/Register/SafetyTipsStep';
import { Home } from '../pages/App/Home';
import { Discovery } from '../pages/App/Discovery';
import { EventFlyer } from '../pages/App/EventFlyer';
import { Messages } from '../pages/Messages';
import { ChatDetail } from '../pages/ChatDetails';
import { ChatUserProfile } from '../pages/ChatUserProfile';
import { UserProfile } from '../pages/App/UserProfile';
import { Settings } from '../pages/Settings/Settings';
import PrivateRoute from '../components/PrivateRoute';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomeLayout />,
        children: [
            { index: true, element: <Welcome /> },
            { path: "login", element: <Login /> },
        ]
    },
    {
        path: "/register",
        element: (
            <RegisterProvider>
                <RegisterLayout />
            </RegisterProvider>
        ),
        children: [
            { path: "name", element: <NameStep /> },
            { path: "age", element: <AgeStep /> },
            { path: "gender", element: <GenderStep /> },
            { path: "sexuality", element: <SexualityStep /> },
            { path: "neurodivergence", element: <NeurodivergenceStep /> },
            { path: "communication", element: <CommunicationStyleStep /> },
            { path: "email", element: <EmailStep /> },
            { path: "photos", element: <PhotoUploadStep /> },
            { path: "location", element: <LocationStep /> },
            { path: "interests", element: <InterestsStep /> },
            { path: "description", element: <ProfileDescriptionStep /> },
            { path: "verificationemail", element: <EmailVerificationStep /> },
            { path: "safety-tips", element: <SafetyTipsStep /> },
        ]
    },
    {
        path: "/app",
        element: (
            <PrivateRoute>
                <AppLayout />
            </PrivateRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/app/home" replace /> },
            { path: "home", element: <Home />, handle: { topOffset: 'normal' } },
            { path: "events/:eventId", element: <EventFlyer />, handle: { topOffset: 'normal' } },
            { path: "discovery", element: <Discovery />, handle: { topOffset: 'normal' } },
            { path: "messages", element: <Messages />, handle: { topOffset: 'normal' } },
            { path: "profile", element: <UserProfile />, handle: { topOffset: 'normal' } },
            { path: "settings", element: <Settings />, handle: { topOffset: 'normal' } },
            { path: "user/:userId", element: <ChatUserProfile />, handle: { topOffset: 'compact' } },
        ]
    },
    {
        path: "/app/chat", 
        element: <ChatLayout />,
        children: [
            {
                path: ":id", 
                element: <ChatDetail />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);