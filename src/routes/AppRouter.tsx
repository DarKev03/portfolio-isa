import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ProjectsPage from '../pages/ProjectsPage';
import AboutMe from '../pages/AboutMe.tsx';
import NotFoundPage from '../pages/NotFoundPage';
import PageErrorBoundary from '../components/PageErrorBoundary';
import { useTranslation } from '../i18n/translations';

const PageRoutes = () => {
    const { pathname } = useLocation();
    const text = useTranslation();

    return (
        <PageErrorBoundary pathname={pathname} text={text}>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/aboutme" element={<AboutMe />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
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
