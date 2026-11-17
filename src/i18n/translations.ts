import { useLanguage } from "./languageContext";

const es = {
    about: "Sobre mí",
    projects: "Proyectos",
    contact: "Contacto",
    close: "cerrar",
    previous: "atrás",
    next: "siguiente",
    downloadCv: "descargar CV",
    loadingCv: "Cargando CV…",
    unavailableCv: "CV no publicado en este idioma.",
    cvLoadError: "No se pudo cargar el CV. Comprueba la conexión y la configuración de Contentful.",
    cvDownloadError: "No se pudo descargar el CV. Inténtalo de nuevo.",
    loadingProjects: "Cargando proyectos…",
    noProjects: "No hay proyectos publicados.",
    projectLoadError: "No se pudieron cargar los proyectos. Comprueba la conexión y la configuración de Contentful.",
    projectNotFound: "Proyecto no encontrado",
    backToProjects: "Volver a proyectos",
    pageNotFound: "Página no encontrada",
    goHome: "Ir a inicio",
    goToProjects: "Ir a proyectos",
    pageError: "No se pudo mostrar la página",
    pageErrorDetails: "Se ha producido un error incluso después de volver a intentarlo.",
    backHome: "Volver al inicio",
    retryingPage: "Reintentando mostrar la página…",
    loadingAbout: "Cargando información sobre mí…",
    unavailableAbout: "La información sobre mí aún no está publicada.",
    aboutLoadError: "No se pudo cargar la información sobre mí. Comprueba la conexión y la configuración de Contentful.",
} as const;

const en: Record<keyof typeof es, string> = {
    about: "About me",
    projects: "Projects",
    contact: "Contact",
    close: "close",
    previous: "previous",
    next: "next",
    downloadCv: "download CV",
    loadingCv: "Loading CV…",
    unavailableCv: "CV not published in this language.",
    cvLoadError: "Could not load the CV. Check your connection and Contentful configuration.",
    cvDownloadError: "Could not download the CV. Please try again.",
    loadingProjects: "Loading projects…",
    noProjects: "No projects have been published.",
    projectLoadError: "Could not load projects. Check your connection and Contentful configuration.",
    projectNotFound: "Project not found",
    backToProjects: "Back to projects",
    pageNotFound: "Page not found",
    goHome: "Go to home",
    goToProjects: "Go to projects",
    pageError: "Could not display the page",
    pageErrorDetails: "An error occurred even after retrying.",
    backHome: "Back to home",
    retryingPage: "Retrying the page…",
    loadingAbout: "Loading about me…",
    unavailableAbout: "About me information has not been published yet.",
    aboutLoadError: "Could not load the about me information. Check your connection and Contentful configuration.",
};

const translations = { es, en };

export type Translations = Record<keyof typeof es, string>;

export function useTranslation(): Translations {
    return translations[useLanguage().language];
}
