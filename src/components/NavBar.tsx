import { Link } from 'react-router-dom';

const NavBar = () => {
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    return (
        <nav className="p-4">
            <ul className="flex flex-col gap-2 text-base" style={{ ...castoroFamily, color: 'rgba(76, 76, 76, 0.6)' }}>
                <li>
                    <Link to="/" className="hover:text-gray-900 transition-colors">Sobre mí</Link>
                </li>
                <li>
                    <Link to="/projects" className="hover:text-gray-900 transition-colors">Proyectos</Link>
                </li>
                <li>
                    <Link to="/projects" className="hover:text-gray-900 transition-colors">Contacto</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;