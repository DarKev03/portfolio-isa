# Informe de arquitectura y checklist de estructura

## 1. Alcance

Revisión estática de la estructura React/TypeScript del repositorio y comprobaciones puntuales de rutas en `http://localhost:5173/`. No se modificó código. La revisión no es una auditoría de seguridad ni una certificación de calidad, rendimiento o accesibilidad.

## 2. Estructura actual

```text
src/
  main.tsx                 # Arranque React, StrictMode y CSS global
  App.tsx                  # Entrada de aplicación
  routes/
    AppRouter.tsx          # BrowserRouter y definición de rutas
  pages/
    MainPage.tsx           # Portada
    AboutMe.tsx             # Página “Sobre mí”
    ProjectsPage.tsx        # Listado y modal
    ProjectDetailPage.tsx   # Detalle por URL
  components/
    ContactModal.tsx
    InfiniteCanvas.tsx
    LanguageSelector.tsx
    NavBar.tsx
    ProjectDetail.tsx
    ProjectModal.tsx
    ProjectPreview.tsx
    Title.tsx
  types/
    ContentBlock.ts
    Image.ts
    Project.ts
  assets/
    projects.json
    fonts/
    videos/
```

La separación `routes` / `pages` / `components` / `types` / `assets` es comprensible y adecuada para el tamaño actual. No se recomienda mover carpetas solo por anticipación. Las mejoras deben centrarse primero en contratos, errores, accesibilidad y responsabilidades que ya se duplican.

## 3. Flujo de arranque y enrutamiento

1. [`src/main.tsx`](../src/main.tsx) importa estilos globales, monta React en `#root` y habilita `StrictMode`.
2. [`src/App.tsx`](../src/App.tsx) delega a `AppRouter`; su sencillez es apropiada.
3. [`src/routes/AppRouter.tsx`](../src/routes/AppRouter.tsx) declara `BrowserRouter` y cuatro rutas: `/`, `/aboutme`, `/projects` y `/projects/:id`.

### Hallazgos de rutas

- No hay ruta comodín `*`. La navegación a `/url-inexistente` se comprobó en local: el cuerpo queda vacío y React Router registra “No routes matched location”.
- El detalle por URL muestra “Proyecto no encontrado” para un ID que no encuentra, pero los controles anterior/siguiente construyen IDs mediante `id - 1` y `id + 1`. Esto presupone IDs consecutivos y no tiene el mismo comportamiento circular del modal.
- No se observa un límite global de errores de React ni una interfaz de error de aplicación.
- El navegador local permite abrir las rutas probadas directamente. No se verificó la configuración de rutas profundas en el alojamiento de producción.
- Los imports de algunas páginas incluyen extensión `.tsx` y otros no; es una inconsistencia menor, no el problema prioritario.

## 4. Inventario de páginas y componentes

### Páginas

| Archivo | Responsabilidad actual | Observación de estructura |
| --- | --- | --- |
| [`MainPage.tsx`](../src/pages/MainPage.tsx) | Coordina lienzo, dos estados de título, animaciones GSAP, navegación y modal de contacto. | Lleva estado y efectos visuales de varias zonas; conviene conservar la composición en la página, pero revisar limpieza de timelines y acceso por teclado. |
| [`AboutMe.tsx`](../src/pages/AboutMe.tsx) | Contiene biografía, experiencia, contacto, imágenes y animaciones ligadas al scroll. | El contenido editorial y la lógica de ScrollTrigger comparten un archivo extenso; valorar extracción de secciones solo si aclara responsabilidades o facilita su edición. |
| [`ProjectsPage.tsx`](../src/pages/ProjectsPage.tsx) | Lee JSON, presenta lista, hover, vídeo, selección de proyecto y modal. | Concentra datos y coordinación de interacciones; el `div` clicable de cada proyecto no tiene semántica de control. |
| [`ProjectDetailPage.tsx`](../src/pages/ProjectDetailPage.tsx) | Resuelve `:id`, muestra cabecera y carrusel horizontal de bloques. | Repite el renderizado de bloques que también existe en `ProjectDetail.tsx`. |

### Componentes

| Componente | Responsabilidad actual | Observación |
| --- | --- | --- |
| [`Title.tsx`](../src/components/Title.tsx) | Rótulo de identidad. | Presentacional y simple. |
| [`NavBar.tsx`](../src/components/NavBar.tsx) | Selector de idioma y enlaces a páginas/contacto. | “Contacto” es un `<p>` con `onClick` opcional: no es un control semántico y no tiene acción en páginas que no pasan el callback. |
| [`LanguageSelector.tsx`](../src/components/LanguageSelector.tsx) | Cambia estado local de EN/ES y estilo activo. | El estado no se comparte ni traduce contenido; el componente aparenta una función de idioma que no está conectada a i18n. |
| [`InfiniteCanvas.tsx`](../src/components/InfiniteCanvas.tsx) | Genera y desplaza una cuadrícula de imágenes usando gestos, rueda, inercia y `ResizeObserver`. | Componente de comportamiento complejo, pero con una responsabilidad reconocible. No extraer más capas salvo que haga falta probar o reutilizar la lógica. |
| [`ProjectPreview.tsx`](../src/components/ProjectPreview.tsx) | Vista previa de imagen para hover. | Unidad presentacional coherente. |
| [`ProjectModal.tsx`](../src/components/ProjectModal.tsx) | Overlay animado que aloja el detalle modal. | Su cierre depende de eventos de clic propagados desde el contenido; se debe acordar y probar dónde debe cerrarse. |
| [`ProjectDetail.tsx`](../src/components/ProjectDetail.tsx) | Contenido editorial del proyecto en el modal, con carrusel y botones. | Duplica el `switch` de tipos de bloque de la ruta independiente. El contenedor también cierra al hacer clic, lo que puede cerrar al interactuar con el contenido. |
| [`ContactModal.tsx`](../src/components/ContactModal.tsx) | Capa de contacto de la portada. | La interfaz de props se llama `ProjectModalProps` y su raíz tiene `pointer-events-none`; conviene corregir el contrato/flujo si se cambia este componente. |

## 5. Datos y tipos

- [`Project.ts`](../src/types/Project.ts) define el contrato de proyecto; [`projects.json`](../src/assets/projects.json) contiene cinco entradas.
- [`ContentBlock.ts`](../src/types/ContentBlock.ts) declara `text-image`, `image-text`, `image-full` y `double-image`; los detalles no renderizan `double-image`.
- El JSON estático se convierte mediante `as Project[]`. La aserción ayuda al consumo de TypeScript, pero no valida el contenido en tiempo de ejecución. Si los datos se mueven a CMS/API, validar el límite de entrada.
- [`Image.ts`](../src/types/Image.ts) declara una interfaz que no aparece referenciada en el código fuente consultado. Confirmar uso antes de eliminarla.
- En las búsquedas de `src`, no aparecen usos de `@tanstack/react-virtual` ni `react-infinite-canvas`, pese a estar declaradas en [`package.json`](../package.json). Confirmar referencias en todo el proyecto y necesidad antes de considerar limpieza de dependencias.
- Las imágenes actuales del JSON son URLs externas de `picsum.photos`; el archivo de proyecto también almacena texto y metadatos junto a la presentación estática.

## 6. Resultados de navegación local

Comprobación manual automatizada en el servidor local, no en producción:

| Ruta | Resultado observado |
| --- | --- |
| `/` | Renderiza la portada. Tras esperar 2,5 s sin interacción, la opacidad calculada del contenedor de navegación era `0` en el viewport de 390 px. |
| `/aboutme` | Renderiza el contenido; `scrollWidth` y ancho del viewport fueron ambos 390 px en la medición efectuada. |
| `/projects` | Renderiza cinco proyectos. Con viewport de 390 px, `scrollWidth` fue 1160 px frente a 375 px de área de viewport; desbordamiento horizontal. |
| `/projects/1` | Renderiza el contenido de Lazos; en la medición de 390 px no apareció desbordamiento horizontal. |
| `/url-inexistente` | No presenta texto visible y genera advertencia “No routes matched location”. |

Las pruebas son una muestra y no reemplazan verificación en navegador, teclado, lector de pantalla o despliegue real.

## 7. Diagnóstico de arquitectura

### Prioridad alta

1. **Rutas y errores:** añadir tratamiento visible de ruta no encontrada y acordar una frontera de recuperación para errores de renderizado. Mantener el caso específico de ID no encontrado.
2. **Interacciones semánticas:** las filas de proyecto (`div` con `onClick`) y “Contacto” (`p` con `onClick`) deben ser operables y comprensibles con teclado/tecnologías de asistencia.
3. **Cierre modal:** distinguir clic en fondo de interacción con contenido para que abrir, recorrer o arrastrar la galería no cierre inesperadamente el modal.
4. **Overflow:** resolver el ancho de `/projects` en móvil, medido en local.
5. **Navegación inicial:** decidir cuándo y cómo aparece la navegación en portada; verificar que no quede invisible para usuarios de teclado.

### Mantenibilidad

- Si modal y página deben mostrar los mismos bloques, extraer un componente tipado de presentación para bloques y mantener cabeceras/layouts separados. Si intencionalmente difieren, documentar qué comportamiento es exclusivo de cada vista.
- `AboutMe` y `ProjectsPage` pueden descomponerse en secciones/componentes cuando ello reduzca acoplamiento real. No extraer componentes solo por superar una longitud arbitraria.
- Mantener lógica de rutas en `src/routes`, páginas en `src/pages`, elementos reutilizables en `src/components`, tipos en `src/types` y JSON/recursos estáticos en `src/assets`.
- Si se implementa CMS o analítica, añadir una capa de integración solo en el punto necesario; no crear servicios globales hasta tener un consumidor/flujo real.
- Revisar limpieza de animaciones. `AboutMe`, `ProjectModal` y `ProjectPreview` muestran mecanismos de cleanup/contexto; los efectos de entrada/estado en `MainPage` deben verificarse específicamente.
- Mantener contratos de datos sincronizados y evitar que contenido externo se considere validado solo por una aserción de tipo.

## 8. Checklist de resolución estructural

### Enrutador y estados de error

- [ ] Añadir ruta `*` con una página 404 y comprobar enlaces de salida.
- [ ] Definir tratamiento de errores de renderizado y de carga; probar recuperación.
- [ ] Probar IDs numéricos/no numéricos, ausentes y límites de la navegación.
- [ ] Decidir si el detalle abierto desde el listado debe tener URL compartible o seguir siendo modal local.
- [ ] Verificar recarga de rutas profundas en el proveedor de producción.

### Componentes, responsabilidades e interacción

- [ ] Convertir controles no semánticos en enlaces/botones o elementos interactivos equivalentes accesibles.
- [ ] Definir una zona de cierre del modal y comprobar que el contenido puede usarse sin cerrarse accidentalmente.
- [ ] Conectar o retirar el selector EN/ES según alcance aprobado.
- [ ] Corregir el callback de contacto para todas las instancias o convertirlo en navegación/acción con comportamiento uniforme.
- [ ] Acordar si se comparte el renderizador de bloques entre página y modal; si sí, crear una unidad común sin unificar layouts por fuerza.
- [ ] Comprobar limpieza de GSAP/ScrollTrigger/requestAnimationFrame/listeners en montaje y desmontaje, también con StrictMode.
- [ ] Extraer secciones de páginas solo cuando simplifique una responsabilidad o permita reutilización/pruebas reales.

### Contratos, estructura y dependencias

- [ ] Confirmar tipos de bloque con producto; implementar o retirar `double-image`.
- [ ] Validar datos JSON en el límite o añadir pruebas de integridad apropiadas al modelo.
- [ ] Buscar referencias completas a `Image`, `@tanstack/react-virtual` y `react-infinite-canvas`; decidir limpieza solo con evidencia.
- [ ] Estandarizar extensiones de imports cuando se trabaje en los archivos implicados.
- [ ] Mantener la estructura actual de carpetas salvo que una necesidad de funcionalidad justifique un área nueva.
- [ ] Añadir pruebas focalizadas para rutas, bloques de proyecto y flujos de modal cuando se elija infraestructura de tests; no instalar un framework solo para mejorar cobertura sin aprobarlo.

### Evidencia de cierre

- [ ] `npm run lint` y `npm run build` ejecutados y registrados.
- [ ] Rutas válidas, 404, estado de error y detalle no encontrado verificados.
- [ ] Listado/modal/detalle operables con ratón, teclado y touch.
- [ ] Capturas y medidas de overflow verificadas en tamaños de pantalla aprobados.
- [ ] Revisión de código confirma que no se añadieron capas ni refactors ajenos al alcance.

## 9. Relación con la checklist maestra

La resolución transversal de producto y sus prioridades está en [checklist-estado-web.md](./checklist-estado-web.md). Este informe se centra en rutas, responsabilidades de páginas/componentes y organización del código.
