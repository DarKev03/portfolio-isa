import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/translations";

const NotFoundPage = () => {
    const text = useTranslation();
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center bg-[rgba(255,254,253,1)] p-8 text-center text-[#414141]"
            style={{ fontFamily: "'Castoro', serif" }}
        >
            <p>404</p>
            <h1 className="mt-2 text-2xl font-normal">{text.pageNotFound}</h1>
            <div className="mt-6 flex flex-wrap justify-center gap-6">
                <Link to="/" className="underline">{text.goHome}</Link>
                <Link to="/projects" className="underline">{text.goToProjects}</Link>
            </div>
        </main>
    );
};

export default NotFoundPage;
