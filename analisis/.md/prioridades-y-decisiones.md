# Prioridades y decisiones

Este documento propone un orden de trabajo para abordar los riesgos descritos en el [informe de estado](./estado-web.md). Es una propuesta para acordar alcance y no implica que las mejoras estén implementadas.

## Fase 0 — Decisiones de producto y derechos

Resolver antes de invertir en la arquitectura:

1. **Titularidad y licencia**
   - Identificar titulares y autorizaciones de código, diseño, textos, imágenes, fuentes y marca.
   - Acordar qué usos se permiten, qué usos requieren pago, a quién se paga, cómo se solicita autorización y qué ocurre con obras de terceros.
   - Encargar la redacción o revisión de la licencia a una persona con competencia legal. MIT permite explotación comercial y no cumple por sí sola el objetivo descrito. No sustituirla por otra licencia sin autorización de todos los titulares afectados.
2. **Edición de proyectos**
   - Determinar si la usuaria editará contenido, cuántas personas lo harán y si necesita borradores, revisión o publicación directa.
   - Elegir entre mantener los datos en el repositorio, usar un CMS alojado o desarrollar una API/administración propia.
3. **Idiomas**
   - Confirmar idiomas, alcance de traducción y persona responsable de los textos.
4. **Medición y privacidad**
   - Decidir si se necesitan analíticas de visitas y errores, qué preguntas de negocio deben responder y qué datos se pueden recoger.
   - Evaluar el consentimiento y la política aplicable con la usuaria y asesoramiento adecuado antes de integrar herramientas.
5. **Publicación**
   - Confirmar dominio, proveedor, responsables de despliegue, recuperación, presupuesto y objetivo de disponibilidad.
6. **PWA**
   - Confirmar si la instalación en el dispositivo y el funcionamiento offline son necesidades reales; un manifest no sustituye al resto del trabajo de PWA.

## Fase 1 — Correcciones visibles y resiliencia

Priorizar, independientemente de elegir CMS:

- Añadir una página 404 para rutas desconocidas y acordar cómo deben resolverse rutas profundas en el alojamiento.
- Definir manejo de errores de interfaz y de carga de contenido, con mensajes útiles y opción de volver a una ruta segura.
- Convertir el enlace de descarga del CV en una acción accesible y mantener el archivo vigente, si la usuaria confirma que lo quiere publicar.
- Añadir un mensaje `<noscript>` que explique que la aplicación necesita JavaScript.
- Realizar una revisión responsive y corregir los fallos demostrados en tamaños objetivo.
- Validar que la tipografía genérica de respaldo sea adecuada y, si se requiere, configurar una fuente local compatible; verificar los derechos y la carga de las fuentes.
- Revisar navegación por teclado, contraste, foco, alternativas de imágenes y movimiento reducido.

## Fase 2 — Gestión editorial

Una vez elegido el flujo:

- Definir el modelo de proyecto y los bloques permitidos, incluyendo traducciones y texto alternativo.
- Implementar permisos, validación y errores de edición/publicación acordes con la solución elegida.
- Definir almacenamiento de imágenes, optimización, formatos, caché, límites, respaldo y recuperación.
- Probar el ciclo de vida completo: crear, previsualizar, publicar, editar, retirar y recuperar contenido.
- Formar a la usuaria y documentar el proceso operativo.

## Fase 3 — Privacidad, medición y observabilidad

Solo después de la decisión de la fase 0:

- Añadir analítica de visitas si existe una finalidad acordada.
- Añadir captura de errores con minimización de datos y tratamiento de información sensible.
- Implementar preferencias/consentimiento cuando sea necesario para las tecnologías seleccionadas.
- Documentar retención, accesos, exportación y eliminación de datos, y probar rechazo y retirada de consentimiento.

## Fase 4 — Rendimiento y endurecimiento de publicación

- Medir la web desplegada antes de cambiar la estrategia de caché.
- Configurar caché de recursos estáticos y políticas de actualización en el proveedor, verificando cabeceras con una segunda visita.
- Revisar cabeceras de seguridad, HTTPS, configuración de dominios y políticas para recursos externos.
- Comprobar tamaño de recursos, optimización de imágenes y tipografías; valorar una PWA solo si se aprobó ese alcance.
- Establecer actualizaciones periódicas, revisión de dependencias, copias y alertas operativas.

## Condiciones para cerrar la entrega

- Licencia aprobada y coherente con los derechos acreditados.
- Responsable y procedimiento de actualización de proyectos definidos.
- Rutas directas, 404, errores y estados degradados probados.
- Vistas móviles y accesibilidad revisadas en los dispositivos objetivo.
- CV, idiomas, analítica, consentimiento y PWA resueltos como funciones incluidas o explícitamente fuera de alcance.
- Build y lint ejecutados; pruebas y verificación de producción registradas en el [plan de validación](./plan-validacion.md).
- Propiedad de dominio, cuentas, accesos, respaldos y mantenimiento documentados para la cliente.
