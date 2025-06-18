1. Resumen ejecutivo
Añadiremos un “modo explicación” que permita al usuario obtener, en lenguaje natural y en tiempo real, el porqué de cada movimiento de la pieza dentro del visualizador de caminos mínimos. Al hacer hover o clic sobre cualquier paso, se abrirá un pequeño panel (tooltip o side-panel) con la descripción generada por un LLM, conectando la teoría (distancia Chebyshev) con la visualización práctica. El objetivo principal es profundizar la comprensión y aumentar el engagement sin sobrecargar la UI.

2. Problema / oportunidad
Usuarios principiantes entienden qué ruta es óptima pero no por qué cada paso vale “1”.

Los materiales teóricos (blogs, papers) están desconectados de la práctica visual.

Una explicación contextual convierte al visualizador en un tutor interactivo, diferenciador frente a recursos estáticos.

3. Público objetivo
Estudiantes de CS / secundaria que aprenden heurísticas de distancia.

4. Historias de usuario clave
P0	Estudiante	pasar el cursor sobre un paso	entender en palabras simples el motivo de ese movimiento

5. Experiencia de usuario (happy path)
Usuario ingresa coordenadas y pulsa Calcular.

Se muestra el tablero con la ruta y lista de pasos.

clic sobre el paso “NE” ⇒ aparece drawer:

“Explicación del paso seleccionado”

Usuario avanza al siguiente paso; panel se actualiza al instante.

6. Requerimientos funcionales
F1. Activador: click

F2. Generación LLM: pasar sólo el paso actual + coordenadas origen/destino

F3 Idiomas: usar idioma preferido por el usuario.

8. Requerimientos no-funcionales
Rendimiento: tiempo de espera < 1 s en 75 % de llamadas (con caché).

9. Dependencias
Tipo	Detalle
API LLM	OpenAI GPT-4o (o equivalente).
Diseño	Ajustes UI/UX de tooltip y panel lateral.
i18n	Reutilizar arquitectura existente con i18next.
DevOps	Variable de entorno LLM_API_KEY, monitoreo costes.

10. Riesgos y mitigaciones
Riesgo	Impacto	Mitigación
Latencia alta	Mala UX	Cache local + mostrar skeleton loader
Coste impredecible	Presupuesto excedido	Límite de tokens y prompt truncation
Respuestas inexactas	Desconfianza pedagógica	Prompt estricto + validación básica en dominio