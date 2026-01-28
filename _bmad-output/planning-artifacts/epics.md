---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - 'prd.md'
  - 'architecture.md'
  - 'ux-design-specification.md'
status: 'complete'
validationDate: '2026-01-28'
---

# Tablas1 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Tablas1, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR-1: Sistema de Mapa Solar (Dashboard Principal)**
- Pantalla principal que muestra el sistema solar interactivo con 8 planetas representando tablas del 2 al 9
- Estados visuales: Locked (gris), Unlocked (brillante), Completed (iluminado + estrellas)
- Contador de estrellas totales siempre visible
- Tap en planeta unlocked inicia sesión inmediatamente
- Tap en planeta completed permite rejugar para mejorar estrellas
- Mapa carga en <3 segundos

**FR-2: Sistema de Juego por Planeta (Core Gameplay)**
- Sesión de 15-20 preguntas de multiplicación por planeta
- Transición inmediata de mapa a juego sin menús
- Teclado numérico custom para input de respuestas
- Feedback visual inmediato (<300ms): verde = correcto, rojo suave = incorrecto
- Permitir múltiples intentos por pregunta sin penalización
- Indicador de progreso en sesión (pregunta X de 20)
- Preguntas en orden aleatorio
- Calcular % aciertos y asignar estrellas al completar
- Vuelta automática al mapa tras completar sesión

**FR-3: Sistema de Estrellas y Progresión**
- Tres niveles: Bronce (70-84%), Plata (85-94%), Oro (95-100%)
- Desbloqueo secuencial: completar con mín. 70% desbloquea siguiente planeta
- Rejugar planeta mejora estrellas (reemplaza nivel anterior)
- Pantalla de celebración al completar planeta
- Mensaje diferenciado para primera vez vs mejora
- Animación de desbloqueo para siguiente planeta

**FR-4: Persistencia de Progreso (LocalStorage)**
- Guardado automático tras cada sesión
- Estado completo del juego persiste: planetas, estrellas, accuracy, intentos
- Recuperación instantánea al abrir app
- Datos versionados para futuras migraciones
- Manejo graceful de errores: storage lleno, datos corruptos, storage no disponible

**FR-5: Pantallas de Transición y Feedback**
- Pantalla de celebración tras completar planeta (auto-avanza en 2-3s)
- Feedback de respuesta: flash verde grande (correcta), "¡Inténtalo de nuevo!" (incorrecta)
- Animación de desbloqueo de planeta siguiente

**FR-6: Interfaz de Usuario Móvil**
- Layout responsive: 320px - 428px width (mobile-first)
- Touch targets: planetas 72-96px, botones 56x56px mínimo
- Tipografía móvil: pregunta 40px bold, feedback 32px bold, mínimo 16px
- Paleta de colores espacial definida (#0a0e27 background, #2563eb primary, etc.)
- Contraste WCAG AA cumplido

**FR-7: Lógica de Juego y Reglas**
- Solo primer planeta (tabla del 2) desbloqueado al inicio
- Desbloqueo secuencial (no se puede saltar planetas)
- Múltiples intentos por pregunta permitidos
- Solo primer intento cuenta para % aciertos
- Salir a mitad de sesión no guarda progreso parcial
- Mejoras de estrellas sin restricción

### NonFunctional Requirements

**Performance:**
- Carga inicial: <3 segundos (First Load)
- Carga recurrente: <1 segundo (PWA cached)
- Feedback respuesta: <300ms
- Animaciones: 60fps sin drops
- Bundle size: <2MB total

**Reliability:**
- Data Loss: 0% (LocalStorage con manejo de errores)
- Crash Rate: <1% (manejo de errores graceful)
- Uptime: N/A (offline-first después de primera carga)

**Usability:**
- Onboarding: 0 segundos (auto-explicativo)
- Learning Curve: Inmediato para niño de 8 años
- Touch Accuracy: 95%+ (targets grandes, spacing adecuado)

**Compatibility:**
- Chrome Android: 100% funcional (target primario)
- Chrome Desktop: 95% funcional
- Safari iOS: 90% funcional (testing básico)
- Offline: 100% funcional post-primera-carga

**Maintainability:**
- Código comentado solo donde lógica es no obvia
- Estructura modular con componentes reutilizables
- Testing: Tests unitarios para lógica de juego crítica

### Additional Requirements

**From Architecture:**

**Starter Template:**
- Vite + React 18 + TypeScript 5+
- Setup commands documented en Architecture (Step 0.1)
- Instalación de Tailwind CSS 3.x + PostCSS + Autoprefixer
- vite-plugin-pwa con Workbox para PWA capabilities
- Framer Motion ~11.x para animaciones
- @types/node para path aliases

**Technology Stack:**
- **State Management**: Zustand ~4.x (~1KB gzipped, re-renders optimizados)
- **Styling**: Tailwind CSS 3.x con paleta customizada espacial
- **Animations**: Framer Motion para transiciones + SVG para planetas + Canvas para partículas
- **Testing**: Vitest + React Testing Library (recomendado)
- **PWA**: Service Worker con cache-first strategy, manifest.json configurado

**Component Architecture:**
- Feature-based + Atomic Design híbrido
- Estructura de carpetas definida: components/ (ui/, game/, layout/), features/ (solar-map/, gameplay/, progression/, persistence/), store/, types/, utils/, constants/
- Naming conventions: PascalCase componentes, camelCase hooks/utils, UPPER_SNAKE_CASE constantes

**Persistencia Strategy:**
- Custom LocalStorage hooks con optimistic updates
- Zustand middleware para auto-save en acciones críticas
- Data versioning para migraciones futuras
- Error handling: storage full, unavailable, corrupt data

**Performance Budget:**
- Framer Motion animations: 16ms frame budget (60fps)
- Canvas particles: RequestAnimationFrame loop optimizado
- Tree-shaking y code splitting automáticos

**From UX Design:**

**Responsive Design:**
- Mobile-first: 320px - 428px width primario
- Orientación: Portrait (vertical) primaria
- Landscape: Funciona pero no optimizado

**Touch Targets:**
- Planetas: 72px - 96px diámetro
- Botones: 56px × 56px mínimo
- Teclado numérico: 56px × 56px por tecla
- Spacing entre targets: 8px mínimo

**Tipografía:**
- Font family: Poppins (sans-serif)
- Pregunta matemática: 40px bold
- Feedback mensajes: 32px bold
- Contadores: 24px semibold
- Mínimo: 16px

**Color Palette (Espacial):**
- Background: #0a0e27 (space dark)
- Cards: #1a2332 (space navy)
- Primary: #2563eb (space blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Gold: #fbbf24 (stars)

**Accessibility:**
- WCAG AA contraste cumplido
- Touch targets mínimo 48px
- Sin dependencia de sonido (feedback visual rico)

**Progressive Web App:**
- PWA con caché agresivo para carga instantánea
- Instalable desde navegador
- Splash screen con tema espacial
- Funcionalidad offline esencial
- Sin vibraciones hápticas ni notificaciones push

### FR Coverage Map

**FR-1 (Mapa Solar):** Epic 1 - Dashboard visual con planetas y contador de estrellas
**FR-2 (Core Gameplay):** Epic 2 - Sesiones de juego con feedback inmediato
**FR-3 (Sistema de Estrellas):** Epic 3 - Bronce/Plata/Oro y desbloqueo secuencial
**FR-4 (Persistencia):** Epic 3 - LocalStorage con auto-save y recovery
**FR-5 (Transiciones):** Epic 2 (feedback respuestas) + Epic 3 (celebraciones)
**FR-6 (Interfaz Móvil):** Epic 1 (layout base) + Epic 2 (completar UI)
**FR-7 (Lógica de Juego):** Epic 2 - Reglas, cálculos, generación aleatoria

**NFRs (Performance/Reliability/Offline):** Epic 4 - PWA y optimización
**Additional (Starter):** Epic 0 - Setup del proyecto
**Additional (Stack/Architecture):** Epic 0-4 - Aplicado en toda implementación

## Epic List

### Epic 0: Foundation & Project Setup

**Goal:** Inicializar el proyecto con todo el tooling necesario para desarrollo. Desarrolladores pueden empezar a crear features.

**User Outcome:** El proyecto está configurado con Vite, React, TypeScript, Tailwind CSS, PWA capabilities, y estructura de carpetas base. Los desarrolladores tienen un ambiente de desarrollo funcional.

**FRs covered:** Additional Requirements (Starter Template)

**Technical Implementation:**
- Ejecutar comandos de inicialización del Architecture document
- Vite + React 18 + TypeScript 5+ setup
- Tailwind CSS 3.x con paleta espacial configurada (#0a0e27, #2563eb, #fbbf24, etc.)
- vite-plugin-pwa con Workbox configurado
- Framer Motion ~11.x instalado
- Zustand ~4.x instalado
- Estructura de carpetas: components/ (ui/, game/, layout/), features/ (solar-map/, gameplay/, progression/, persistence/), store/, types/, utils/, constants/
- Path aliases configurados (@/ → ./src/*)
- Poppins font family configurada

---

### Epic 1: Exploración del Mapa Solar

**Goal:** Permitir al niño explorar visualmente su progreso en un mapa solar hermoso y interactivo.

**User Outcome:** El niño puede abrir la app y ver un mapa solar con 8 planetas representando tablas del 2-9. Puede identificar visualmente planetas bloqueados, desbloqueados, y completados. Ve su contador de estrellas totales.

**FRs covered:** FR-1 (Mapa Solar), FR-6 (Interfaz Móvil - parcial)

**Technical Implementation:**
- Dashboard principal como pantalla de inicio
- 8 componentes de planeta con estados visuales: locked (gris/opaco), unlocked (brillante con efecto glow), completed (iluminado + estrellas flotantes)
- Primer planeta (tabla del 2) desbloqueado por defecto, resto locked
- Contador de estrellas totales en header (visible siempre)
- Layout responsive 320px-428px width (mobile-first)
- Touch targets: 72-96px diámetro para planetas
- Spacing: 8px mínimo entre elementos
- Paleta de colores espacial aplicada
- Tipografía: Poppins, 24px para contadores
- SVG para iconos de planetas (escalables, coloreables)
- **Nota:** En este epic, tap en planeta NO inicia juego aún (implementado en Epic 2)

---

### Epic 2: Jugar y Aprender

**Goal:** Permitir al niño jugar sesiones de multiplicaciones con feedback visual inmediato y satisfactorio.

**User Outcome:** El niño puede tocar un planeta desbloqueado y jugar una sesión completa de 15-20 preguntas de multiplicación. Recibe feedback visual instantáneo, ve su progreso en la sesión, y completa el planeta calculando su % de aciertos.

**FRs covered:** FR-2 (Core Gameplay), FR-5 (Feedback visual), FR-6 (Interfaz Móvil - completar), FR-7 (Lógica de Juego)

**Technical Implementation:**
- **Navegación:** Tap en planeta unlocked → transición inmediata (<500ms) a pantalla de juego
- **GameSession component:** Pantalla de juego con pregunta grande (40px bold)
- **Question generation:** Algoritmo para generar 15-20 preguntas aleatorias de la tabla correspondiente (sin repetición en sesión)
- **NumericKeyboard component:** Teclado custom con botones 56x56px, números 0-9, Borrar, Enviar
- **Feedback inmediato:** <300ms tras responder
  - Correcto: Flash verde grande con animación Framer Motion
  - Incorrecto: Texto "¡Inténtalo de nuevo!" en rojo suave, respuesta se borra
- **Progress indicator:** "Pregunta X de 20" visible siempre
- **Lógica de múltiples intentos:** Permitir reintentar, solo primer intento cuenta para % aciertos
- **Cálculo de accuracy:** Al completar 15-20 preguntas, calcular % = (correctas primer intento) / total
- **Transición de vuelta:** Automática al mapa tras completar sesión
- **Botón Salir:** En esquina, vuelve al mapa (progreso parcial NO se guarda en este epic)
- Zustand store para game session state: currentPlanet, questions, currentQuestionIndex, sessionAnswers

---

### Epic 3: Progresar y Coleccionar Estrellas

**Goal:** Permitir al niño desbloquear planetas secuencialmente, ganar estrellas según rendimiento, y guardar su progreso automáticamente.

**User Outcome:** El niño puede desbloquear nuevos planetas al completar el anterior con mínimo 70% de aciertos. Gana estrellas (Bronce/Plata/Oro) según su rendimiento. Puede rejugar planetas para mejorar estrellas. Su progreso se guarda automáticamente y se recupera al volver a abrir la app.

**FRs covered:** FR-3 (Sistema de Estrellas), FR-4 (Persistencia), FR-5 (Celebraciones - completar)

**Technical Implementation:**
- **Star system:** Función calculateStars(accuracy) → 0-3 estrellas
  - Bronce (1 estrella): 70-84% aciertos
  - Plata (2 estrellas): 85-94% aciertos
  - Oro (3 estrellas): 95-100% aciertos
- **Celebration Screen:** Pantalla post-sesión con:
  - Título: "¡Planeta Conquistado!" o "¡MEJORADO!"
  - Estrellas ganadas (animación con Framer Motion)
  - Mensaje según nivel (Bronce/Plata/Oro)
  - Auto-avance después de 2-3 segundos
- **Unlock logic:** Si accuracy >= 70%, desbloquear planeta siguiente
- **Unlock animation:** Al volver al mapa, planeta siguiente se ilumina con animación (1-2s)
- **Replay mechanism:** Tap en planeta completed → rejugar, reemplazar estrellas anteriores
- **LocalStorage persistence:**
  - Schema versionado (v1.0): `{ version, lastUpdated, gameState: { planets: [...], totalStars, currentStreak } }`
  - Auto-save tras completar sesión
  - Load al inicializar app (en gameStore)
  - Error handling: try-catch con fallbacks
    - Storage full → advertencia suave, intentar cleanup
    - Storage unavailable → modo fallback en memoria con warning
    - Corrupt data → reset a estado inicial + notificación
- **Zustand middleware:** Intercepta completeSession action para trigger auto-save
- Actualizar contador de estrellas totales en dashboard
- Planeta completed muestra estrellas flotantes en el mapa

---

### Epic 4: Pulir, Optimizar y PWA

**Goal:** Optimizar rendimiento, asegurar carga instantánea, y habilitar funcionalidad offline completa vía PWA.

**User Outcome:** El niño experimenta carga instantánea (<3s primera vez, <1s recurrente), animaciones fluidas a 60fps, y la app funciona 100% offline después de la primera carga. Puede instalar la app como PWA desde el navegador.

**FRs covered:** NFR (Performance, Reliability, Offline), Additional Requirements (PWA)

**Technical Implementation:**
- **PWA Configuration:**
  - Service Worker con Workbox (cache-first strategy para assets)
  - manifest.json completo: name, short_name, description, theme_color (#0a0e27), background_color, icons (192x192, 512x512)
  - Splash screen espacial configurado
  - Instalabilidad desde navegador testeada
- **Performance optimization:**
  - Code splitting: React.lazy() para CelebrationScreen y ParticleSystem (lazy load no críticos)
  - Tree-shaking verificado: imports específicos (ej: `import { useState } from 'react'`)
  - Bundle analysis: `npm run build -- --mode analyze`
  - Bundle size <2MB verificado
- **Animation optimization:**
  - Framer Motion: 16ms frame budget (60fps) verificado
  - Canvas para sistema de partículas (confeti espacial) con RequestAnimationFrame optimizado
  - CSS transitions para efectos simples (glow, pulse)
- **Performance verification:**
  - Carga inicial <3s (First Contentful Paint) testeada en 4G
  - Carga recurrente <1s (PWA cached) testeada
  - Feedback <300ms verificado
  - Lighthouse PWA Score > 90
- **Testing:**
  - Vitest + React Testing Library configurado
  - Tests unitarios para lógica crítica: calculateStars, question generation, accuracy calculation
  - Tests de componentes UI críticos: NumericKeyboard, QuestionCard
- **Error boundaries:**
  - React Error Boundary component para crashes graceful
  - Fallback UI con mensaje amigable
- **Offline verification:**
  - Primera carga → Service Worker activo
  - Cerrar conexión → app sigue funcionando 100%
  - LocalStorage persiste offline

---

## Epic 0: Foundation & Project Setup

### Story 0.1: Initialize Vite + React + TypeScript Project

As a developer,
I want the project initialized with Vite, React 18, and TypeScript 5+,
So that I have a modern, fast development environment ready.

**Acceptance Criteria:**

**Given** I am starting a new project
**When** I execute the initialization commands from Architecture document
**Then** I have a working Vite + React + TypeScript project structure
**And** `npm run dev` starts the dev server successfully on port 5173
**And** `npm run build` creates a production build in `dist/` folder
**And** TypeScript strict mode is enabled in `tsconfig.json`
**And** React 18 is installed with `react` and `react-dom` packages
**And** Vite config exists at `vite.config.ts`

---

### Story 0.2: Configure Tailwind CSS with Space Theme

As a developer,
I want Tailwind CSS configured with the space-themed color palette,
So that I can style components using consistent spacing colors.

**Acceptance Criteria:**

**Given** the base project is initialized
**When** I configure Tailwind CSS with the custom theme
**Then** Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) are in `src/index.css`
**And** `tailwind.config.js` exists and includes custom colors:
  - `space-dark: '#0a0e27'`
  - `space-navy: '#1a2332'`
  - `space-blue: '#2563eb'`
  - `success: '#10b981'`
  - `warning: '#f59e0b'`
  - `gold: '#fbbf24'`
**And** Poppins font family is configured as default `sans-serif` in theme
**And** PostCSS config exists with Tailwind and Autoprefixer plugins
**And** I can use Tailwind classes (e.g., `bg-space-dark`, `text-gold`) in components
**And** `npm run dev` compiles Tailwind styles correctly

---

### Story 0.3: Configure PWA with vite-plugin-pwa

As a developer,
I want vite-plugin-pwa configured with basic PWA capabilities,
So that the app can be installed and work offline.

**Acceptance Criteria:**

**Given** Tailwind is configured
**When** I install and configure vite-plugin-pwa
**Then** `vite-plugin-pwa` package is installed (~0.20.x)
**And** `vite.config.ts` includes VitePWA plugin with:
  - `registerType: 'autoUpdate'`
  - `workbox.globPatterns: ['**/*.{js,css,html,ico,png,svg}']`
**And** `manifest.webmanifest` is generated with:
  - `name: 'Tablas1 - Aprende Multiplicaciones'`
  - `short_name: 'Tablas1'`
  - `theme_color: '#0a0e27'`
  - `background_color: '#0a0e27'`
  - Icons paths defined for 192x192 and 512x512 (placeholder paths ok)
**And** Service Worker is registered automatically
**And** `npm run build && npm run preview` shows PWA install prompt in Chrome DevTools

---

### Story 0.4: Install Core Dependencies (Framer Motion & Zustand)

As a developer,
I want Framer Motion and Zustand installed and configured,
So that I can use animations and state management in the app.

**Acceptance Criteria:**

**Given** PWA is configured
**When** I install Framer Motion and Zustand
**Then** `framer-motion` ~11.x is in `package.json` dependencies
**And** `zustand` ~4.x is in `package.json` dependencies
**And** I can import `{ motion }` from 'framer-motion' without TypeScript errors
**And** I can import `{ create }` from 'zustand' without TypeScript errors
**And** TypeScript types are available for both libraries (@types included or built-in)
**And** `npm run dev` compiles successfully with both packages

---

### Story 0.5: Create Project Folder Structure

As a developer,
I want the feature-based folder structure created,
So that I can organize code following the architecture pattern.

**Acceptance Criteria:**

**Given** dependencies are installed
**When** I create the folder structure
**Then** The following folders exist in `src/`:
  - `components/ui/`
  - `components/game/`
  - `components/layout/`
  - `features/solar-map/`
  - `features/gameplay/`
  - `features/progression/`
  - `features/persistence/`
  - `store/`
  - `types/`
  - `utils/`
  - `constants/`
**And** Path aliases are configured in `tsconfig.json`: `"@/*": ["./src/*"]`
**And** Path aliases are configured in `vite.config.ts` using `@types/node` and `path.resolve`
**And** I can import using `@/components/...` syntax without errors
**And** Each folder has a `.gitkeep` or README to ensure it's tracked in git

---

## Epic 1: Exploración del Mapa Solar

### Story 1.1: Create Game State Types and Constants

As a developer,
I want TypeScript types and constants for game state defined,
So that I have type safety across all components.

**Acceptance Criteria:**

**Given** the project structure is ready
**When** I create the core type definitions
**Then** `src/types/game.types.ts` exists with:
  - `PlanetStatus` enum: `'locked' | 'unlocked' | 'completed'`
  - `StarLevel` type: `0 | 1 | 2 | 3` (0 = no stars, 1 = Bronze, 2 = Silver, 3 = Gold)
  - `Planet` interface: `{ id: number; table: number; status: PlanetStatus; stars: StarLevel; bestAccuracy: number }`
  - `GameState` interface: `{ planets: Planet[]; totalStars: number }`
**And** `src/constants/planets.ts` exists with:
  - `PLANET_COUNT = 8` (representing tables 2-9)
  - `INITIAL_PLANETS` array with 8 planets, first unlocked, rest locked
**And** All types are exported and can be imported in other files
**And** TypeScript compiler accepts all type definitions

---

### Story 1.2: Create Zustand Game Store

As a developer,
I want a Zustand store to manage game state,
So that components can access and update planet data reactively.

**Acceptance Criteria:**

**Given** game types and constants are defined
**When** I create the game store
**Then** `src/store/gameStore.ts` exists with Zustand store
**And** Store has initial state:
  - `planets: Planet[]` initialized from `INITIAL_PLANETS`
  - `totalStars: number` = 0
**And** Store has actions (stubs for now, implemented in Epic 3):
  - `unlockPlanet(planetId: number): void`
  - `updatePlanetStars(planetId: number, stars: StarLevel): void`
  - `getTotalStars(): number`
**And** I can import `useGameStore` hook and access `planets` state in a component
**And** TypeScript infers correct types for store state and actions

---

### Story 1.3: Build Planet Component with Visual States

As a developer,
I want a Planet component that renders different visual states,
So that users can see locked, unlocked, and completed planets.

**Acceptance Criteria:**

**Given** game store is created
**When** I build the Planet component
**Then** `src/features/solar-map/Planet.tsx` component exists
**And** Component accepts props: `planet: Planet`, `onClick: () => void`
**And** Component renders an SVG circle with:
  - Size: 80px diameter (within 72-96px touch target range)
  - Border radius for circular shape
**And** Visual states are rendered correctly:
  - `locked`: opacity-50, grayscale filter, no glow
  - `unlocked`: opacity-100, blue glow effect (`shadow-lg shadow-space-blue/50`), pulsing animation
  - `completed`: opacity-100, gold glow, stars displayed (count based on `planet.stars`)
**And** Component uses Tailwind classes and Framer Motion for animations
**And** Component shows planet table number (2-9) in center
**And** onClick handler is triggered when planet is tapped
**And** Component is accessible with proper touch target size

---

### Story 1.4: Build SolarMap Dashboard Component

As a developer,
I want the SolarMap dashboard component to display all 8 planets,
So that users see the visual solar system interface.

**Acceptance Criteria:**

**Given** Planet component is built
**When** I create the SolarMap component
**Then** `src/features/solar-map/SolarMap.tsx` component exists
**And** Component uses `useGameStore` to get `planets` state
**And** Component renders 8 Planet components in a grid layout
**And** Layout is responsive:
  - Mobile (320-428px): 2 columns grid with `gap-4`
  - Planets are vertically stacked with adequate spacing (min 8px)
**And** Each planet is clickable but onClick does nothing yet (navigation implemented in Epic 2)
**And** Background uses `bg-space-dark` color
**And** Component is centered and padded appropriately for mobile
**And** All 8 planets render without layout overflow on 320px width

---

### Story 1.5: Build StarCounter Header Component

As a developer,
I want a StarCounter component displayed in the header,
So that users always see their total stars count.

**Acceptance Criteria:**

**Given** game store is created
**When** I build the StarCounter component
**Then** `src/components/layout/StarCounter.tsx` component exists
**And** Component uses `useGameStore` to get `totalStars` state
**And** Component displays:
  - Gold star icon (SVG or emoji ⭐)
  - Total stars count (e.g., "⭐ 12")
  - Text size: 24px semibold (Poppins)
  - Color: `text-gold`
**And** Component is positioned fixed at top-right or top-center
**And** Component is always visible (z-index appropriate)
**And** Component updates reactively when `totalStars` changes

---

### Story 1.6: Create Main App Layout with SolarMap

As a developer,
I want the main App component to render the SolarMap with StarCounter,
So that users see the complete dashboard when opening the app.

**Acceptance Criteria:**

**Given** SolarMap and StarCounter components are built
**When** I update the main App component
**Then** `src/App.tsx` renders:
  - StarCounter in header/top section
  - SolarMap as main content
**And** Layout uses:
  - Full viewport height (`min-h-screen`)
  - Background: `bg-space-dark`
  - Flexbox or grid for header + content layout
**And** App is responsive on 320px - 428px width
**And** `npm run dev` shows the solar map with 8 planets and star counter
**And** First planet (table 2) is visually unlocked, others locked
**And** Total stars shows "0" initially

---

## Epic 2: Jugar y Aprender

### Story 2.1: Create Question Generation Utility

As a developer,
I want a utility function to generate random multiplication questions,
So that game sessions have varied questions.

**Acceptance Criteria:**

**Given** the project structure is ready
**When** I create the question generator
**Then** `src/utils/questionGenerator.ts` exists with function:
  - `generateQuestions(table: number, count: number): Question[]`
**And** `Question` type is defined in `src/types/game.types.ts`: `{ id: string; table: number; multiplier: number; correctAnswer: number }`
**And** Function generates `count` questions (15-20) for the given `table` (2-9)
**And** Questions use random multipliers from 1-10 (or 1-12)
**And** Questions are NOT repeated within the same session (no duplicate multipliers)
**And** Each question has unique `id` (e.g., UUID or `table-multiplier`)
**And** `correctAnswer` is pre-calculated: `table * multiplier`
**And** Unit test exists verifying no duplicates and correct answer calculation

---

### Story 2.2: Create Game Session Store with Navigation

As a developer,
I want a session store to manage active game sessions,
So that I can track current question, answers, and session state.

**Acceptance Criteria:**

**Given** question generator is created
**When** I create the session store
**Then** `src/store/sessionStore.ts` exists with Zustand store
**And** Store has state:
  - `isPlaying: boolean` (false initially)
  - `currentPlanetId: number | null`
  - `questions: Question[]`
  - `currentQuestionIndex: number`
  - `sessionAnswers: SessionAnswer[]` where `SessionAnswer = { questionId: string; userAnswer: number | null; attempts: number; isCorrect: boolean }`
**And** Store has actions:
  - `startSession(planetId: number): void` - generates questions, sets `isPlaying = true`, resets state
  - `submitAnswer(answer: number): void` - records attempt, validates correctness
  - `nextQuestion(): void` - advances to next question
  - `endSession(): number` - calculates accuracy % and returns it, sets `isPlaying = false`
  - `exitSession(): void` - aborts session, resets state
**And** `submitAnswer` allows multiple attempts (increments attempts count)
**And** Only first attempt determines `isCorrect` for accuracy calculation
**And** Store correctly calculates accuracy: `(correct first attempts) / total questions * 100`

---

### Story 2.3: Build NumericKeyboard Component

As a developer,
I want a custom numeric keyboard component,
So that users can input answers easily on mobile.

**Acceptance Criteria:**

**Given** the project structure is ready
**When** I build the NumericKeyboard
**Then** `src/components/game/NumericKeyboard.tsx` component exists
**And** Component accepts props: `onNumberPress: (num: number) => void`, `onDelete: () => void`, `onSubmit: () => void`
**And** Component renders:
  - Number buttons: 0-9 in 3x4 grid layout (1-9, then 0 at bottom)
  - Delete/Backspace button (icon or text "←")
  - Submit/Enter button (icon or text "✓" or "Enter")
**And** Each button is 56x56px minimum (touch target compliance)
**And** Buttons have 8px spacing between them
**And** Buttons use Tailwind: `bg-space-navy`, `hover:bg-space-blue`, `active:scale-95`
**And** Clicking number button calls `onNumberPress(num)`
**And** Clicking delete calls `onDelete()`
**And** Clicking submit calls `onSubmit()`
**And** Keyboard is centered and responsive on 320px width

---

### Story 2.4: Build QuestionCard Component with Feedback

As a developer,
I want a QuestionCard component that displays the question and feedback,
So that users see the multiplication problem and immediate response feedback.

**Acceptance Criteria:**

**Given** session store is created
**When** I build the QuestionCard component
**Then** `src/components/game/QuestionCard.tsx` component exists
**And** Component accepts props: `question: Question`, `userAnswer: string`, `feedback: 'correct' | 'incorrect' | null`
**And** Component displays:
  - Question text: `"{table} × {multiplier} = ?"` in 40px bold Poppins
  - User's current answer input displayed prominently (32px)
  - Placeholder "?" if no answer yet
**And** Feedback visual states:
  - `correct`: Green flash animation with Framer Motion (`motion.div` with `animate={{ scale: [1, 1.1, 1], backgroundColor: ['#10b981'] }}`)
  - `incorrect`: Red text "¡Inténtalo de nuevo!" (32px bold), answer clears after animation
  - `null`: No feedback shown
**And** Feedback appears within <300ms of answer submission
**And** Component uses `bg-space-navy` card background
**And** Component is centered and responsive

---

### Story 2.5: Build ProgressIndicator Component

As a developer,
I want a ProgressIndicator component,
So that users see which question they're on during the session.

**Acceptance Criteria:**

**Given** session store tracks currentQuestionIndex
**When** I build the ProgressIndicator
**Then** `src/components/game/ProgressIndicator.tsx` component exists
**And** Component accepts props: `current: number`, `total: number`
**And** Component displays: "Pregunta {current} de {total}" (e.g., "Pregunta 5 de 20")
**And** Text size: 20px semibold, color: `text-gray-300`
**And** Component is positioned at top of game screen
**And** Component updates reactively as questions advance

---

### Story 2.6: Build GameSession Screen Component

As a developer,
I want the GameSession screen that orchestrates the gameplay,
So that users can play through a complete session.

**Acceptance Criteria:**

**Given** all game components (Keyboard, QuestionCard, ProgressIndicator) are built
**When** I create the GameSession screen
**Then** `src/features/gameplay/GameSession.tsx` component exists
**And** Component uses `useSessionStore` to get session state
**And** Component renders:
  - ProgressIndicator showing current question progress
  - QuestionCard displaying current question
  - NumericKeyboard for input
  - Exit button (top-left corner, "✕" icon, 48x48px touch target)
**And** User flow works:
  1. User types answer via NumericKeyboard → answer builds in QuestionCard
  2. User presses Submit → `submitAnswer` called, feedback shows
  3. If correct → auto-advance to next question after 1s delay
  4. If incorrect → show "¡Inténtalo de nuevo!", clear answer, allow retry
  5. After last question → call `endSession()` and navigate back to map
**And** Exit button calls `exitSession()` and navigates to SolarMap (partial progress NOT saved)
**And** Layout is responsive on 320px width
**And** Background: `bg-space-dark`

---

### Story 2.7: Add Navigation from SolarMap to GameSession

As a developer,
I want planets on the SolarMap to navigate to GameSession when tapped,
So that users can start playing by tapping a planet.

**Acceptance Criteria:**

**Given** GameSession screen exists
**When** I add navigation logic
**Then** `src/App.tsx` uses simple routing (conditional render or basic router)
**And** Tapping an `unlocked` planet calls `startSession(planetId)` and shows GameSession screen
**And** Tapping a `locked` planet shows a toast/alert: "Completa el planeta anterior primero"
**And** Tapping a `completed` planet starts a replay session (same behavior as unlocked)
**And** Transition from SolarMap to GameSession is immediate (<500ms)
**And** After session ends (via completion or exit), app returns to SolarMap
**And** Navigation works smoothly without page reload (client-side routing)

---

## Epic 3: Progresar y Coleccionar Estrellas

### Story 3.1: Implement Star Calculation Logic

As a developer,
I want a function to calculate stars based on accuracy,
So that I can assign Bronze/Silver/Gold levels correctly.

**Acceptance Criteria:**

**Given** the project structure is ready
**When** I create the star calculation utility
**Then** `src/utils/starCalculator.ts` exists with function:
  - `calculateStars(accuracy: number): StarLevel`
**And** Function returns:
  - `0` if `accuracy < 70%`
  - `1` (Bronze) if `70% <= accuracy < 85%`
  - `2` (Silver) if `85% <= accuracy < 95%`
  - `3` (Gold) if `accuracy >= 95%`
**And** Unit tests exist covering all edge cases:
  - `calculateStars(69.9)` → 0
  - `calculateStars(70)` → 1
  - `calculateStars(84.9)` → 1
  - `calculateStars(85)` → 2
  - `calculateStars(94.9)` → 2
  - `calculateStars(95)` → 3
  - `calculateStars(100)` → 3

---

### Story 3.2: Implement Planet Unlock Logic in Game Store

As a developer,
I want the game store to unlock planets sequentially,
So that completing a planet unlocks the next one.

**Acceptance Criteria:**

**Given** star calculation is implemented
**When** I update the game store with unlock logic
**Then** `gameStore.ts` action `unlockPlanet(planetId: number)` is fully implemented:
  - Sets `planets[planetId].status = 'unlocked'`
  - If planet was already unlocked/completed, no change
**And** Store action `updatePlanetStars(planetId: number, stars: StarLevel, accuracy: number)` is implemented:
  - Updates `planets[planetId].stars = stars`
  - Updates `planets[planetId].bestAccuracy = accuracy`
  - Sets `planets[planetId].status = 'completed'`
  - If `stars > 0` (accuracy >= 70%), unlocks next planet (planetId + 1) if it exists
  - Recalculates `totalStars` by summing all planet stars
**And** `getTotalStars()` returns correct sum
**And** First planet (id=0, table 2) is unlocked initially, others locked
**And** Unit tests verify unlock chain: completing planet 0 → unlocks planet 1, etc.

---

### Story 3.3: Build CelebrationScreen Component

As a developer,
I want a CelebrationScreen to show results after completing a session,
So that users get positive feedback and see their stars earned.

**Acceptance Criteria:**

**Given** star calculation is implemented
**When** I build the CelebrationScreen component
**Then** `src/features/progression/CelebrationScreen.tsx` component exists
**And** Component accepts props: `stars: StarLevel`, `accuracy: number`, `isFirstCompletion: boolean`, `onContinue: () => void`
**And** Component displays:
  - Title: "¡Planeta Conquistado!" if `isFirstCompletion`, else "¡MEJORADO!"
  - Star icons (1-3) animated with Framer Motion (scale-in animation)
  - Accuracy percentage: "{accuracy}% de aciertos"
  - Message based on star level:
    - 0 stars: "¡Sigue intentando! Necesitas 70% para desbloquear el siguiente."
    - 1 star (Bronze): "¡Bronce! Buen trabajo."
    - 2 stars (Silver): "¡Plata! Excelente trabajo."
    - 3 stars (Gold): "¡Oro! ¡Perfecto!"
**And** Auto-advance to SolarMap after 3 seconds (calls `onContinue` automatically)
**And** User can tap anywhere to skip and advance immediately
**And** Background: `bg-space-dark`, stars use `text-gold`
**And** Animations are smooth (60fps target)

---

### Story 3.4: Integrate Celebration and Unlock Flow in Session End

As a developer,
I want the session end to trigger celebration and unlock logic,
So that completing a session updates state and shows celebration.

**Acceptance Criteria:**

**Given** CelebrationScreen and unlock logic are implemented
**When** I integrate the flow in GameSession
**Then** When user completes last question in session:
  1. `endSession()` is called, returns `accuracy`
  2. `calculateStars(accuracy)` is called to get stars
  3. `updatePlanetStars(planetId, stars, accuracy)` is called to update state
  4. Check if this is first completion (`planet.stars === 0` before update)
  5. Navigate to CelebrationScreen with props: `stars`, `accuracy`, `isFirstCompletion`
**And** CelebrationScreen displays correctly
**And** After CelebrationScreen auto-advance (3s), navigate back to SolarMap
**And** SolarMap reflects updated state:
  - Completed planet shows stars
  - Next planet is unlocked (if accuracy >= 70%)
  - Total stars counter is updated
**And** Flow works for both first completion and replays

---

### Story 3.5: Add Unlock Animation on SolarMap

As a developer,
I want an unlock animation when returning to the SolarMap after unlocking a planet,
So that users see the visual feedback of unlocking the next planet.

**Acceptance Criteria:**

**Given** unlock logic updates planet status
**When** I add animation to Planet component
**Then** When a planet transitions from `locked` to `unlocked`:
  - Framer Motion `animate` triggers a glow pulse effect
  - Animation duration: 1-2 seconds
  - Planet scales slightly (1.0 → 1.1 → 1.0) and glows brightly
**And** Animation plays when user returns to SolarMap after completing a session
**And** Animation only plays once per unlock (not on every render)
**And** Animation is smooth and visually appealing
**And** Other planets remain static during animation

---

### Story 3.6: Implement LocalStorage Persistence Schema

As a developer,
I want a versioned LocalStorage schema to persist game state,
So that user progress is saved and can be migrated in the future.

**Acceptance Criteria:**

**Given** the project structure is ready
**When** I create the persistence utility
**Then** `src/features/persistence/localStorageService.ts` exists with:
  - `StorageSchema` type: `{ version: string; lastUpdated: string; gameState: GameState }`
  - `STORAGE_KEY = 'tablas1_game_state'`
  - `SCHEMA_VERSION = '1.0'`
**And** Functions exist:
  - `saveGameState(gameState: GameState): void` - serializes and saves to LocalStorage
  - `loadGameState(): GameState | null` - loads and deserializes, returns null if not found
  - `clearGameState(): void` - removes from LocalStorage
**And** `saveGameState` creates schema: `{ version: '1.0', lastUpdated: new Date().toISOString(), gameState }`
**And** `loadGameState` checks version, returns null if version mismatch (future-proofing)
**And** Error handling:
  - Try-catch wraps all LocalStorage operations
  - On error (quota exceeded, unavailable), logs warning and returns gracefully
  - On corrupt data (JSON parse error), clears storage and returns null

---

### Story 3.7: Integrate Auto-Save with Zustand Middleware

As a developer,
I want game state to auto-save after critical actions,
So that progress persists automatically without user intervention.

**Acceptance Criteria:**

**Given** LocalStorage service is created
**When** I add persistence middleware to gameStore
**Then** `gameStore.ts` uses Zustand middleware to auto-save state
**And** Middleware intercepts `updatePlanetStars` action and calls `saveGameState` after state update
**And** Middleware is configured to save only specific actions (not every state change)
**And** Auto-save happens synchronously after action completes
**And** Errors in saving do not crash the app (graceful error handling)
**And** Unit tests verify save is called when expected actions occur

---

### Story 3.8: Implement State Loading on App Initialization

As a developer,
I want game state to load from LocalStorage when the app starts,
So that users see their progress restored immediately.

**Acceptance Criteria:**

**Given** LocalStorage service is created
**When** I update gameStore initialization
**Then** `gameStore.ts` initializes state by calling `loadGameState()`
**And** If `loadGameState()` returns data:
  - Store initializes with loaded `planets` and `totalStars`
  - SolarMap reflects loaded state (completed planets show stars, unlocked planets are accessible)
**And** If `loadGameState()` returns null (first time or error):
  - Store initializes with `INITIAL_PLANETS` (first planet unlocked, rest locked)
**And** Loading happens synchronously before first render (no flicker)
**And** App handles corrupt data gracefully: clears storage, starts fresh, optionally shows toast "Progreso reiniciado"
**And** `npm run dev` → refresh page → state persists correctly

---

## Epic 4: Pulir, Optimizar y PWA

### Story 4.1: Configure PWA Manifest and Icons

As a developer,
I want the PWA manifest fully configured with proper icons,
So that the app can be installed and has correct branding.

**Acceptance Criteria:**

**Given** vite-plugin-pwa is installed (from Epic 0)
**When** I complete the PWA manifest configuration
**Then** `public/manifest.webmanifest` (or auto-generated) includes:
  - `name: 'Tablas1 - Aprende Multiplicaciones'`
  - `short_name: 'Tablas1'`
  - `description: 'Practica las tablas de multiplicar del 2 al 9 conquistando planetas'`
  - `theme_color: '#0a0e27'`
  - `background_color: '#0a0e27'`
  - `display: 'standalone'`
  - `start_url: '/'`
  - `icons` array with:
    - 192x192px icon
    - 512x512px icon
    - `purpose: 'any maskable'`
**And** Icon files exist in `public/icons/` (can be placeholder space-themed icons)
**And** `npm run build && npm run preview` → Chrome DevTools Application tab shows manifest correctly
**And** PWA installability criteria are met (shows install prompt)

---

### Story 4.2: Configure Service Worker with Cache Strategy

As a developer,
I want the Service Worker configured with cache-first strategy,
So that the app loads instantly and works offline.

**Acceptance Criteria:**

**Given** vite-plugin-pwa is installed
**When** I configure Workbox in vite.config.ts
**Then** `vite.config.ts` VitePWA plugin includes:
  - `workbox.runtimeCaching` for cache-first strategy on all assets (JS, CSS, HTML, images)
  - `workbox.globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']`
  - `workbox.cleanupOutdatedCaches: true`
**And** Service Worker is registered with `registerType: 'autoUpdate'`
**And** `npm run build` generates Service Worker file in `dist/`
**And** After first load, Service Worker caches all assets
**And** On subsequent loads (even offline), app loads from cache (<1s)
**And** Chrome DevTools → Application → Service Workers shows active worker

---

### Story 4.3: Verify Offline Functionality

As a developer,
I want to verify the app works 100% offline after first load,
So that users can play without internet connection.

**Acceptance Criteria:**

**Given** Service Worker is configured
**When** I test offline functionality
**Then** Test steps:
  1. `npm run build && npm run preview`
  2. Open app in Chrome, navigate through SolarMap, play a session
  3. Open DevTools → Network tab → Enable "Offline" mode
  4. Refresh page → App loads successfully from cache
  5. Navigate to SolarMap → Works
  6. Start a session → Works
  7. Complete session → Works, state persists in LocalStorage
**And** All features work offline: gameplay, persistence, navigation, animations
**And** No network errors in console during offline use
**And** Lighthouse audit shows "Works Offline" ✓

---

### Story 4.4: Implement Code Splitting for Non-Critical Components

As a developer,
I want to code-split heavy components,
So that initial bundle size is minimized.

**Acceptance Criteria:**

**Given** the app is fully functional
**When** I implement code splitting
**Then** `CelebrationScreen.tsx` is lazy-loaded using React.lazy():
  - `const CelebrationScreen = React.lazy(() => import('./features/progression/CelebrationScreen'))`
  - Wrapped in `<Suspense fallback={<LoadingSpinner />}>`
**And** Any particle/animation system (if created) is lazy-loaded
**And** `npm run build` generates separate chunk files for lazy components
**And** Bundle analysis (`npm run build -- --mode analyze` if analyzer plugin added) shows main bundle <500KB
**And** Total bundle size <2MB verified
**And** Lazy loading doesn't cause visible lag (Suspense fallback shows briefly if needed)

---

### Story 4.5: Optimize Framer Motion Animations for 60fps

As a developer,
I want all animations to run at 60fps without frame drops,
So that the app feels smooth and responsive.

**Acceptance Criteria:**

**Given** animations are implemented with Framer Motion
**When** I optimize animation performance
**Then** All Framer Motion animations use GPU-accelerated properties:
  - `transform` (scale, translateX, translateY, rotate)
  - `opacity`
  - Avoid animating `width`, `height`, `top`, `left` (use `transform` instead)
**And** Animations have 16ms frame budget (60fps):
  - Chrome DevTools → Performance tab → Record during animations → No frame drops
**And** Planet glow/pulse animations use CSS `will-change: transform` hint
**And** Celebration screen star animations are smooth
**And** No layout thrashing (batch DOM reads/writes)
**And** Animations tested on mid-range Android device (if available) or Chrome throttling

---

### Story 4.6: Add Canvas-Based Particle System for Celebration

As a developer,
I want a canvas-based particle system for celebration confetti,
So that celebrations are visually engaging without impacting performance.

**Acceptance Criteria:**

**Given** CelebrationScreen exists
**When** I add a particle system
**Then** `src/components/game/ParticleSystem.tsx` component exists
**And** Component uses HTML5 Canvas to render particles (stars, sparkles)
**And** Particle animation loop uses `requestAnimationFrame` (not setInterval)
**And** Particles are small, simple shapes (circles or star paths)
**And** Animation runs for 2-3 seconds, then stops (cleans up)
**And** Canvas is positioned absolutely behind celebration content (z-index layering)
**And** Performance:
  - Max 50-100 particles
  - Runs at 60fps on target devices
  - No memory leaks (canvas cleanup on unmount)
**And** Component is lazy-loaded (React.lazy) to reduce initial bundle

---

### Story 4.7: Configure Vitest and Write Unit Tests

As a developer,
I want Vitest configured with unit tests for critical logic,
So that I can verify correctness and prevent regressions.

**Acceptance Criteria:**

**Given** Vitest is recommended in architecture
**When** I set up testing
**Then** Vitest and React Testing Library are installed:
  - `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
**And** `vitest.config.ts` is configured with `environment: 'jsdom'`
**And** `package.json` has script: `"test": "vitest"`
**And** Unit tests exist for critical utilities:
  - `questionGenerator.test.ts`: Verifies no duplicates, correct count, correct answers
  - `starCalculator.test.ts`: Verifies all threshold edge cases
  - `localStorageService.test.ts`: Verifies save/load/error handling
**And** Component tests exist for:
  - `NumericKeyboard.test.tsx`: Verifies button clicks trigger callbacks
  - `Planet.test.tsx`: Verifies visual states render correctly
**And** `npm test` runs all tests successfully
**And** Code coverage >70% for utilities (optional but recommended)

---

### Story 4.8: Add React Error Boundary for Graceful Failures

As a developer,
I want an Error Boundary to catch crashes,
So that the app shows a friendly message instead of white screen.

**Acceptance Criteria:**

**Given** the app is functional
**When** I add an Error Boundary
**Then** `src/components/layout/ErrorBoundary.tsx` component exists
**And** Component uses React Error Boundary pattern:
  - `componentDidCatch` logs error to console
  - `state.hasError` triggers fallback UI
**And** Fallback UI displays:
  - Message: "Algo salió mal. Por favor, recarga la página."
  - Reload button that calls `window.location.reload()`
  - Styled with space theme (bg-space-dark, text-white)
**And** `App.tsx` wraps all content in `<ErrorBoundary>`
**And** Simulated error (e.g., throw in component) triggers fallback UI
**And** Error boundary does NOT catch errors in event handlers (documented limitation)

---

### Story 4.9: Run Lighthouse Audit and Verify Performance Metrics

As a developer,
I want to run Lighthouse audit and verify all metrics are met,
So that I confirm the app meets performance and PWA standards.

**Acceptance Criteria:**

**Given** all features and optimizations are implemented
**When** I run Lighthouse audit
**Then** `npm run build && npm run preview` → Open Chrome DevTools → Lighthouse
**And** Run audit in "Mobile" mode with throttling
**And** Metrics achieved:
  - **Performance Score**: >90
  - **PWA Score**: >90
  - **Accessibility Score**: >85 (WCAG AA contrast)
  - **First Contentful Paint (FCP)**: <2s
  - **Largest Contentful Paint (LCP)**: <3s
  - **Cumulative Layout Shift (CLS)**: <0.1
  - **Total Blocking Time (TBT)**: <300ms
**And** PWA checks pass:
  - ✓ Installable
  - ✓ Works offline
  - ✓ Configured for custom splash screen
  - ✓ Themed address bar
**And** Accessibility checks pass:
  - ✓ Touch targets >= 48px
  - ✓ Color contrast WCAG AA
**And** Screenshot of Lighthouse report saved for documentation

---

### Story 4.10: Verify Total Bundle Size and Load Times

As a developer,
I want to verify final bundle size and load times meet targets,
So that the app is performant on 4G mobile connections.

**Acceptance Criteria:**

**Given** all code splitting and optimizations are complete
**When** I analyze the production build
**Then** `npm run build` outputs build summary
**And** Total bundle size (all chunks combined) <2MB
**And** Main JS chunk <500KB gzipped
**And** CSS chunk <100KB gzipped
**And** Test load times on simulated 4G (Chrome DevTools → Network → Slow 4G):
  - **First Load (no cache)**: <3s to interactive
  - **Return Load (cached)**: <1s to interactive
**And** All assets are tree-shaken (no unused code from Framer Motion, Zustand)
**And** Verified imports are specific: `import { motion } from 'framer-motion'`, not `import * as motion`
**And** Build analysis tool (e.g., `rollup-plugin-visualizer`) confirms no unexpected large dependencies

