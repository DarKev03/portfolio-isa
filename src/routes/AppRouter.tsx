import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ProjectsPage from '../pages/ProjectsPage';
import AboutMe from '../pages/AboutMe.tsx';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/aboutme" element={<AboutMe />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
