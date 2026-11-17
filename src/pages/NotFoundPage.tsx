import { Link } from "react-router-dom";

const NotFoundPage = () => (
    <main
        className="flex min-h-screen flex-col items-center justify-center bg-[rgba(255,254,253,1)] p-8 text-center text-[#414141]"
        style={{ fontFamily: "'Castoro', serif" }}
    >
        <p>404</p>
        <h1 className="mt-2 text-2xl font-normal">Página no encontrada</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
            <Link to="/" className="underline">Ir a inicio</Link>
            <Link to="/projects" className="underline">Ir a proyectos</Link>
        </div>
    </main>
);

export default NotFoundPage;
