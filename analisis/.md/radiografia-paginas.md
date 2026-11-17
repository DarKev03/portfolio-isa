# Radiografía de las páginas

Este documento describe la estructura y el comportamiento que se encuentran actualmente en la web. No propone cambios: sirve como mapa de rutas, contenidos, interacciones y dependencias entre páginas.

## Mapa de navegación

El enrutador está definido en [`src/routes/AppRouter.tsx`](../src/routes/AppRouter.tsx) con React Router:

| Ruta | Página | Propósito |
| --- | --- | --- |
| `/` | `MainPage` | Portada visual con lienzo de imágenes y acceso a contacto. |
| `/aboutme` | `AboutMe` | Presentación personal, biografía y experiencia. |
| `/projects` | `ProjectsPage` | Listado de proyectos con vista previa y detalle en modal. |
| `/projects/:id` | `ProjectDetailPage` | Página independiente para el detalle de un proyecto identificado por su ID. |

No hay una ruta de captura para direcciones que no coincidan con las anteriores.

## Elementos compartidos

- **Identidad:** `Title` presenta “(Isabel Faubel)” y enlaza a la portada en las páginas donde se configura como enlace.
- **Navegación:** `NavBar` muestra los controles `EN / ES` y los enlaces “Sobre mí” y “Proyectos”, además de “Contacto”.
- **Tipografía y estilo:** las páginas usan Castoro y una paleta clara con texto gris oscuro; los estilos se aplican principalmente mediante clases Tailwind.
- **Animación:** GSAP controla transiciones de la portada, la entrada del modal de proyecto y varios cambios durante el scroll de “Sobre mí”.
- **Contenido de proyectos:** [`src/assets/projects.json`](../src/assets/projects.json) contiene los datos que consumen el listado, el lienzo y los detalles. El contrato está en [`src/types/Project.ts`](../src/types/Project.ts); los bloques editoriales se describen en [`src/types/ContentBlock.ts`](../src/types/ContentBlock.ts).

## Radiografía por página

### Portada — `/`

Implementada en [`src/pages/MainPage.tsx`](../src/pages/MainPage.tsx).

- Ocupa la pantalla completa y sitúa `InfiniteCanvas` como fondo interactivo.
- El lienzo distribuye imágenes del contenido de proyectos en una cuadrícula que se puede desplazar con arrastre o rueda, con inercia tras arrastrar.
- Al iniciar, GSAP revela el fondo, el título y el lienzo. Una interacción de puntero o rueda hace aparecer el segundo estado del título y la navegación.
- “Contacto” activa una capa con los datos de contacto; al cerrarla se recupera el estado visual del título.
- Es la única página que pasa `onContactClick` a `NavBar`.

### Sobre mí — `/aboutme`

Implementada en [`src/pages/AboutMe.tsx`](../src/pages/AboutMe.tsx).

- Presenta una biografía y una sección de formación/experiencia dentro de una composición de altura extendida y una zona fija.
- El scroll, mediante GSAP y ScrollTrigger, desplaza la composición: oculta la navegación y el título, cambia las imágenes y revela sucesivamente la biografía, la experiencia y el pie de página.
- Incluye accesos visuales a LinkedIn, Instagram y correo, además de la mención “(download CV)”.
- El título enlaza a la portada y la navegación permite ir a las páginas de información y proyectos.

### Proyectos — `/projects`

Implementada en [`src/pages/ProjectsPage.tsx`](../src/pages/ProjectsPage.tsx).

- Genera el listado a partir de `projects.json`; cada elemento muestra título, etiquetas, número y año.
- Al pasar el puntero por un proyecto aparece su imagen de vista previa (`ProjectPreview`). También hay un vídeo de invitación asociado al primer hover de la sesión.
- Al seleccionar un proyecto se abre `ProjectModal`, que presenta `ProjectDetail` sobre el listado. Desde el detalle se puede cerrar o avanzar/retroceder entre los proyectos; la navegación del modal recorre la lista circularmente.
- La barra de navegación se desvanece mientras el modal está abierto.
- El listado modal no cambia la URL: es una interacción distinta de la ruta `/projects/:id`.

### Detalle de proyecto — `/projects/:id`

Implementada en [`src/pages/ProjectDetailPage.tsx`](../src/pages/ProjectDetailPage.tsx).

- Busca el proyecto cuyo `id` coincide con el parámetro numérico de la URL.
- Si no encuentra coincidencia, muestra “Proyecto no encontrado” y un enlace de regreso a `/projects`.
- Si lo encuentra, presenta una cabecera con enlaces a la lista y a los IDs anterior/siguiente, y un carrusel horizontal desplazable con Embla.
- Los bloques de contenido pueden combinar imagen y texto (`text-image`, `image-text`) o mostrar una imagen completa (`image-full`).
- Esta página es independiente: no utiliza la barra de navegación general ni el modal del listado.

## Modelo de contenido

Cada proyecto contiene identificador, título, descripción, etiquetas, imagen principal, año y una lista opcional de bloques editoriales. El JSON actual incluye cinco proyectos: Lazos, Malmö, Por si a caso, Coia y Señaletica.

El tipo `BlockType` también declara `double-image`, pero los dos renderizadores de detalle solo muestran `text-image`, `image-text` e `image-full`. Por tanto, un bloque `double-image` no produciría contenido visible con la implementación actual.

## Límites observables en la implementación

- El selector `EN / ES` cambia su estado visual, pero no cambia el idioma del contenido ni de la navegación.
- “Contacto” tiene un controlador en la portada; en “Sobre mí” y “Proyectos” el componente de navegación no recibe ese controlador.
- “(download CV)” está presentado como texto, sin un enlace o acción de descarga.
- El modal de contacto se dibuja con `pointer-events-none`; aunque el contenedor define un `onClick`, esa capa no recibe normalmente los clics del usuario.
- En la página de detalle, los controles de anterior/siguiente calculan `id - 1` e `id + 1`; a diferencia del modal, no recorren circularmente la lista. Si no existe ese ID, se presenta el estado de proyecto no encontrado.
- El contenido de imagen del JSON utiliza actualmente URLs externas de `picsum.photos`.

## Archivos de referencia

- Rutas: [`src/routes/AppRouter.tsx`](../src/routes/AppRouter.tsx)
- Portada: [`src/pages/MainPage.tsx`](../src/pages/MainPage.tsx)
- Sobre mí: [`src/pages/AboutMe.tsx`](../src/pages/AboutMe.tsx)
- Listado: [`src/pages/ProjectsPage.tsx`](../src/pages/ProjectsPage.tsx)
- Detalle por URL: [`src/pages/ProjectDetailPage.tsx`](../src/pages/ProjectDetailPage.tsx)
- Datos: [`src/assets/projects.json`](../src/assets/projects.json)
- Tipos: [`src/types/Project.ts`](../src/types/Project.ts) y [`src/types/ContentBlock.ts`](../src/types/ContentBlock.ts)
