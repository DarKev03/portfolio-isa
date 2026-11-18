# Informe de estado y checklist de resolución

## 1. Objetivo

Consolidar en una lista de trabajo el contenido de [estado-web.md](./estado-web.md), [radiografia-paginas.md](./radiografia-paginas.md), [gestion-contenidos.md](./gestion-contenidos.md), [plan-validacion.md](./plan-validacion.md) y [prioridades-y-decisiones.md](./prioridades-y-decisiones.md). Este documento sirve para acordar alcance, asignar responsables y registrar el cierre de cada asunto.

No se han modificado archivos de código. Las tareas de esta checklist están pendientes hasta que alguien las complete y adjunte evidencia.

## 2. Indicadores de seguimiento

- `[ ]` Pendiente de realizar.
- `[x]` Realizado y verificado; indicar evidencia y entorno.
- `[!]` Requiere decisión o está bloqueado.
- `[-]` Fuera de alcance, aprobado explícitamente por la cliente.
- **P0:** decisión o bloqueo previo a la entrega/publicación.
- **P1:** funcionalidad o problema importante para uso correcto.
- **P2:** mejora de calidad, mantenimiento o rendimiento, según alcance.

No marques una tarea como completada solo porque exista un plan. Para validaciones técnicas, registra URL/entorno, dispositivo o navegador, resultado y evidencia.

## 3. Línea base revisada

### Revisión del código

- Aplicación React, TypeScript y Vite; rutas declaradas en [`src/routes/AppRouter.tsx`](../src/routes/AppRouter.tsx).
- Cuatro rutas: `/`, `/aboutme`, `/projects` y `/projects/:id`.
- Los proyectos se importan de [`src/assets/projects.json`](../src/assets/projects.json); no se observa CMS, API o base de datos conectada.
- La licencia [`LICENSE`](../LICENSE) es MIT y el aviso nombra a Kevin García.
- [`index.html`](../index.html) mantiene `temp-project`, favicon de Vite y `lang="en"`; no contiene `<noscript>` ni referencia observada a un manifest.
- [`src/index.css`](../src/index.css) importa Castoro desde Google Fonts y declara CirrusCumulus localmente. Los componentes que solicitan Castoro también indican familias genéricas de respaldo; la adecuación visual de ese fallback no se ha probado.
- No se ha realizado una auditoría legal, de seguridad o del alojamiento.

### Observaciones en el navegador local

Comprobaciones puntuales en `http://localhost:5173/`, no en producción:

| Ruta/escenario | Resultado observado | Alcance de la comprobación |
| --- | --- | --- |
| `/` | Carga. En la medición del viewport de 390 px, el menú tenía opacidad calculada `0` después de 2,5 s sin interacción. | Hay que acordar y probar el acceso inicial al menú, también con teclado. |
| `/aboutme` | Carga; no se midió desbordamiento horizontal en el viewport de 390 px. | No acredita adaptación completa ni accesibilidad. |
| `/projects` | En viewport de 390 px, el ancho de documento fue 1160 px y el área de viewport 375 px; hay desbordamiento horizontal. La captura de escritorio también mostró barra horizontal. | Incidencia reproducida localmente; comprobar en tamaños objetivo tras corregir. |
| `/projects/1` | Carga el detalle; no se midió desbordamiento horizontal en el viewport de 390 px. | No acredita que controles/textos sean usables en móvil. |
| `/url-inexistente` | Cuerpo sin contenido y advertencia de React Router “No routes matched location”. | Incidencia reproducida localmente; no hay una página 404 visible. |
| Título del navegador | Sigue mostrando `temp-project` en las rutas probadas. | Confirmado en el servidor local de desarrollo. |

Las mediciones anteriores documentan el estado observado en esta sesión. No equivalen a una batería de pruebas completa ni a resultados de producción.

## 4. Checklist por categoría

### 4.1 Páginas, navegación y contenido visible

- [ ] **P1 — Portada:** definir cuándo se muestra la navegación y hacerla descubrible desde teclado, sin depender exclusivamente de puntero/rueda.
- [ ] **P1 — Proyectos:** corregir el desbordamiento horizontal en móvil y acordar si el diseño admite desplazamiento horizontal o debe reacomodarse.
- [ ] **P1 — Detalle:** decidir si anterior/siguiente deben seguir el orden real de proyectos y envolver al principio/final; el modal actual recorre circularmente, la ruta por ID calcula `id - 1`/`id + 1`.
- [ ] **P1 — Contacto:** hacer que el acceso tenga una acción válida en todas las páginas donde se muestra, si debe funcionar globalmente.
- [ ] **P1 — CV:** confirmar con la cliente si se publicará un CV y quién lo mantendrá; si se confirma, reemplazar el texto por un enlace/botón accesible a un archivo vigente.
- [ ] **P2 — Datos visibles:** revisar nombres, etiquetas, años, textos, imágenes y enlaces de contacto con la cliente.
- [ ] **P2 — Imágenes:** validar titularidad, permisos, textos alternativos y origen de cada recurso del portfolio.
- [ ] **P2 — Contacto modal:** probar apertura, cierre y accesibilidad; en el código actual la capa tiene `pointer-events-none`, lo que puede impedir recibir el clic de cierre.

**Criterio de cierre:** la cliente confirma contenidos y flujos; las rutas, acciones y controles acordados funcionan con ratón, teclado y dispositivos táctiles.

### 4.2 Gestión de contenidos, CMS y almacenamiento

- [ ] **P0 — Flujo editorial:** acordar quién crea, revisa y publica proyectos y con qué frecuencia.
- [ ] **P0 — Solución:** elegir con presupuesto y requisitos entre mantener JSON bajo intervención técnica, CMS alojado o gestión/API propia.
- [ ] **P1 — Modelo:** aprobar campos, tipos de bloque, idiomas, imágenes, texto alternativo y validaciones.
- [ ] **P1 — Medios:** definir carga, almacenamiento, formatos, límites, compresión, derechos, copias y recuperación.
- [ ] **P1 — Permisos:** si se crea un panel/API, definir usuarios, roles, autenticación y quién puede publicar o retirar contenido.
- [ ] **P1 — Operación:** documentar el proceso de crear, previsualizar, publicar, editar, retirar y recuperar contenido.
- [ ] **P2 — Datos actuales:** decidir si se migran los cinco proyectos de `projects.json` y verificar su integridad al migrarlos.
- [ ] **P2 — Tipos de bloque:** decidir si `double-image` se implementa o se elimina del contrato; actualmente está declarado pero no renderizado en los detalles.

**Criterio de cierre:** la persona responsable puede completar el flujo editorial aprobado y recuperarse de errores/borrados conforme a una prueba documentada.

### 4.3 Licencia, autoría y derechos

- [ ] **P0 — Titularidad:** confirmar titulares y permisos del código, diseño, textos, imágenes, fuentes, marca y contribuciones de terceros.
- [ ] **P0 — Condición comercial:** concretar qué usos requieren pago, quién puede autorizarlos, cómo se acuerda el pago y qué usos quedan permitidos.
- [ ] **P0 — Licencia:** obtener revisión/redacción legal de los términos. La MIT actual permite explotación comercial y el aviso de copyright debe contrastarse con la titularidad acreditada.
- [ ] **P0 — Materiales externos:** identificar contenido de terceros que no puede cubrirse con una licencia propia del proyecto.
- [ ] **P1 — Entrega:** actualizar avisos y documentación únicamente después de la aprobación de titulares y condiciones.

**Criterio de cierre:** licencia y avisos aprobados por quien tenga autoridad sobre cada material; no se asume que cambiar un archivo resuelva derechos ajenos.

### 4.4 Rutas, errores y estados degradados

- [ ] **P1 — 404:** implementar una respuesta visible para rutas desconocidas, con una salida clara hacia Inicio/Proyectos.
- [ ] **P1 — Errores de interfaz:** definir cómo recuperarse de fallos de renderizado y de carga de datos, con mensajes útiles y sin datos internos sensibles.
- [ ] **P1 — IDs:** probar ID no numérico, inexistente, primero y último; ofrecer navegación consistente en cada caso.
- [ ] **P1 — Enlaces directos:** verificar recarga y acceso directo a `/aboutme`, `/projects` y `/projects/:id` en el alojamiento real.
- [ ] **P1 — Recursos fallidos:** probar imágenes, vídeos y fuentes inaccesibles; asegurar que el contenido restante se mantiene usable.
- [ ] **P2 — Título/idioma:** actualizar título y favicon y hacer que el idioma del documento coincida con el contenido o con el estado de idioma seleccionado.

**Criterio de cierre:** las rutas válidas, desconocidas y fallidas tienen resultado deliberado tanto en desarrollo como en producción.

### 4.5 Arquitectura y mantenibilidad

El diagnóstico detallado está en [informe-estructura-codigo.md](./informe-estructura-codigo.md).

- [ ] **P1 — Contratos:** decidir si `ProjectDetail` (modal) y `ProjectDetailPage` comparten el renderizado de bloques; evitar mantener dos renderizadores divergentes si representan el mismo contenido.
- [ ] **P1 — Semántica:** reemplazar elementos `div`/`p` usados como controles por controles semánticos y accesibles cuando corresponda.
- [ ] **P1 — Interacción modal:** acordar qué clics deben cerrar el modal y evitar que interactuar con su contenido lo cierre accidentalmente.
- [ ] **P2 — Composición:** evaluar extracción de secciones cohesivas de `AboutMe` y subunidades de `ProjectsPage` solo si mejora lectura, pruebas o reutilización.
- [ ] **P2 — Tipos:** comprobar datos JSON contra los contratos; las aserciones `as Project[]` no validan los datos en tiempo de ejecución.
- [ ] **P2 — Elementos no usados:** confirmar con búsqueda completa si el tipo `Image` y dependencias sin referencias en `src` se necesitan antes de proponer su eliminación.
- [ ] **P2 — Efectos:** revisar limpieza de timelines/animaciones GSAP en los efectos de `MainPage`, especialmente con StrictMode.
- [ ] **P2 — Estructura:** mantener `routes`, `pages`, `components`, `types` y `assets` mientras satisfagan el alcance; no reorganizar carpetas de forma preventiva.

**Criterio de cierre:** responsabilidades, interacciones y contratos son comprensibles, sin refactor amplio no justificado, y los cambios tienen comprobaciones acordes.

### 4.6 Adaptación, accesibilidad y experiencia

- [ ] **P1 — Desbordamiento:** resolver el desbordamiento confirmado de `/projects` a 390 px.
- [ ] **P1 — Cobertura responsive:** probar portada, “Sobre mí”, listado, modal y detalle en móvil estrecho/ancho, tablet y escritorio.
- [ ] **P1 — Teclado:** verificar orden de foco, foco visible, elementos activables, navegación, modales y cierre sin ratón.
- [ ] **P1 — Semántica:** corregir filas de proyecto y elementos de contacto interactivos construidos como `div` o `p` si el usuario puede activarlos.
- [ ] **P1 — Animación:** comprobar movimiento reducido y que las animaciones no oculten controles ni contenido esencial.
- [ ] **P2 — Imágenes:** confirmar qué imágenes son decorativas y cuáles necesitan texto alternativo significativo.
- [ ] **P2 — Visual:** registrar capturas de referencia y problemas por ruta/dispositivo antes y después de cualquier trabajo.

**Criterio de cierre:** cada ruta y estado acordado es legible y operable en los tamaños y modalidades definidos, con evidencia.

### 4.7 Idiomas e internacionalización

- [ ] **P0 — Alcance:** confirmar idiomas requeridos y quién proporciona/revisa traducciones.
- [ ] **P1 — Implementación:** elegir una estrategia de i18n y trasladar textos de navegación, páginas, errores y proyectos a recursos localizados.
- [ ] **P1 — Selector:** conectar EN/ES al idioma real de toda la aplicación y reflejar el idioma activo en semántica y metadatos.
- [ ] **P1 — Persistencia y URL:** acordar si el idioma se conserva y si forma parte de la ruta o parámetro.
- [ ] **P2 — Contenido:** validar etiquetas, fechas, formato de texto y proyectos traducidos.

**Criterio de cierre:** cada idioma ofrece una traducción completa o el selector se retira hasta que la traducción esté disponible.

### 4.8 Analítica, errores, cookies y consentimiento

- [ ] **P0 — Finalidad:** decidir si se medirán visitas y errores y qué preguntas responderá cada herramienta.
- [ ] **P0 — Privacidad:** elegir proveedor y revisar qué datos recoge, retención, ubicación y acceso con la cliente y asesoramiento adecuado.
- [ ] **P1 — Consentimiento:** definir si las tecnologías seleccionadas requieren consentimiento y cómo se informa, acepta, rechaza y retira.
- [ ] **P1 — Implementación:** si se aprueba, integrar analítica/observabilidad con minimización de datos y sin enviar información sensible.
- [ ] **P1 — Verificación:** probar que preferencias y carga de tecnologías respetan la decisión del usuario y que la política describe el comportamiento real.
- [ ] **P2 — Alertas:** acordar responsable y proceso de respuesta a errores, umbrales y notificaciones.

**Criterio de cierre:** herramientas activas, política y consentimiento (cuando aplique) coinciden; decisión de no añadir analítica también queda documentada.

### 4.9 Caché, recursos, tipografía y rendimiento

- [ ] **P1 — Medición:** inspeccionar en el alojamiento real cabeceras `Cache-Control`, `ETag` y `Last-Modified` de imágenes, vídeos, fuentes y bundles.
- [ ] **P1 — Reutilización:** comparar primera y segunda visita; no asumir que la ausencia de service worker implica ausencia de caché del navegador.
- [ ] **P1 — Recursos externos:** decidir si imágenes y fuentes permanecerán en terceros o se servirán desde un origen controlado y autorizado.
- [ ] **P1 — Tipografía:** bloquear Google Fonts, revisar legibilidad, fallback genérico y carga de la fuente local; decidir si conviene alojar localmente la fuente licenciada.
- [ ] **P2 — Optimización:** medir tamaño y carga de imágenes/vídeo y optimizar solo donde las métricas indiquen beneficio.
- [ ] **P2 — Objetivos:** acordar umbrales de rendimiento que se puedan medir antes de declarar la mejora.

**Criterio de cierre:** comportamiento medido en producción y cambios de caché/recursos validados en dos visitas y conexión limitada.

### 4.10 JavaScript, metadatos y PWA

- [ ] **P1 — Sin JavaScript:** añadir una explicación `<noscript>` y comprobar qué contenido queda disponible con scripts desactivados.
- [ ] **P1 — Metadatos:** sustituir título y favicon de plantilla y corregir `lang` para el idioma real.
- [ ] **P2 — Manifest:** decidir si la instalación/PWA es requisito; si no lo es, registrar que queda fuera de alcance.
- [ ] **P2 — PWA:** si se aprueba, definir iconos, manifest, política offline, service worker, actualizaciones y pruebas; no añadir solo un manifest como sustituto de estos requisitos.

### 4.11 Pruebas, publicación y mantenimiento

- [ ] **P1 — Build/lint:** ejecutar `npm run lint` y `npm run build`; guardar salidas y versión de Node.js.
- [ ] **P1 — Comportamiento:** decidir e implementar pruebas automatizadas proporcionadas al producto; actualmente no hay script de tests declarado.
- [ ] **P1 — Navegadores:** verificar los navegadores/dispositivos acordados y registrar fallos y evidencia.
- [ ] **P1 — Producción:** confirmar proveedor, dominio, HTTPS, reglas de SPA, cabeceras, configuración y despliegue.
- [ ] **P1 — Seguridad:** realizar revisión acorde con la arquitectura final; incluir dependencias, secretos, permisos, configuración, CMS/API y cargas de archivo si se incorporan.
- [ ] **P2 — Recuperación:** documentar copias, restauración, propiedad de cuentas, dominio, credenciales y responsables de mantenimiento.
- [ ] **P2 — Control de versiones:** decidir si la carpeta `analisis` debe incluirse en Git; ahora está excluida por `.gitignore` (línea 27). No se cambió esa regla para preservar el estado local.

**Criterio de cierre:** pruebas y publicación verificadas en el entorno acordado; no presentar el checklist de validación como evidencia hasta ejecutarlo.

## 5. Orden propuesto

1. Resolver titularidad/licencia y las decisiones de contenido, idiomas, medición y alcance.
2. Corregir 404/errores, desbordamiento móvil, interacciones inaccesibles y CTA del CV/contacto confirmadas.
3. Implementar la solución editorial acordada y validar el ciclo de gestión.
4. Completar i18n, analítica/consentimiento, caché y PWA solo si se aprobaron.
5. Validar build, lint, comportamiento, accesibilidad y publicación; registrar resultados.

## 6. Registro de cierre

| ID | Responsable | Fecha | Evidencia/entorno | Resultado | Incidencia/decisión |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Referencias de origen

- [Estado general](./estado-web.md)
- [Radiografía de páginas](./radiografia-paginas.md)
- [Gestión de contenidos](./gestion-contenidos.md)
- [Plan de validación](./plan-validacion.md)
- [Prioridades y decisiones](./prioridades-y-decisiones.md)
- [Informe de estructura de código](./informe-estructura-codigo.md)
