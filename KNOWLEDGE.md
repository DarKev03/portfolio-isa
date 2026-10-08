# Project Knowledge

## Components
- `LanguageSelector.tsx` — botones EN/ES
- `NavBar.tsx` — navegación con Links + LanguageSelector
- `ProjectModal.tsx` — overlay de proyecto al hacer click
- `ProjectDetail.tsx` — contenido del modal

## Anotaciones
- Git: usar `git pull --rebase` + `git push --force-with-lease`; al rebasar, evitar vim con `GIT_EDITOR=true`.
- Build: `npx tsc -b`
- `ProjectsPage.tsx` >= 0bfee7f: combinar modal (onClick) con el diseño remoto (gap-8, skew `group-hover`, imagen hover derecha 40vw). NO volver a quitar esas clases.
- Cabecera unificada: Title y NavBar usan `fixed` con p-8 / top-0 right-0 pt-8 idéntico en AboutMe y ProjectsPage.

## Estructura
- React + react-router-dom
- Estilos: Tailwind CSS
- Tipografía: Castoro (serif)
