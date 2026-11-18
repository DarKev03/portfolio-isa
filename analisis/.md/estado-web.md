# Informe de estado de la web

## Alcance y cautelas

Este informe describe lo que se puede observar en el código del repositorio. No equivale a una auditoría legal, una auditoría de seguridad, una prueba en producción ni una validación visual en distintos dispositivos. Los aspectos que dependen del alojamiento, de los derechos sobre los materiales o de pruebas en navegador se indican como pendientes de confirmar.

La descripción página por página está en [radiografia-paginas.md](./radiografia-paginas.md). Este documento complementa esa radiografía con el estado transversal del producto y sus principales riesgos.

## Resumen ejecutivo

La web es actualmente una aplicación de portfolio de una sola página (SPA), construida con React, TypeScript y Vite. La navegación y las interacciones principales existen, pero los proyectos están definidos en un archivo JSON del repositorio y no se observa un flujo para que la usuaria los gestione desde una interfaz.

Antes de presentar el sitio como listo para que la cliente lo opere o para publicarlo con garantías, conviene resolver la titularidad y licencia, decidir cómo se mantendrán los contenidos, cubrir los estados de error y las rutas inexistentes, y validar la experiencia en móvil, con teclado y en condiciones de red limitadas. La existencia de una integración, protección o comportamiento que depende del alojamiento no debe darse por confirmada sin revisar el despliegue.

## Estado observado

| Área | Estado observado en el repositorio | Implicación |
| --- | --- | --- |
| Páginas y rutas | Cuatro rutas: portada, “Sobre mí”, listado y detalle de proyecto. No se observa una ruta comodín para direcciones inexistentes. | Una URL no reconocida no tiene una página 404 propia en la aplicación. |
| Errores de interfaz | El detalle de proyecto no encontrado sí muestra un mensaje. No se observa un límite global de errores de React ni una ruta de error del router. | Hay un caso de error cubierto, pero no una estrategia general para fallos de renderizado o navegación. |
| Metadatos de documento | [`index.html`](../index.html) conserva el título `temp-project`, el favicon de Vite y `lang="en"` mientras la interfaz observada está en español. | La identidad de la pestaña y el idioma declarado al navegador no reflejan el contenido de la web. |
| Contenidos | Los proyectos se leen de [`src/assets/projects.json`](../src/assets/projects.json). | Para cambiar el portfolio actualmente hay que modificar el repositorio y publicar una nueva versión. |
| CMS y base de datos | No se observan dependencias ni conexiones a un CMS, API o base de datos. | No hay un panel de edición ni persistencia propia de proyectos. |
| Idiomas | El selector `EN / ES` está en la navegación, pero solo cambia su estado visual; los textos de las páginas permanecen en español. | La interfaz no ofrece traducción funcional. |
| Licencia | [`LICENSE`](../LICENSE) declara MIT y nombra a Kevin García en el aviso de copyright. MIT permite, entre otros usos, modificar y vender copias del software. | No satisface por sí sola el objetivo expresado de condicionar el uso comercial a un pago. Deben confirmarse titularidad, materiales cubiertos y términos con asesoramiento adecuado. |
| Seguridad | La aplicación inspeccionada es principalmente cliente y no se ha realizado una auditoría de seguridad ni revisado el alojamiento. | No es correcto concluir que “no tiene ninguna seguridad”: faltan pruebas para afirmarlo y una aplicación estática también requiere controles de dependencias, configuración y publicación. |
| Adaptación a pantallas | Se observan estilos Tailwind, incluidos algunos breakpoints, pero no hay evidencia de una revisión integral de tamaños de pantalla. | La adaptación real a móvil y tablet queda pendiente de prueba visual y funcional. |
| Tipografías | [`src/index.css`](../src/index.css) importa Castoro desde Google Fonts y declara una fuente local CirrusCumulus. En los componentes consultados se solicita Castoro y también se especifica una familia genérica de respaldo. | La fuente utilizada principalmente depende de un recurso externo. La fuente local declarada no demuestra por sí sola que sea un reemplazo visual adecuado; hay que verificar fallback, configuración efectiva y derechos de uso. |
| Analítica y errores | No se observan integraciones de analítica ni monitorización de errores en el código consultado. | No hay medición de visitas ni captura centralizada de errores observada. Revisar también scripts/configuración del entorno de publicación. |
| Consentimiento | No se observa una solución de consentimiento de cookies. | Si se decide incorporar analítica o tecnologías no esenciales, hay que definir antes las obligaciones aplicables, el consentimiento y su retirada con la usuaria. |
| Caché | No se observa un service worker ni una estrategia de caché implementada por la aplicación. | Esto no permite deducir si el navegador reutiliza archivos: depende también de las cabeceras HTTP del alojamiento y de la caché del navegador. Se debe medir en producción. |
| Manifest e instalación | En [`index.html`](../index.html) no se observa un manifest web. | No hay configuración observada para presentar la web como aplicación instalable/PWA; confirmar si esa capacidad es un requisito. |
| JavaScript desactivado | El HTML inicial contiene el contenedor React y el script de entrada, pero no incluye un mensaje `<noscript>`. | Con JavaScript desactivado o bloqueado, no se presenta una explicación alternativa al usuario. |
| CV | La mención “(download CV)” está renderizada como texto. | No hay una acción de descarga asociada. |
| Mantenibilidad | El renderizado de bloques de proyecto está duplicado entre [`src/components/ProjectDetail.tsx`](../src/components/ProjectDetail.tsx) y [`src/pages/ProjectDetailPage.tsx`](../src/pages/ProjectDetailPage.tsx). | Los dos formatos de detalle pueden divergir al introducir cambios; conviene decidir si comparten presentación o si son deliberadamente distintos. |
| Verificación automatizada | [`package.json`](../package.json) define scripts de lint y build, pero no un script de pruebas. No se ejecutaron esos comandos como parte de este informe. | No se debe presentar la aplicación como validada por pruebas automatizadas sin ejecutar las comprobaciones y acordar pruebas de comportamiento. |
| Publicación | No se ha revisado proveedor, dominio, cabeceras, copias de seguridad ni proceso de despliegue. | No se puede certificar el comportamiento de rutas directas, caché, TLS, cabeceras o monitorización en producción. |

## Riesgos principales para la cliente

1. **Derechos y licencia:** la licencia actual permite explotación comercial según sus términos y el aviso nombra a una persona distinta de la destinataria del objetivo descrito. No cambiarla sin verificar quién posee los derechos del código y de cada contenido, qué terceros han contribuido y qué materiales pueden relicenciarse.
2. **Operación del portfolio:** la usuaria no dispone de un flujo de edición. Un cambio requiere editar datos en el repositorio y desplegar de nuevo.
3. **Robustez de navegación:** falta documentar y probar el comportamiento de rutas desconocidas, fallos de renderizado y errores de publicación.
4. **Compatibilidad y accesibilidad:** no hay evidencia suficiente de adaptación completa a móvil, funcionamiento sin JavaScript ni validación de controles y contenidos accesibles.
5. **Privacidad y medición:** analítica, cookies y consentimiento son decisiones pendientes; no basta con añadir un script de seguimiento sin valorar el tratamiento de datos y los requisitos aplicables.
6. **Rendimiento y disponibilidad de recursos:** imágenes y tipografía pueden depender de terceros. La política real de caché solo se puede confirmar observando las respuestas del entorno publicado.

## Prioridades recomendadas

- **Bloqueante antes de definir la licencia de entrega:** resolver titularidad, atribución, alcance (código, textos, fotografías, fuentes y marca) y condiciones para autorizar usos comerciales.
- **Alta:** acordar cómo actualizará proyectos la usuaria; incorporar una ruta 404 y una estrategia visible de errores; probar rutas directas y escenarios de publicación.
- **Alta:** validar adaptación móvil, navegación por teclado, mensajes accesibles, descarga real del CV y presentación cuando JavaScript no esté disponible.
- **Media:** implementar traducciones reales si EN/ES forma parte del alcance; decidir analítica y, si aplica, la gestión de consentimiento.
- **Media:** medir solicitudes y caché en el alojamiento, optimizar las imágenes y asegurar una tipografía principal con fallback apropiado.
- **Según alcance:** añadir manifest/PWA solo si se desea instalación o comportamiento de aplicación; no es requisito automático de un portfolio web.

## Decisiones necesarias de la cliente

- ¿Quién es titular del código, los textos, las fotografías, las fuentes y la identidad gráfica? ¿Qué usos comerciales se quieren permitir y bajo qué acuerdo?
- ¿La usuaria actualizará proyectos sin intervención técnica? ¿Necesita borradores, publicación, orden, galerías, traducciones y gestión de imágenes?
- ¿Qué idiomas deben estar disponibles y qué contenidos se traducirán?
- ¿Se medirán visitas o errores? ¿Qué métricas, herramientas, retención y países de acceso se consideran?
- ¿Se desea que la web sea instalable como PWA?
- ¿Cuál es el CV vigente y quién lo mantendrá?

## Próximos documentos

- [Gestión de contenidos](./gestion-contenidos.md): situación actual y requisitos para que la usuaria mantenga proyectos.
- [Plan de validación](./plan-validacion.md): comprobaciones pendientes, sin presentarlas como ya ejecutadas.
- [Prioridades y decisiones](./prioridades-y-decisiones.md): propuesta de secuencia de trabajo y decisiones que requieren aprobación.
