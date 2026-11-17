import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ContactModal from './ContactModal';
import LanguageSelector from './LanguageSelector';

interface NavBarProps {
    onContactOpenChange?: (isOpen: boolean) => void;
}

const NavBar = ({ onContactOpenChange }: NavBarProps) => {
    const castoroFamily = { fontFamily: "'Castoro', serif" };
    const [isContactOpen, setIsContactOpen] = useState(false);
    const contactButtonRef = useRef<HTMLButtonElement>(null);

    const changeContactOpen = (isOpen: boolean) => {
        setIsContactOpen(isOpen);
        onContactOpenChange?.(isOpen);
    };

    return (
        <nav className="flex flex-col items-end w-max">
            <div className="pb-14" style={{ ...castoroFamily }}>
                <LanguageSelector />
            </div>

            <ul className="flex flex-col gap-2 text-base text-right" style={{ ...castoroFamily }}>
                <li>
                    <Link to="/aboutme" className="font-normal text-md text-black">Sobre mí</Link>
                </li>
                <li>
                    <Link to="/projects" className="font-normal text-md text-black">Proyectos</Link>
                </li>
                <li>
                    <button
                        ref={contactButtonRef}
                        type="button"
                        onClick={() => changeContactOpen(true)}
                        className="font-normal text-md text-black cursor-pointer"
                        aria-haspopup="dialog"
                    >
                        Contacto
                    </button>
                </li>
            </ul>
            {isContactOpen && createPortal(
                <ContactModal onClose={() => changeContactOpen(false)} returnFocusRef={contactButtonRef} />,
                document.body
            )}
        </nav>
    );
};

export default NavBar;
