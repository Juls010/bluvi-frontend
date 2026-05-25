import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";


import { WelcomeLayout } from '../layouts/WelcomeLayout';
import { RegisterLayout } from '../layouts/RegisterLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ChatLayout } from '../layouts/ChatLayout';
import { PublicThemeScope, PrivateThemeScope } from '../layouts/ThemeScopes';
import LegalLayout from '../layouts/LegalLayout';


import { RegisterProvider } from '../context/RegisterContext';

import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import PrivacyPolicy from '../pages/Privacy/PrivacyPolicy';
import CookiePolicy from '../pages/Privacy/CookiesPolicy';
import Accessibility from '../pages/Privacy/Accessibility';
import LegalNotice from '../pages/Privacy/LegalNotice';
import FAQ from '../pages/Privacy/FAQ';

const WelcomePage = lazy(() => import('../pages/Welcome/Welcome').then((m) => ({ default: m.Welcome })));
const LoginPage = lazy(() => import('../pages/Auth/Login').then((m) => ({ default: m.Login })));
const NameStepPage = lazy(() => import('../pages/Register/NameStep').then((m) => ({ default: m.NameStep })));
const AgeStepPage = lazy(() => import('../pages/Register/AgeStep').then((m) => ({ default: m.AgeStep })));
const GenderStepPage = lazy(() => import('../pages/Register/GenderStep').then((m) => ({ default: m.GenderStep })));
const SexualityStepPage = lazy(() => import('../pages/Register/SexualityStep').then((m) => ({ default: m.SexualityStep })));
const NeurodivergenceStepPage = lazy(() => import('../pages/Register/NeurodivergenceStep').then((m) => ({ default: m.NeurodivergenceStep })));
const CommunicationStyleStepPage = lazy(() => import('../pages/Register/CommunicationsStyleStep').then((m) => ({ default: m.CommunicationStyleStep })));
const EmailStepPage = lazy(() => import('../pages/Register/EmailStep').then((m) => ({ default: m.EmailStep })));
const PhotoUploadStepPage = lazy(() => import('../pages/Register/PhotoUploadStep').then((m) => ({ default: m.PhotoUploadStep })));
const LocationStepPage = lazy(() => import('../pages/Register/LocationStep').then((m) => ({ default: m.LocationStep })));
const InterestsStepPage = lazy(() => import('../pages/Register/InterestsStep').then((m) => ({ default: m.InterestsStep })));
const ProfileDescriptionStepPage = lazy(() => import('../pages/Register/ProfileDescriptionStep').then((m) => ({ default: m.ProfileDescriptionStep })));
const EmailVerificationStepPage = lazy(() => import('../pages/Register/EmailVerificationStep').then((m) => ({ default: m.EmailVerificationStep })));
const SafetyTipsStepPage = lazy(() => import('../pages/Register/SafetyTipsStep').then((m) => ({ default: m.SafetyTipsStep })));
const HomePage = lazy(() => import('../pages/App/Home').then((m) => ({ default: m.Home })));
const DiscoveryPage = lazy(() => import('../pages/App/Discovery').then((m) => ({ default: m.Discovery })));
const EventFlyerPage = lazy(() => import('../pages/App/EventFlyer').then((m) => ({ default: m.EventFlyer })));
const MessagesPage = lazy(() => import('../pages/Messages').then((m) => ({ default: m.Messages })));
const ChatDetailPage = lazy(() => import('../pages/ChatDetails').then((m) => ({ default: m.ChatDetail })));
const ChatUserProfilePage = lazy(() => import('../pages/ChatUserProfile').then((m) => ({ default: m.ChatUserProfile })));
const UserProfilePage = lazy(() => import('../pages/App/UserProfile').then((m) => ({ default: m.UserProfile })));
const SettingsPage = lazy(() => import('../pages/Settings/Settings').then((m) => ({ default: m.Settings })));
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const ReportsAndBlocksPage = lazy(() => import('../pages/Settings/ReportsAndBlocks').then(m => ({ default: m.ReportsAndBlocks })));
const withSuspense = (element: React.ReactNode) => (
    <Suspense fallback={<div className="min-h-screen w-full bg-app-gradient" />}>
        {element}
    </Suspense>
);

const withRegisterSuspense = (element: React.ReactNode) => (
    <Suspense fallback={<div className="h-[100dvh] min-h-[100svh] w-full bg-bluvi-gradient" />}>
        {element}
    </Suspense>
);

const withLegalLayout = (element: React.ReactNode) => (
    <PublicThemeScope>
        <LegalLayout>
            {element}
        </LegalLayout>
    </PublicThemeScope>
);

export const router = createBrowserRouter([
    {
        path: "/privacidad",
        element: withLegalLayout(<PrivacyPolicy />)
    },
    {
        path: "/faq",
        element: withLegalLayout(<FAQ />)
    },
    {
        path: "/cookies",
        element: withLegalLayout(<CookiePolicy />)
    },
    {
        path: "/accesibilidad",
        element: withLegalLayout(<Accessibility />)
    },
    {
        path: "/legal",
        element: withLegalLayout(<LegalNotice />)
    },
    {
        path: "/terminos",
        element: withLegalLayout(<LegalNotice />)
    },
    {
        path: "/",
        element: (
            <PublicThemeScope>
                <WelcomeLayout />
            </PublicThemeScope>
        ),
        children: [
            { index: true, element: withSuspense(<WelcomePage />) },
            { path: "login", element: withSuspense(<LoginPage />) },
        ]
    },
    {
        path: "/register",
        element: (
            <PublicThemeScope>
                <RegisterProvider>
                    <RegisterLayout />
                </RegisterProvider>
            </PublicThemeScope>
        ),
        children: [
            { path: "name", element: withRegisterSuspense(<NameStepPage />) },
            { path: "age", element: withRegisterSuspense(<AgeStepPage />) },
            { path: "gender", element: withRegisterSuspense(<GenderStepPage />) },
            { path: "sexuality", element: withRegisterSuspense(<SexualityStepPage />) },
            { path: "neurodivergence", element: withRegisterSuspense(<NeurodivergenceStepPage />) },
            { path: "communication", element: withRegisterSuspense(<CommunicationStyleStepPage />) },
            { path: "email", element: withRegisterSuspense(<EmailStepPage />) },
            { path: "photos", element: withRegisterSuspense(<PhotoUploadStepPage />) },
            { path: "location", element: withRegisterSuspense(<LocationStepPage />) },
            { path: "interests", element: withRegisterSuspense(<InterestsStepPage />) },
            { path: "description", element: withRegisterSuspense(<ProfileDescriptionStepPage />) },
            { path: "verificationemail", element: withRegisterSuspense(<EmailVerificationStepPage />) },
            { path: "safety-tips", element: withRegisterSuspense(<SafetyTipsStepPage />) },
        ]
    },
    {
        path: "/app",
        element: (
            <PrivateThemeScope>
                <PrivateRoute>
                    <AppLayout />
                </PrivateRoute>
            </PrivateThemeScope>
        ),
        children: [
            { index: true, element: <Navigate to="/app/home" replace /> },
            { path: "home", element: withSuspense(<HomePage />), handle: { topOffset: 'normal' } },
            { path: "events/:eventId", element: withSuspense(<EventFlyerPage />), handle: { topOffset: 'normal' } },
            { path: "discovery", element: withSuspense(<DiscoveryPage />), handle: { topOffset: 'compact' } },
            { path: "messages", element: withSuspense(<MessagesPage />), handle: { topOffset: 'normal' } },
            { path: "profile", element: withSuspense(<UserProfilePage />), handle: { topOffset: 'compactMobileLooseDesktop' } },
            { path: "settings", element: withSuspense(<SettingsPage />), handle: { topOffset: 'normal' } },
            { path: "settings/reports-blocks", element: withSuspense(<ReportsAndBlocksPage />), handle: { topOffset: 'normal' } },
            { path: "user/:userId", element: withSuspense(<ChatUserProfilePage />), handle: { topOffset: 'compact' } },
        ]
    },
    {
        path: "/app/chat", 
        element: (
            <PrivateThemeScope>
                <PrivateRoute>
                    <ChatLayout />
                </PrivateRoute>
            </PrivateThemeScope>
        ),
        children: [
            {
                path: ":id", 
                element: withSuspense(<ChatDetailPage />)
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <PrivateThemeScope>
                <AdminRoute>
                    {withSuspense(<AdminDashboardPage />)}
                </AdminRoute>
            </PrivateThemeScope>
        )
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);
