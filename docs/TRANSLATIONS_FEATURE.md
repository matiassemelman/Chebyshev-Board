# PRD: Internationalization (i18n) Feature

**Version:** 2.1 (Simplified, without persistence)
**Status:** Ready for implementation

---

### 1. Overview

Implement a session-based internationalization (i18n) system for **Spanish (es)** and **English (en)**, strictly respecting Clean Architecture principles.

### 2. Objectives

-   **Technical:** Integrate i18n without violating Clean Architecture dependency rule.
-   **User:** Provide clear language selection at the start of each session.
-   **Maintainability:** Architecture should be simple and allow adding new languages or texts with minimal effort.

### 3. Functional Requirements (FR)

-   **FR1: Language Loading Logic:**
    1.  When starting the application, detect browser language (`navigator.language`). Use `es` or `en` if they match; otherwise, use `en` as default.
    2.  Active language will be managed through a dedicated `LanguageContext`.

-   **FR2: Language Selection Modal:**
    1.  When loading the application, a language selection modal will always be shown.
    2.  It will offer two clear options: "Spanish" and "English", with the detected browser language pre-selected.
    3.  Upon selection, the `LanguageContext` will be updated and the modal will close.

-   **FR3: User Interface Translation:**
    1.  All static texts in the `presentation` layer will be served through the i18n system.
    2.  Validation errors from the `application` layer will return a **semantic error key** (e.g., `'validation.invalidJson'`), which the `presentation` layer will use to look up the translation.

-   **FR4: Manual Language Change:**
    1.  A `LanguageSwitcher` component will be visible in the UI.
    2.  It will allow users to change language at any time, reactively updating the `LanguageContext`.

### 4. Architecture and Technical Proposal

-   **Dependencies:**
    -   `i18next`
    -   `react-i18next`
    -   `i18next-browser-languagedetector`

-   **Proposed File Structure:**
    ```plaintext
    public/
    └─ locales/
       ├─ en/
       │  └─ translation.json
       └─ es/
          └─ translation.json
    src/
    ├─ application/
    │  └─ usecases/CalculatePathUseCase.ts   // <-- Modified to return errorKey
    ├─ infrastructure/
    │  └─ i18n/
    │     └─ config.ts                       // <-- i18next configuration
    └─ presentation/
       ├─ components/
       │  ├─ LanguageModal.tsx               // <-- New
       │  └─ LanguageSwitcher.tsx            // <-- New
       └─ context/
          └─ LanguageContext.tsx             // <-- New, for language state
    ```

### 5. Implementation Tracker

- [x] **Step 1: Setup:** Install dependencies (`i18next`, `react-i18next`, `i18next-browser-languagedetector`).
- [x] **Step 2: Translation Files:** Create `public/locales` structure and `translation.json` files with initial keys.
- [x] **Step 3: i18n Configuration:** Create `src/infrastructure/i18n/config.ts` and configure `i18next`.
- [x] **Step 4: Language Context:** Implement `LanguageContext.tsx` to manage language state.
- [x] **Step 5: Main Integration:** Wrap `App` with `LanguageProvider` and `I18nextProvider`.
- [x] **Step 6: Refactor (Application):** Modify `CalculatePathUseCase.ts` to return `errorKey`.
- [x] **Step 7: Refactor (Presentation):** Update `CoordinateInput.tsx` to use `t(state.error)`.
- [x] **Step 8: UI Components:** Create and style `LanguageModal.tsx` and `LanguageSwitcher.tsx`.
- [x] **Step 9: Complete Translation:** Replace all static texts in the `presentation` layer with the `useTranslation()` hook.
- [ ] **Step 10: Testing:** Verify all flows in both languages.