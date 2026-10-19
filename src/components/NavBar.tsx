import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

interface NavBarProps {
    onContactClick?: () => void;
}

const NavBar = ({ onContactClick }: NavBarProps) => {
    const castoroFamily = { fontFamily: "'Castoro', serif" };

    return (
        <nav className="flex flex-col items-center w-max">
            <div className="pb-14" style={{ ...castoroFamily }}>
                <LanguageSelector />
            </div>

            <ul className="flex flex-col gap-2 text-base" style={{ ...castoroFamily }}>
                <li>
                    <Link to="/aboutme" className="font-normal text-lg text-black">Sobre mí</Link>
                </li>
                <li>
                    <Link to="/projects" className="font-normal text-lg text-black">Proyectos</Link>
                </li>
                <li>
                    <p onClick={onContactClick} className="font-normal text-lg text-black cursor-pointer">Contacto</p>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;