## 📈 Tracker de Desarrollo

### **ETAPA 1: Configuración Base**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 1.1 | ✅ | Instalar dependencias (Zod, TailwindCSS) |
| 1.2 | ✅ | Configurar TailwindCSS con Vite |
| 1.3 | ✅ | Limpiar archivos template de Vite |
| 1.4 | ⬜ | Crear estructura de carpetas Clean Architecture |

**Entregable**: Proyecto listo para desarrollo con estructura base.

---

### **ETAPA 2: Capa de Dominio**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 2.1 | ⬜ | Crear `Coordinate.ts` con tipo y validaciones |
| 2.2 | ⬜ | Implementar `PathCalculator.ts` con lógica Chebyshev |
| 2.3 | ⬜ | Crear tests unitarios básicos |

**Entregable**: Lógica core del cálculo de distancia funcional.

---

### **ETAPA 3: Capa de Aplicación**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 3.1 | ⬜ | Crear `CalculatePathUseCase.ts` con orquestación |
| 3.2 | ⬜ | Implementar validación con Zod schemas |

**Entregable**: Caso de uso completo con validación.

---

### **ETAPA 4: Capa de Infraestructura**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 4.1 | ⬜ | Crear `LocalStorageRepository.ts` para persistencia |

**Entregable**: Persistencia local funcional.

---

### **ETAPA 5: Capa de Presentación - Base**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 5.1 | ⬜ | Crear `PathContext.tsx` para estado global |
| 5.2 | ⬜ | Implementar `CoordinateInput.tsx` |
| 5.3 | ⬜ | Crear `Board.tsx` básico sin estilos |

**Entregable**: Componentes funcionales básicos.

---

### **ETAPA 6: Capa de Presentación - UI/UX**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 6.1 | ⬜ | Estilizar `Board.tsx` con TailwindCSS |
| 6.2 | ⬜ | Mejorar `CoordinateInput.tsx` con validación visual |
| 6.3 | ⬜ | Crear `StepsDisplay.tsx` para mostrar resultado |

**Entregable**: UI pulida y funcional.

---

### **ETAPA 7: Integración y Página Principal**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 7.1 | ⬜ | Crear `HomePage.tsx` integrando todos los componentes |
| 7.2 | ⬜ | Conectar con contexto y casos de uso |

**Entregable**: Aplicación completamente funcional.

---

### **ETAPA 8: Pulimiento**
| Tarea | Estado | Tiempo Est. | Descripción |
|-------|--------|-------------|-------------|
| 8.2 | ⬜ | Optimizaciones de performance |
| 8.3 | ⬜ | Documentación final |

---

## 📊 Resumen del Proyecto

### 🎯 Objetivos Clave
- ✅ Implementar Clean Architecture estricta
- ✅ Algoritmo Chebyshev para distancia mínima
- ✅ Interfaz educativa intuitiva
- ✅ Validación robusta con Zod
- ✅ Estado reactivo con Context API

### 🏛️ Arquitectura Final
```
src/
├── domain/
│   ├── models/Coordinate.ts
│   └── services/PathCalculator.ts
├── application/
│   └── usecases/CalculatePathUseCase.ts
├── infrastructure/
│   └── persistence/LocalStorageRepository.ts
└── presentation/
    ├── components/
    │   ├── Board.tsx
    │   ├── CoordinateInput.tsx
    │   └── StepsDisplay.tsx
    ├── context/PathContext.tsx
    └── pages/HomePage.tsx
```

### 🚀 Criterios de Éxito
- [ ] Fórmula mínima `max(|dx|,|dy|)` implementada
- [ ] Clean Architecture respetada (4 capas)
- [ ] Validación input con Zod
- [ ] Board y lista son componentes desacoplados
- [ ] Estado global vía contexto/store
- [ ] UI responsiva y educativa
- [ ] Persistencia en localStorage

---

## 📝 Notas de Desarrollo

### Principios a Seguir
1. **Inmutabilidad primero**: Estado predecible, sin mutaciones directas
2. **Validación temprana**: Input sanitization y error handling robusto
3. **Simplicidad algorítmica**: Preferir soluciones O(n) sobre búsquedas innecesarias
4. **Separación de responsabilidades**: Domain models sin dependencias externas

### Tecnologías Confirmadas
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS + @tailwindcss/forms
- **Validación**: Zod
- **Estado**: React Context API
- **Persistencia**: localStorage
- **Testing**: Manual + unitarios básicos

### Estructura de Archivos Críticos
- `domain/`: Lógica pura sin dependencias externas
- `application/`: Casos de uso y orquestación
- `infrastructure/`: Persistencia y servicios externos
- `presentation/`: Componentes React y UI

---