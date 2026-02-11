import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                {/* Agrega más rutas aquí conforme crezca el proyecto */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
