import { useRef } from "react";

interface ProjectModalProps {
    onClose: () => void;
}

const ContactModal = ({ onClose }: ProjectModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={modalRef}
            onClick={onClose}
            className="fixed inset-0 pointer-events-none w-screen h-screen bg-[linear-gradient(to_bottom,#FFFEFD_0%,#FFFEFD_33.333%,rgba(255,255,255,0)_100%)]"
        >
            <div
                className="fixed left-0 flex flex-col z-50 pointer-events-none p-8 italic"
            >
                <p>LinkedIn</p>
                <p>Instagram</p>
                <p>(i.fuabel.minguez@gmail.es)</p>
            </div>
        </div>
    );
};

export default ContactModal;