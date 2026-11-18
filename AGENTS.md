# Guía de desarrollo

Estas instrucciones se aplican a todo el repositorio. Antes de modificar código, lee este archivo y las notas de arquitectura vigentes en `KNOWLEDGE.md`. Conserva los cambios locales ajenos a la tarea.

## Flujo de trabajo

1. Define el comportamiento esperado, casos límite y restricciones antes de editar.
2. Inspecciona la ruta, página, componente, tipo y datos relacionados; reutiliza las abstracciones locales cuando encajen.
3. Elige la solución más simple que satisfaga el requisito. Comprueba el impacto en rutas, tipos, datos, accesibilidad, tests y documentación.
4. Limita el cambio a piezas cohesionadas de la tarea. No hagas refactors amplios, cambios visuales incidentales ni actualices dependencias sin una necesidad demostrable.
5. Al finalizar, ejecuta las comprobaciones pertinentes disponibles (`npm run lint` y/o `npm run build`), corrige los problemas introducidos e informa con precisión de cambios, comandos ejecutados y limitaciones. Nunca declares una comprobación no ejecutada.

## Código mantenible

- Aplica KISS: no añadas capas, patrones, utilidades genéricas o dependencias si una solución local y clara basta. Aplica SOLID solo cuando reduzca un acoplamiento o una responsabilidad real.
- Nombra componentes, props, estados, funciones y tipos por intención y dominio. Los booleanos deben leerse como una pregunta (`isOpen`, `hasLoaded`); evita abreviaturas y valores mágicos sin nombre cuando su significado no sea obvio.
- Mantén funciones, hooks y componentes cohesionados. Extrae lógica auxiliar solo si aclara una responsabilidad o se reutiliza; no persigas un límite artificial de líneas.
- Evita anidamientos y condiciones densas: usa guard clauses cuando simplifiquen el flujo. No mezcles I/O, estado de interfaz y transformación de datos en una misma unidad si separarlos mejora la comprensión.
- Elimina código muerto, parámetros, imports y estado sin uso. No dupliques lógica relevante, pero no fuerces una abstracción entre elementos que pueden evolucionar de forma distinta.
- Escribe código autoexplicativo. Los comentarios deben documentar el porqué, una restricción o un caso no evidente; no describir JSX o instrucciones evidentes.
- No ocultes fallos ni uses `catch` vacíos. Maneja errores en el límite adecuado y ofrece un estado o mensaje útil conforme a los patrones de la aplicación.

## React, TypeScript y UI

- Usa TypeScript estricto: declara contratos de props y datos de dominio, estrecha valores opcionales antes de usarlos y evita `any`, aserciones inseguras y casts de datos externos salvo tras validarlos.
- Conserva la estructura actual: rutas en `src/routes`, páginas en `src/pages`, componentes reutilizables en `src/components`, contratos en `src/types` y contenido estático en `src/assets`. No conviertas componentes de presentación en servicios globales sin motivo.
- Un componente debe representar una unidad de interfaz coherente. Mantén estado lo más cerca posible de quien lo consume; eleva estado o crea un hook solo si varios consumidores lo necesitan.
- Respeta las reglas de hooks y dependencias. En efectos, limpia listeners, observadores, `requestAnimationFrame` y animaciones de GSAP. No uses efectos para valores que pueden derivarse durante el render.
- Para interacciones no semánticas, usa el elemento HTML correcto (`button`, `Link`, etc.), teclado y etiquetas accesibles. Toda imagen informativa requiere `alt` significativo; deja `alt=""` solo para imágenes decorativas.
- Mantén las clases Tailwind y estilos coherentes con los componentes cercanos. Extrae constantes de estilo solo si se reutilizan o expresan una intención clara; evita cambios puramente cosméticos fuera del alcance.
- Al cambiar rutas, conserva los paths y navegación existentes salvo requisito explícito. Trata parámetros de URL y contenido JSON como entradas no confiables: valida formato y gestiona el caso no encontrado.

## Datos, seguridad y dependencias

- Mantén `Project`, `ContentBlock` y el JSON de proyectos sincronizados. Si cambia el contrato, actualiza sus consumidores y valida campos opcionales antes de renderizarlos.
- Valida entradas en el borde de la aplicación. No incluyas secretos en cliente, repositorio, logs ni mensajes de error; no introduzcas HTML sin sanitizar ni URLs/recursos dinámicos sin necesidad y validación.
- Usa las dependencias instaladas antes de añadir otra. Cualquier dependencia nueva debe tener una justificación concreta, integrarse de forma mínima y actualizar los artefactos de bloqueo correspondientes.

## Pruebas y revisión

- Para cambios de comportamiento, añade o actualiza pruebas cuando exista infraestructura adecuada. El proyecto no tiene script de tests actualmente: no instales un framework ni crees una batería paralela sin que la tarea lo justifique.
- No modifiques expectativas de pruebas solo para que pasen; primero confirma el comportamiento requerido.
- Antes de entregar, revisa que los nombres, contratos, manejo de errores, accesibilidad, tipos y efectos sigan siendo legibles y que el diff no incluya cambios ajenos.
