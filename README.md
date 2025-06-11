# Visualizador educativo de recorridos mínimos en tableros de 8 direcciones

---

### 1 · Introducción

El objetivo del reto es construir una **mini‑aplicación web** que explique, de forma **visual y conceptual**, cómo calcular el **número mínimo de pasos** que una ficha de tablero (capaz de moverse en cualquiera de sus 8 direcciones adyacentes) necesita para visitar una serie de coordenadas dadas en orden. La app servirá como pieza didáctica. El projecto mostrará separación responsabilidades mediante **Clean Architecture**.

---

### 2 · Objetivos & Resultados clave ()

| Objetivo
| -------------------------------------------------------------------------
| 💡 **Conceptual**    Comprender el problema de distancia chebyshev en 2D.
| 🚀 **Funcional**    Mostrar gráficamente el camino mínimo.
| 🧩 **Arquitectónico**    Aplicar Clean Architecture end‑to‑end.

---

### 3 · Usuarios y roles

| Rol                                     | Necesidades clave                                                           |
| --------------------------------------- | --------------------------------------------------------------------------- |
| 👩‍💻 **Aprendiz** | • Ingresar lista de coordenadas  • Ver tablero  • Entender resultado mínimo |                        |

---

### 4 · Características

1. **Input de coordenadas** (listado editable o texto JSON).
2. **Renderizado de tablero** dinámico con posición inicial y visitas.
3. **Cálculo en tiempo real** del número mínimo de pasos usando la fórmula Chebyshev.
4. **Lista de pasos** texto (p.ej. ➜ NE, N, N).

---

### 5 · User Journey resumido

1. Usuario abre `/` → ve formulario vacío y tablero.
2. Pega `[ (0,0), (1,2), (1,3) ]` → `Calcular`.
3. Resultado: “Pasos mínimos = 3” + tablero con trayecto resaltado.
4. Puede editar la lista → UI se actualiza instantáneamente.

---

### 6 · Tech Stack

| Capa                | Herramientas                                                  |
| ------------------- | ------------------------------------------------------------- |
| **Presentación**    | React 18 + TypeScript, Vite, TailwindCSS                      |
| **Aplicación**      | Zod (validación), React Context 					|
| **Dominio**         | Clases TS puras 100 % libre de frameworks                     |

---

### 7 · Arquitectura (Clean)

```
src/
 ├─ domain/
 │   ├─ models/Coordinate.ts
 │   └─ services/PathCalculator.ts
 ├─ application/
 │   └─ usecases/CalculatePathUseCase.ts
 ├─ infrastructure/
 │   └─ persistence/LocalStoreRepository.ts
 └─ presentation/
     ├─ components/Board.tsx
     ├─ components/CoordinateList.tsx
     └─ pages/HomePage.tsx
```

Dependencias siempre **de exterior a interior** (Presentation → App → Domain). Domain no importa nada externo.

---

### 8 · Razonamiento de ingeniería

1. **Simplicidad algorítmica** El camino mínimo entre dos casillas con movimiento en 8 direcciones: `steps = max(|dx|, |dy|)`. Cualquier búsqueda de camino (BFS) sería O(n²) innecesario.
2. **Validación temprana** Se usa `Zod` para validar que cada coordenada es un entero ≥ 0.
3. **Inmutabilidad** El DOM no se usa para estado; se modela todo en TS y se proyecta a React.
4. **Visibilidad pedagógica** El tablero se re‑renderiza completo.

**Crítica**: Una micro‑lib como Immutable.js o Immer podría traer ruido extra; se descarta. Animaciones son un plus.

---

### 9 · Plan de implementación

| Paso | Archivos/Carpetas                                            | Acción exacta                                                                                               |    |   |    |                                                                               |
| ---- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | -- | - | -- | ----------------------------------------------------------------------------- |
| 1    | `npm create vite@latest pathfinde --template react-ts` | Scaffolder → commit inicial “chore: bootstrap”.                                                             |    |   |    |                                                                               |
| 2    | `src/domain/models/Coordinate.ts`                            | Define `export type Coordinate = { x:number; y:number }` + guard row ≥ 0, col ≥ 0.                          |    |   |    |                                                                               |
| 3    | `src/domain/services/PathCalculator.ts`                      | Implement `getMinSteps(coords: Coordinate[]): number` usando acumulador con \`max(| dx | , | dy | )`. Añade `export const directionBetween(a,b)\` si se quiere mostrar flechas. |
| 4    | `src/application/usecases/CalculatePathUseCase.ts`           | Orquesta: recibe string JSON, valida con Zod, llama a servicio, devuelve DTO `{steps, path}`.               |    |   |    |                                                                               |
| 5    | Presentación                                                 | Crea `presentation/components/Board.tsx` (flex‑grid 8× máxCoord) y `CoordinateList.tsx` (textarea + botón). |    |   |    |                                                                               |
| 6    | Estado global                                                | `presentation/context/PathContext.tsx` → mantiene `coords`, `steps`.                            |    |   |    |                                                                               |
| 7    | Página                                                       | `HomePage.tsx` compone Board + CoordinateList + resultado.                                                  |    |   |    |                                                                               |
| 8    | Infra                                                        | `LocalStoreRepository.ts` lee/escribe última lista. Llama en `PathContext` `useEffect`.                     |    |   |    |                                                                               |
| 9   | Style                                                        | Añade Tailwind + Prettier config. Usa clases `rounded-2xl shadow-md` en Board.                              |    |   |    |                                                                               |
| 10   | Docs                                                         | `README.md` sección “Cómo correr” + captura pantalla.                                                       |    |   |    |                                                                               |

---

### 10 · Checklist final

* [ ] Fórmula mínima `max(|dx|,|dy|)` implementada
* [ ] Clean Architecture respetada (4 capas)
* [ ] Validación input con Zod
* [ ] Board y lista son componentes desacoplados
* [ ] Estado global vía contexto/store

---
