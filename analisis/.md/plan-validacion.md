# Plan de validación

## Estado de este documento

Este es un plan de comprobaciones, no un informe de pruebas ejecutadas. No se ha validado aquí la web en producción, distintos navegadores o dispositivos. Los resultados deben añadirse únicamente después de ejecutar cada prueba, indicando entorno, fecha y evidencia.

## 1. Compilación y calidad estática

- Ejecutar `npm run lint` y registrar resultado y advertencias.
- Ejecutar `npm run build` y registrar resultado.
- Confirmar qué versión de Node.js y qué instalación limpia de dependencias se utilizaron.
- Revisar dependencias y vulnerabilidades conocidas con el procedimiento aprobado por el equipo; no se ha ejecutado un análisis de dependencias como parte de este documento.
- Decidir una estrategia de pruebas automatizadas para rutas y comportamiento. El proyecto no define actualmente un script de tests en `package.json`.

## 2. Rutas y estados de error

- Abrir directamente `/`, `/aboutme`, `/projects` y un detalle válido `/projects/:id`.
- Abrir una ruta inexistente y confirmar que se muestra una página 404 comprensible, con navegación de vuelta.
- Probar un ID no numérico, uno inexistente y navegación anterior/siguiente en los límites del conjunto.
- Abrir las rutas desde un enlace externo o actualizar el navegador en una ruta profunda; verificar que el servidor de publicación devuelve la SPA donde corresponda.
- Provocar un fallo de renderizado controlado en un entorno de prueba y verificar el mensaje de recuperación, sin exponer datos técnicos sensibles.
- Probar fallos de carga de recursos externos y verificar que la página sigue siendo usable.

## 3. Funcionalidad y contenido

- Confirmar que todas las tarjetas usan los datos e imágenes correctos y que faltas de contenido no rompen el diseño.
- Probar apertura, cierre, anterior y siguiente del modal de proyectos.
- Probar desplazamiento horizontal de los detalles en ratón y pantalla táctil.
- Verificar que “Contacto” se puede abrir/cerrar donde aparece y que el CV tiene una acción real de descarga, si se mantiene esa opción.
- Comprobar que EN/ES cambia efectivamente todos los textos o, si todavía no hay traducción, que la interfaz no sugiera una función que no existe.
- Validar que el contenido de cada proyecto y sus imágenes cuentan con autorización y alternativas textuales adecuadas.

## 4. Adaptación, accesibilidad y modos de uso

- Probar al menos móvil estrecho, móvil ancho, tablet y escritorio; registrar desbordamientos, texto cortado, controles fuera de pantalla y problemas de orientación.
- Navegar con teclado; comprobar orden de foco, foco visible, elementos semánticos, botones/enlaces y cierre de overlays.
- Revisar contraste, ampliación de texto, lectores de pantalla y movimiento reducido, especialmente las animaciones GSAP.
- Desactivar JavaScript y confirmar que se ofrece un mensaje útil y una indicación de cómo continuar.
- Bloquear Google Fonts y las imágenes externas; comprobar fallback tipográfico y comportamiento degradado.
- Confirmar que las imágenes decorativas y las informativas tienen tratamiento alternativo apropiado.

## 5. Red, caché y rendimiento

En el sitio publicado, usar las herramientas de red del navegador para medir y guardar evidencia de:

- Respuestas de imágenes y fuentes: origen, tamaño, duración, estado y cabeceras `Cache-Control`, `ETag` y `Last-Modified`.
- Si una segunda visita reutiliza recursos desde caché del navegador; no deducir este comportamiento solo por la ausencia de un service worker.
- Peso de JavaScript y CSS iniciales, carga de la portada y desplazamiento del lienzo.
- Efecto de una conexión lenta y de la pérdida de conexión durante la carga.
- Necesidad real de caché propia o PWA según los resultados y requisitos acordados.

## 6. Privacidad, analítica y cookies

- Antes de añadir analítica, definir finalidad, métricas, proveedor, datos recogidos, retención y configuración de privacidad.
- Con la usuaria y asesoramiento adecuado, determinar qué consentimiento y controles se necesitan para el contexto jurídico y los servicios elegidos.
- Si hay consentimiento, verificar que las tecnologías no esenciales no se inicializan antes de la elección aplicable, que se puede rechazar y retirar, y que la preferencia persiste correctamente.
- Confirmar que la política de privacidad/cookies y la interfaz describen las herramientas realmente activas. No se ha realizado una evaluación legal en este documento.

## 7. Seguridad y publicación

- Revisar la superficie de ataque real una vez definida la arquitectura; la incorporación de CMS, cuentas, API o carga de archivos cambia el alcance.
- Verificar configuración de producción, HTTPS, cabeceras, política de contenido, manejo de secretos, permisos del repositorio y proceso de actualización de dependencias.
- Si se habilitan cargas de archivos o edición autenticada, probar controles de autorización, validación de entradas, límites de tamaño y tipos, almacenamiento y recuperación.
- Confirmar dominios externos utilizados y que la política de seguridad y privacidad los contempla.
- Separar configuración de desarrollo y producción; comprobar que `allowedHosts` y cualquier otra opción de desarrollo no se trasladan indebidamente al despliegue.

## Registro de resultados

Para cada prueba completada, registrar:

| Campo | Qué anotar |
| --- | --- |
| Prueba | Nombre y pasos reproducibles. |
| Resultado | Correcta, fallida o bloqueada. |
| Entorno | URL, navegador, sistema/dispositivo y versión cuando aplique. |
| Evidencia | Captura, log o enlace a incidencia, evitando datos personales innecesarios. |
| Responsable y fecha | Quién la ejecutó y cuándo. |
| Seguimiento | Incidencia relacionada o razón por la que se acepta el resultado. |
