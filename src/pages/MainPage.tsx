import NavBar from "../components/NavBar";

const MainPage = () => {
    return (
        <div className="min-h-screen bg-[rgba(255,254,253,1)]">
            <NavBar />
            <div className="flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-blue-600 drop-shadow-lg mb-4">
                        Hola Tailwind CSS + Vite + React!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Este es el esqueleto de tu página principal con rutas configuradas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
