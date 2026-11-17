import { useLanguage } from "./languageContext";

const es = {
    about: "Sobre mí",
    projects: "Proyectos",
    contact: "Contacto",
    gallery: "Galería de proyectos",
    galleryInstructions: "Usa las flechas del teclado para desplazarte por la galería.",
    loadingGallery: "Cargando galería…",
    unavailableGallery: "La galería aún no está publicada.",
    galleryLoadError: "No se pudo cargar la galería. Comprueba la conexión y la configuración de Contentful.",
    galleryMediaError: "No se pudieron cargar o reproducir algunos archivos de la galería. Comprueba su publicación, formato y conexión.",
    pauseGalleryVideos: "Pausar vídeos de la galería",
    playGalleryVideos: "Reproducir vídeos de la galería",
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
    gallery: "Project gallery",
    galleryInstructions: "Use the arrow keys to move around the gallery.",
    loadingGallery: "Loading gallery…",
    unavailableGallery: "The gallery has not been published yet.",
    galleryLoadError: "Could not load the gallery. Check your connection and Contentful configuration.",
    galleryMediaError: "Some gallery files could not be loaded or played. Check their publication status, format and connection.",
    pauseGalleryVideos: "Pause gallery videos",
    playGalleryVideos: "Play gallery videos",
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
