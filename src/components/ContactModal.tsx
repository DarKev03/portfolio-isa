import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { useTranslation } from "../i18n/translations";
import { useReducedMotion } from "./useReducedMotion";

interface ContactModalProps {
    onClose: () => void;
    returnFocusRef: RefObject<HTMLButtonElement | null>;
}

const ContactModal = ({ onClose, returnFocusRef }: ContactModalProps) => {
    const text = useTranslation();
    const reducedMotion = useReducedMotion();
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        modal.showModal();
        const animation = gsap.fromTo(modal, { opacity: reducedMotion ? 1 : 0 }, {
            opacity: 1,
            duration: reducedMotion ? 0 : 0.5,
            ease: "power2.out",
        });
        return () => {
            animation.kill();
            modal.close();
            returnFocusRef.current?.focus();
        };
    }, [returnFocusRef, reducedMotion]);

    return (
        <dialog
            ref={modalRef}
            aria-labelledby="contact-title"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    onClose();
                }
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            className="fixed inset-0 m-0 h-screen max-h-none w-screen max-w-none border-0 bg-[linear-gradient(to_bottom,#FFFEFD_0%,#FFFEFD_33.333%,rgba(255,255,255,0)_100%)] p-0 backdrop:bg-transparent"
        >
            <h2 id="contact-title" className="sr-only">{text.contact}</h2>
            <button
                type="button"
                onClick={onClose}
                className="absolute right-8 top-8 cursor-pointer italic text-[#414141] hover:text-black"
                style={{ fontFamily: "'Castoro', serif" }}
            >
                ( {text.close} )
            </button>
            <div
                className="absolute left-0 flex flex-col p-8 italic text-[#414141] font-normal text-md"
                style={{ fontFamily: "'Castoro', serif" }}
            >
                <p>LinkedIn</p>
                <p>Instagram</p>
                <p>(i.fuabel.minguez@gmail.es)</p>
            </div>
        </dialog>
    );
};

export default ContactModal;