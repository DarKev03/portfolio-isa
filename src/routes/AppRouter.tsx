import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageErrorBoundary from '../components/PageErrorBoundary';
import { useTranslation } from '../i18n/translations';

const MainPage = lazy(() => import('../pages/MainPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const AboutMe = lazy(() => import('../pages/AboutMe'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PageRoutes = () => {
    const { pathname } = useLocation();
    const text = useTranslation();

    return (
        <PageErrorBoundary pathname={pathname} text={text}>
            <Suspense fallback={<p role="status" className="p-8">{text.loadingPage}</p>}>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/aboutme" element={<AboutMe />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<Navigate to="/projects" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </PageErrorBoundary>
    );
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <PageRoutes />
        </BrowserRouter>
    );
};

export default AppRouter;
