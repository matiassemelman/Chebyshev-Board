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
