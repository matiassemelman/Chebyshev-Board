# LLM Integration Analysis & Technical Specification

## 📋 Executive Summary

This document analyzes the current codebase architecture and provides technical specifications for implementing LLM-powered explanations using Groq API with the `deepseek-r1-distill-llama-70b` model.

---

## 🔍 Current System Analysis

### 🏗️ Clean Architecture Implementation Status

**✅ DOMAIN LAYER (Core Business Logic)**
- **`Coordinate.ts`**: Immutable model with pure validation
- **`PathCalculator.ts`**: Chebyshev algorithm `max(|dx|, |dy|)` + total steps calculation
- **`CoordinateRepository.ts`**: Persistence interface (DIP pattern)

**✅ APPLICATION LAYER (Orchestration)**
- **`CalculatePathUseCase.ts`**: Orchestrates JSON parsing → Zod validation → domain services

**✅ INFRASTRUCTURE LAYER (Technical Implementation)**
- **`LocalStorageRepository.ts`**: Robust implementation with Zod validation and error handling
- **`i18n/config.ts`**: Complete setup for es/en with http backend

**✅ PRESENTATION LAYER (UI/State)**
- **`PathContext.tsx`**: Global state with useReducer (Redux pattern) + automatic persistence
- **`Board.tsx`**: Dynamic grid rendering + educational visualization
- **`CoordinateInput.tsx`**: Controlled input with real-time visual validation

### 🔗 Current Data Flow

```
1. USER INPUT → CoordinateInput component
2. JSON CHANGE → PathContext dispatch('SET_COORDINATES_JSON')
3. CALCULATE → CalculatePathUseCase → Domain services
4. RESULT → PathContext state update
5. VISUAL → Board + CoordinateInput reactive rendering
6. PERSIST → LocalStorageRepository automatic
```

### 🔴 Critical Gap Analysis

**MISSING COMPONENT**: The system currently lacks **individual movement steps** (NE, N, S, E, etc.). Current system only:
- Calculates **total distance** between coordinates
- Shows **coordinate sequence** `(0,0) → (1,2) → (3,1)`
- **DOES NOT** decompose individual movements required by PRD for explanations

---

## 🚀 Groq API Integration Specifications

### 📋 Technical Configuration

**✅ API Setup:**
- **Model**: `deepseek-r1-distill-llama-70b`
- **Authentication**: Environment variable `GROQ_API_KEY`
- **Documentation**: [Groq Quickstart](https://console.groq.com/docs/quickstart)

**✅ Recommended Implementation: Vercel AI SDK**

```bash
pnpm add ai @ai-sdk/groq
```

```typescript
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('deepseek-r1-distill-llama-70b'),
  prompt: 'Educational prompt here...',
});
```

**✅ Advantages for Our Stack:**
- **TypeScript native**: Perfect fit with our codebase
- **React integration**: Built-in hooks for loading states
- **Streaming support**: Progressive loading of explanations
- **Error handling**: Robust out-of-the-box
- **Automatic retries**: Reliability patterns included

### 🔧 Alternative: Direct Groq Client

```typescript
import { Groq } from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const response = await client.chat.completions.create({
  messages: [
    { role: "system", content: "Educational mathematics tutor..." },
    { role: "user", content: "Explain this movement..." }
  ],
  model: "deepseek-r1-distill-llama-70b",
});
```

---

## 📦 Required New Components

### 🏗️ Architecture Extensions

```
src/
├─ domain/
│  ├─ models/
│  │  └─ Movement.ts              ← NEW: Represents NE, N, etc. directions
│  ├─ services/
│  │  ├─ MovementCalculator.ts    ← NEW: Decomposes paths into movements
│  │  └─ ExplanationService.ts    ← NEW: Generates educational prompts
│  └─ repositories/
│     └─ ExplanationRepository.ts ← NEW: Interface for LLM cache
├─ application/
│  └─ usecases/
│     └─ GetStepExplanationUseCase.ts ← NEW: Orchestrates LLM calls + cache
├─ infrastructure/
│  ├─ persistence/
│  │  └─ ExplanationCacheRepository.ts ← NEW: Implements local cache
│  └─ llm/
│     └─ GroqClient.ts            ← NEW: API client with retry/fallback
└─ presentation/
   ├─ components/
   │  ├─ StepsList.tsx             ← NEW: Clickable list of movements
   │  ├─ ExplanationPanel.tsx      ← NEW: Drawer/tooltip for explanations
   │  └─ ExplanationButton.tsx     ← NEW: Toggle explanation mode
   └─ context/
      └─ ExplanationContext.tsx    ← NEW: LLM state separate from path
```

### 🎯 Core Models to Implement

**Movement Model:**
```typescript
export type Movement = {
  readonly direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  readonly from: Coordinate;
  readonly to: Coordinate;
  readonly stepNumber: number;
};
```

**Explanation Model:**
```typescript
export type StepExplanation = {
  readonly movement: Movement;
  readonly explanation: string;
  readonly cached: boolean;
  readonly timestamp: number;
};
```

---

## 💡 Architectural Recommendations

### 🔒 Separation of Concerns

1. **Independent Context**: Create `ExplanationContext` separate from `PathContext`
2. **Progressive Enhancement**: Explanation mode as opt-in feature, non-invasive
3. **Repository Pattern**: Cache explanations with TTL using same pattern as coordinates
4. **Error Boundaries**: Specific for LLM failures without affecting core functionality
5. **Performance First**: Debouncing + skeleton states for smooth UX

### 🚀 Implementation Strategy

**Phase 1: Foundation**
- Implement Movement model and MovementCalculator service
- Create StepsList component to display clickable individual movements
- Extend PathContext to include movements data

**Phase 2: LLM Integration**
- Implement GroqClient in infrastructure layer
- Create ExplanationContext with loading/error states
- Add ExplanationPanel component with drawer/tooltip UI

**Phase 3: Optimization**
- Implement explanation caching with TTL
- Add debouncing for hover interactions
- Performance optimization and error recovery

### 🌐 Internationalization Support

**Multilingual Prompts:**
```typescript
const getPromptTemplate = (language: 'en' | 'es') => {
  const templates = {
    en: "Explain why this movement from {from} to {to} in direction {direction} is optimal for Chebyshev distance...",
    es: "Explica por qué este movimiento de {from} a {to} en dirección {direction} es óptimo para la distancia Chebyshev..."
  };
  return templates[language];
};
```

### 🎯 User Experience Flow

```
1. User calculates path → Shows board + coordinate sequence
2. User clicks "Enable Explanations" → Shows individual movement steps
3. User clicks on specific step → Triggers LLM explanation
4. Loading state → Skeleton loader in drawer/tooltip
5. Explanation loaded → Rich text with educational content
6. Cache stored → Subsequent clicks are instant
```

---

## 🔧 Technical Considerations

### ⚡ Performance Optimizations

- **Debouncing**: 300ms delay for hover interactions
- **Cache Strategy**: localStorage with 24h TTL
- **Lazy Loading**: LLM client only loaded when explanation mode enabled
- **Token Optimization**: Prompt templates with minimal context injection

### 🛡️ Error Handling Strategy

- **Graceful Degradation**: Static explanations as fallback
- **Retry Logic**: Exponential backoff for API failures
- **User Feedback**: Clear loading states and error messages
- **Non-Blocking**: LLM failures don't break core functionality

### 🔐 Security & Environment

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
```

```typescript
// Vite environment variable handling
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
```

---

## 📊 Success Metrics

### 🎯 Performance Targets (from PRD)

- **Response Time**: < 1s for 75% of LLM calls (with cache)
- **Error Rate**: < 5% for API failures
- **Cache Hit Rate**: > 60% for repeated explanations
- **User Engagement**: Explanation feature used in > 40% of sessions

### 🔍 Monitoring Points

- API response times and error rates
- Cache efficiency and storage usage
- User interaction patterns with explanations
- Educational value through user feedback

---

## 🚀 Next Steps

1. **Finalize PRD**: Complete product requirements document
2. **Environment Setup**: Configure Groq API key and test connection
3. **Movement Model**: Implement core domain logic for individual steps
4. **UI Prototype**: Create basic StepsList and ExplanationPanel components
5. **LLM Integration**: Implement GroqClient with error handling
6. **Testing**: Comprehensive testing of explanation generation
7. **Performance**: Optimize with caching and debouncing
8. **Documentation**: Update README and create usage guides

---

*This analysis provides the foundation for implementing educational LLM explanations while maintaining the clean architecture principles and ensuring robust, performant user experience.*