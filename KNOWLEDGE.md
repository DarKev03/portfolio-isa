# Project Knowledge

## Components
- `LanguageSelector.tsx` — botones EN/ES
- `NavBar.tsx` — navegación con Links + LanguageSelector
- `ProjectModal.tsx` — overlay de proyecto al hacer click
- `ProjectDetail.tsx` — contenido del modal
- `PageErrorBoundary.tsx` — reintento automático único por ruta ante errores de renderizado; si vuelve a fallar, ofrece volver al inicio. Los errores de carga asíncrona se gestionan por separado.

## Anotaciones
- Git: usar `git pull --rebase` + `git push --force-with-lease`; al rebasar, evitar vim con `GIT_EDITOR=true`.
- Build: `npx tsc -b`
- `ProjectsPage.tsx` >= 0bfee7f: combinar modal (onClick) con el diseño remoto (gap-8, skew `group-hover`, imagen hover derecha 40vw). NO volver a quitar esas clases.
- Cabecera unificada: Title y NavBar usan `fixed` con p-8 / top-0 right-0 pt-8 idéntico en AboutMe y ProjectsPage.
- Contacto: `NavBar` abre `ContactModal` sobre la página actual; el diálogo se cierra con botón, Escape o clic fuera. En MainPage, `onContactOpenChange` sincroniza la animación del título.
- Idioma: `LanguageProvider` comparte la selección entre rutas, la guarda en el navegador y utiliza español por defecto; no modifica las URL.
- Proyectos de Contentful: se solicitan todos los locales y se seleccionan los textos del idioma activo; los campos compartidos y archivos multimedia pueden usar `es`, sin sustituir traducciones de texto ausentes.
- Detalle de proyectos: se abre como diálogo sobre `/projects` sin cambiar la URL; las rutas antiguas con ID redirigen al listado.
- Texto de proyectos: cada separador horizontal de Contentful delimita un panel de media pantalla; texto e imágenes entre separadores conservan su orden y se adaptan al espacio.
- Sobre mí: una entrada `sobreMi` aporta el texto localizado (biografía, formación y experiencia) y hasta dos fotos compartidas, que transicionan en un mismo marco desde debajo del menú hasta la parte inferior al bajar; el CV se gestiona por separado. Cuando el contenido no cabe en la pantalla, la página crece y permite recorrerlo completo.

## Estructura
- React + react-router-dom
- Estilos: Tailwind CSS
- Tipografía: Castoro (serif)
