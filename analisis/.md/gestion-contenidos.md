# Gestión de contenidos

## Situación actual

No se observa una interfaz de administración, CMS, API de contenidos ni base de datos conectada a la aplicación. El listado y los detalles se alimentan de [`src/assets/projects.json`](../src/assets/projects.json), que forma parte del código de la web.

En consecuencia, el flujo actual para incorporar un proyecto es técnico:

1. Editar el JSON en el repositorio.
2. Añadir o cambiar imágenes y bloques de contenido.
3. Comprobar que los datos siguen el contrato de [`src/types/Project.ts`](../src/types/Project.ts) y [`src/types/ContentBlock.ts`](../src/types/ContentBlock.ts).
4. Generar y publicar una nueva versión de la web.

No hay un proceso visible para que la usuaria cargue imágenes, guarde borradores, publique cambios o deshaga una edición por sí misma. Las imágenes actuales del JSON usan URLs externas; no se observa almacenamiento propio de medios.

## Implicaciones

- Los cambios de contenido requieren acceso técnico al repositorio y al proceso de publicación.
- Un error en la sintaxis o en la estructura de datos puede impedir que el proyecto se muestre correctamente.
- El JSON permite versionar los contenidos junto con el código, pero no ofrece por sí solo permisos editoriales, previsualización, aprobación ni historial pensado para una usuaria no técnica.
- Las URLs externas implican dependencia de disponibilidad, permisos, privacidad, tamaño y formato de los recursos de terceros.

## Alternativas a valorar

No se recomienda elegir una plataforma antes de confirmar el flujo editorial y el presupuesto. Hay tres opciones generales:

| Opción | Cuándo encaja | Consideraciones |
| --- | --- | --- |
| Mantener JSON y repositorio | El portfolio cambia poco y una persona técnica publica los cambios. | Menor infraestructura; la usuaria no edita directamente. |
| CMS alojado | Se necesita edición visual y publicación sin gestionar una API propia. | Revisar coste, roles, exportación, disponibilidad, privacidad, ubicación de datos y dependencia del proveedor. |
| CMS/API y almacenamiento propios | Se requieren reglas, integración o control operacional específico. | Hay que implementar y mantener autenticación, permisos, validación, almacenamiento, copias, monitorización y seguridad del backend. Una base de datos sola no proporciona una experiencia de edición. |

## Requisitos que conviene acordar

Antes de seleccionar una solución, confirmar:

- Quién crea, revisa y publica proyectos; si habrá una o varias cuentas y roles.
- Si se requieren borradores, previsualización, publicación programada, deshacer y registro de cambios.
- Campos por proyecto: título, descripción, año, etiquetas, imagen principal y bloques editoriales.
- Tipos de bloque admitidos y validaciones (por ejemplo, texto, imagen y tamaño); el tipo actual también declara `double-image`, aunque los renderizadores observados no lo presentan.
- Formatos, tamaño máximo, recorte, texto alternativo, derechos y procedimiento de carga de imágenes.
- Si se requieren proyectos en varios idiomas y cómo se gestionarán los textos traducidos.
- Política para archivos, permisos, copias de seguridad, retención y eliminación.
- Quién es titular de los contenidos y qué autorización existe para alojarlos y publicarlos.

## Criterios de aceptación para una futura gestión editorial

- La usuaria autorizada puede crear, editar, previsualizar, publicar y retirar un proyecto sin modificar código.
- Los campos obligatorios y las URLs/archivos se validan antes de guardar y se presentan errores comprensibles.
- La carga de imágenes limita tipos y tamaños permitidos, muestra progreso y comunica fallos.
- Los permisos impiden que una persona no autorizada cambie o publique contenido.
- Los cambios de contenido no requieren reconstruir manualmente la aplicación, salvo que se elija explícitamente una arquitectura estática con generación de versiones.
- Existe una estrategia probada de recuperación ante borrado accidental y fallo del proveedor.

## Dependencias

La decisión de CMS no debe separarse de la decisión sobre idiomas, derechos de imágenes, roles, alojamiento y publicación. Si se elige analítica, su integración debe diseñarse junto con la evaluación de privacidad y consentimiento descrita en el [informe de estado](./estado-web.md).
