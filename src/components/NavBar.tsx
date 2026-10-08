import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const NavBar = () => {
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    return (
        <nav className="flex flex-col items-center w-max">
            <div className="pb-14" style={{ ...castoroFamily }}>
                <LanguageSelector />
            </div>

            <ul className="flex flex-col gap-2 text-base" style={{ ...castoroFamily}}>
                <li>
                    <Link to="/aboutme" className="font-normal text-lg text-black">Sobre mí</Link>
                </li>
                <li>
                    <Link to="/projects" className="font-normal text-lg text-black">Proyectos</Link>
                </li>
                <li>
                    <Link to="/projects" className="font-normal text-lg text-black">Contacto</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;