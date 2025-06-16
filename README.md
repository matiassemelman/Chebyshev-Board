# Educational Visualizer for Minimum Paths in 8-Direction Boards

[Preview on Vercel](https://chebyshev-board.vercel.app/)
---

### 1 · Introduction

The challenge's goal is to build a **mini-web application** that explains, in a **visual and conceptual** way, how to calculate the **minimum number of steps** that a board piece (capable of moving in any of its 8 adjacent directions) needs to visit a series of given coordinates in order. The app will serve as an educational piece. The project will show separation of responsibilities through **Clean Architecture**.

---

### 2 · Objectives & Key Results ()

| Objective
| -------------------------------------------------------------------------
| 💡 **Conceptual**    Understand the 2D Chebyshev distance problem.
| 🚀 **Functional**    Graphically display the minimum path.
| 🧩 **Architectural**    Apply Clean Architecture end-to-end.

---

### 3 · Features

1. **Coordinate input** (editable list or JSON text).
2. **Dynamic board rendering** with initial position and visits.
3. **Real-time calculation** of minimum steps using the Chebyshev formula.
4. **Step list** text (e.g. ➜ NE, N, N).

---

### 4 · Summarized User Journey

1. User opens `/` → sees empty form and board.
2. Pastes `[ (0,0), (1,2), (1,3) ]` → `Calculate`.
3. Result: "Minimum steps = 3" + board with highlighted path.
4. Can edit the list → UI updates instantly.

---

### 5 · Tech Stack

| Layer             | Tools                                                      |
| ------------------- | ------------------------------------------------------------- |
| **Presentation**    | React 18 + TypeScript, Vite, TailwindCSS                      |
| **Application**      | Zod (validation), React Context 					|
| **Domain**         | Pure TS classes 100% framework-free                     |

---

### 6 · Architecture (Clean)

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

Dependencies always **from outside to inside** (Presentation → App → Domain). Domain doesn't import anything external.

---

### 7 · Internationalization (i18n)

The application supports multiple languages through a session-based internationalization system:

- **Supported Languages:** Spanish (es) and English (en)
- **Features:**
  - Automatic browser language detection
  - Language selection modal on startup
  - Manual language switching through UI
  - All static texts and error messages are translated
  - Clean Architecture compliant implementation

**Tech Stack:**
- `i18next`
- `react-i18next`
- `i18next-browser-languagedetector`

**Implementation:**
```plaintext
public/
└─ locales/
   ├─ en/
   │  └─ translation.json
   └─ es/
      └─ translation.json
```

---
