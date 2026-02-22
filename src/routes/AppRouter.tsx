import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ProjectsPage from '../pages/ProjectsPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
