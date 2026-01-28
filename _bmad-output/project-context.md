---
project_name: 'Tablas1'
user_name: 'enrique'
date: '2026-01-27'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
existing_patterns_found: 12
status: 'complete'
rule_count: 120+
section_count: 7
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core:**
- React 18 (Concurrent features, automatic batching)
- TypeScript 5+ (strict mode mandatory)
- Vite 5 (esbuild, HMR)
- Tailwind CSS 3.x (PurgeCSS enabled)

**State & Data:**
- Zustand ~4.x (~1KB, optimized re-renders)
- LocalStorage API (schema versionado en `src/features/persistence/types/storageSchema.ts`)

**UI & Animations:**
- Framer Motion ~11.x (declarative, 60fps target)
- Canvas API (particles only)
- SVG inline (planet icons)

**PWA:**
- vite-plugin-pwa (Workbox, cache-first)
- Service Worker auto-generated

**Dev Tools:**
- PostCSS + Autoprefixer
- @types/node (path aliases)
- Vitest + React Testing Library (recommended)

**Critical Compatibility Notes:**
- React 18 Concurrent Mode: Zustand + Framer Motion must support Concurrent features
- Bundle target: <2MB total (estimated 500-800KB)
- TypeScript strict mode required in tsconfig.json
- Path aliases: `@/` maps to `./src/*`

## Critical Implementation Rules

### Language-Specific Rules (TypeScript/React)

**TypeScript Configuration (MANDATORY):**
- ✅ `strict: true` - Type safety completo OBLIGATORIO
- ✅ `noUnusedLocals: true` - Código limpio
- ✅ `noImplicitAny: true` - Tipado explícito siempre
- ❌ NUNCA usar `any` - siempre tipar explícitamente o `unknown`

**Naming Conventions (CRÍTICO):**
- **Components**: PascalCase (`SolarMap.tsx`, `GameSession.tsx`)
- **Files**:
  - Components: `PascalCase.tsx`
  - Hooks: `useGameSession.ts` (camelCase + prefijo `use`)
  - Utils: `questionGenerator.ts` (camelCase)
  - Types: `planet.ts` (PascalCase)
- **Variables/Functions**: camelCase (`currentPlanet`, `calculateStars()`)
- **Interfaces/Types**: PascalCase SIN prefijo `I` (`Planet`, `GameState` - NO `IPlanet`)
- **Constants globales**: UPPER_SNAKE_CASE (`STORAGE_KEY`, `BRONZE_THRESHOLD`)
- **Config objects**: camelCase + `as const` (`GAME_CONFIG`)

**Import/Export Patterns (OBLIGATORIO):**
```typescript
// Orden estándar SIEMPRE:
// 1. React + libs externas
import React, { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Stores (Zustand)
import { useGameStore } from '@/store/gameStore'

// 3. Components
import { Button } from '@/components/ui/Button'

// 4. Hooks
import { useLocalStorage } from '@/features/persistence/hooks/useLocalStorage'

// 5. Utils
import { calculateStars } from '@/utils/calculations'

// 6. Types (usar 'import type')
import type { Planet, Question } from '@/types'
```

**Path Aliases:**
- ✅ SIEMPRE usar `@/` para imports internos
- ❌ NUNCA usar relative paths `../../components`
- Ejemplo: `import { Button } from '@/components/ui/Button'`

**Error Handling:**
- LocalStorage operations: SIEMPRE wrap en try-catch con fallback
- Return types explícitos en funciones públicas
- Error Boundaries para React crashes

### Framework-Specific Rules (React + Zustand + Framer Motion)

**React Hooks Patterns (CRÍTICO):**
- ✅ SIEMPRE hooks en el top-level del component (NO condicionales, NO loops)
- ✅ Custom hooks DEBEN empezar con `use` prefix
- ✅ useEffect para side-effects, NOT para cálculos síncronos
- ❌ NUNCA llamar hooks dentro de condicionales o loops
- Ejemplo correcto:
```typescript
function GameSession() {
  const planets = useGameStore(state => state.planets) // ✅ Top-level
  const [isLoading, setIsLoading] = useState(false)   // ✅ Top-level

  useEffect(() => {
    // Side-effects aquí
  }, [dependency])
}
```

**Zustand State Management (OBLIGATORIO):**
- ✅ SIEMPRE mutaciones inmutables (spread operators, NOT direct mutation)
- ✅ Usar selectors específicos para evitar re-renders innecesarios
- ❌ NUNCA modificar state directamente: `state.planets.push()` ❌
- ✅ CORRECTO: `planets: [...state.planets, newPlanet]` ✅

**Patrón de Store Actions:**
```typescript
// ✅ CORRECTO: Immutable update
submitAnswer: (answer: number) => set((state) => ({
  sessionAnswers: [...state.sessionAnswers, answer],
  currentQuestionIndex: state.currentQuestionIndex + 1
}))

// ❌ INCORRECTO: Direct mutation
submitAnswer: (answer: number) => {
  state.sessionAnswers.push(answer) // ❌ NO HACER ESTO
  state.currentQuestionIndex++       // ❌ NO HACER ESTO
}
```

**Zustand Action Naming:**
- Actions: verbos imperativos (`submitAnswer`, `unlockPlanet`, `saveProgress`)
- Getters: sustantivos o `get` prefix si ambiguo (`planets`, `getCurrentPlanet`)

**Component Organization Boundaries (CRÍTICO):**
- **src/components/ui/**: Atomic components, SOLO props, SIN zustand store access
- **src/components/game/**: Game-specific components, PUEDEN leer store
- **src/features/**: Feature modules, PUEDEN leer Y modificar store

**Performance Patterns (OBLIGATORIO):**
- ✅ Zustand selectors: `useGameStore(state => state.planets)` NO `useGameStore()`
- ✅ Lazy loading: SOLO `CelebrationScreen` y `ParticleSystem`
- ❌ NO lazy-load componentes críticos del game flow
- ✅ Framer Motion: 60fps target, 16ms frame budget

**Framer Motion Patterns:**
- Preferir `initial`, `animate`, `exit` sobre `variants` para animaciones simples
- Usar `AnimatePresence` para exit animations
- Mantener animations ≤ 300ms para feedback táctil
- Layout animations: usar `layout` prop para smooth transitions

**Example Pattern:**
```typescript
// ✅ CORRECTO: Selector específico
const planets = useGameStore(state => state.planets)

// ❌ INCORRECTO: Re-render en cualquier cambio del store
const store = useGameStore()
const planets = store.planets

// ✅ CORRECTO: Framer Motion simple
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

**React 18 Concurrent Features:**
- Store debe ser compatible con Concurrent Rendering
- Zustand ~4.x YA es compatible
- Evitar side-effects en render phase
- Usar `useTransition` para non-urgent updates si es necesario

### Testing Rules (Vitest + React Testing Library + TDD)

**Metodología TDD (OBLIGATORIO):**

**Ciclo Red-Green-Refactor (SIEMPRE seguir):**
1. 🔴 **RED**: Escribir test que falle PRIMERO
2. 🟢 **GREEN**: Escribir código MÍNIMO para pasar el test
3. 🔵 **REFACTOR**: Mejorar código manteniendo tests verdes

**Reglas TDD Críticas:**
- ✅ NUNCA escribir código de producción sin test que falle primero
- ✅ Test DEBE fallar por la razón correcta (NOT compilación error)
- ✅ Escribir SOLO el código necesario para pasar el test actual
- ✅ Refactor SOLO después de tener tests verdes
- ❌ NO escribir múltiples tests antes de implementar
- ❌ NO implementar features "por si acaso" sin test

**TDD Workflow Obligatorio:**
```typescript
// 1. RED: Test falla (función no existe aún)
it('should calculate stars based on correct answers', () => {
  expect(calculateStars(8, 10)).toBe(3) // ❌ FALLA
})

// 2. GREEN: Implementación mínima
export function calculateStars(correct: number, total: number): number {
  const percentage = (correct / total) * 100
  if (percentage >= 80) return 3
  if (percentage >= 60) return 2
  if (percentage >= 40) return 1
  return 0
}

// 3. REFACTOR: Mejorar sin romper tests
```

**Organización de Tests (CRÍTICO):**
- ✅ **Co-location**: Tests JUNTO al código que testean
- ✅ Naming: `Component.test.tsx` o `utils.test.ts` (`.test` suffix SIEMPRE)
- ✅ Estructura refleja `src/`:
```
src/components/ui/
├── Button.tsx
└── Button.test.tsx  ✅ Co-located
```
- ❌ NO carpeta separada `__tests__/`

**Vitest + React Testing Library Patterns:**
```typescript
// FORMATO ESTÁNDAR:
import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '@testing-library/react'

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

**Naming Conventions:**
- Test descriptions: `'should ...'` format
- describe blocks: Component/Function name exacto
- Arrange-Act-Assert pattern

**Mock Patterns (CRÍTICO):**
```typescript
// Zustand Store Mock
vi.mock('@/store/gameStore', () => ({
  useGameStore: vi.fn(() => ({
    planets: mockPlanets,
    unlockPlanet: vi.fn()
  }))
}))

// LocalStorage Mock (SIEMPRE)
beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
  } as any
})

// Framer Motion Mock (performance)
vi.mock('framer-motion', () => ({
  motion: { div: 'div', button: 'button' },
  AnimatePresence: ({ children }: any) => children
}))
```

**Test Coverage Requirements:**
- Componentes UI: ≥80%
- Business logic: ≥90%
- Critical paths: 100%
- TDD naturalmente alcanza high coverage

**Test Boundaries:**
- **Unit Tests** (TDD preferido): Componentes UI, utils, hooks - Mock dependencies SIEMPRE
- **Integration Tests**: Feature flows, Store + Component - Minimizar mocks

**Testing Anti-Patterns (NO HACER):**
- ❌ NO testear implementation details
- ❌ NO snapshots para componentes dinámicos
- ❌ NO tests que dependen de timing (usar `waitFor`)
- ❌ NO tests sin assertions
- ❌ NO escribir código antes del test (viola TDD)

**React Testing Library Best Practices:**
- ✅ `screen.getByRole()` sobre `getByTestId()`
- ✅ Queries priority: getByRole > getByLabelText > getByText > getByTestId
- ✅ `userEvent` sobre `fireEvent`
- ✅ `waitFor()` para async assertions

**TDD Pattern Completo:**
```typescript
// 1. RED: Test falla
it('should submit answer when button clicked', async () => {
  const mockSubmit = vi.fn()
  render(<QuestionCard question={mockQ} onSubmit={mockSubmit} />)

  const input = screen.getByRole('spinbutton')
  await userEvent.type(input, '42')
  await userEvent.click(screen.getByRole('button', { name: /enviar/i }))

  expect(mockSubmit).toHaveBeenCalledWith(42) // ❌ Componente no existe
})

// 2. GREEN: Implementar mínimo
// 3. REFACTOR: Mejorar con tests pasando
```

**TDD Workflow para Features:**
1. Test de aceptación (integration) - FALLA
2. Descomponer en unit tests
3. TDD cada unit (Red-Green-Refactor)
4. Integration test pasa automáticamente
5. Refactor con confianza

### Code Quality & Style Rules

**Linting & Formatting (OBLIGATORIO):**
- ✅ ESLint + Prettier SIEMPRE antes de commit
- ✅ `eslint-plugin-react-hooks` enforced
- ❌ NO `// eslint-disable` sin justificación
- ❌ NO commits con ESLint errors
- Prettier config: Semi: true, Single quotes: true, Trailing comma: 'es5', Tab: 2, Width: 100

**Pre-commit Hooks:**
- ✅ Husky + lint-staged configurado
- ✅ Run ESLint + Prettier + `tsc --noEmit` en staged files

**File Structure (CRÍTICO):**
```
src/
├── components/ui/       # Atomic, NO business logic
├── components/game/     # Game-specific, lee store
├── components/layout/   # Layout + ErrorBoundary
├── features/           # Feature modules (co-located)
├── store/              # Zustand stores únicamente
├── types/              # Type definitions globales
├── utils/              # Pure functions
├── constants/          # Global constants
└── hooks/              # Shared custom hooks
```

**Reglas de Organización:**
- ✅ Feature colocation en `features/[name]/`
- ✅ One component per file
- ❌ NO carpetas `helpers/`, `misc/`, `common/`

**Import Ordering (OBLIGATORIO):**
```typescript
// 1. React + external libs
// 2. Stores
// 3. Components
// 4. Hooks
// 5. Utils
// 6. Types (import type)
// 7. Styles
```

**Naming (REFORZADO):**
- Files: Components `PascalCase.tsx`, Hooks `useHook.ts`, Utils `camelCase.ts`, Tests `[Name].test.tsx`
- Code: Components/Types `PascalCase` (NO prefijo `I`), Variables/Functions `camelCase`, Constants `UPPER_SNAKE_CASE`
- Booleans: `is`, `has`, `should` prefix
- Event handlers: `handle` prefix

**Documentation:**
- ✅ Comentar **WHY**, NOT **WHAT**
- ✅ JSDoc para funciones públicas con tipos complejos
- ❌ NO comments obvios
- ❌ NO commented-out code
- ✅ TODO: `// TODO(nombre fecha): ...`

**Code Quality (OBLIGATORIO):**
- ✅ Funciones ≤ 50 líneas
- ✅ Components ≤ 200 líneas
- ✅ Cyclomatic complexity ≤ 10
- ✅ Early returns sobre nested conditions
- ✅ NO duplicar código > 3 líneas
- ❌ NO premature abstraction (esperar 3+ usos)

**TypeScript Quality:**
- ✅ Explicit return types en funciones exportadas
- ✅ NO `as any` - usar `unknown` + type guards
- ✅ Preferir `interface` para objects, `type` para unions

**Example:**
```typescript
// ✅ CORRECTO
export function generateQuestion(planet: Planet): Question {
  // ...
}

// ❌ INCORRECTO: Implicit return
export function generateQuestion(planet: Planet) {
  // ...
}
```

**Performance:**
- ✅ `React.memo` SOLO para expensive components
- ✅ `useMemo/useCallback` SOLO para cálculos caros
- ❌ NO premature optimization
- ✅ Lazy load: SOLO `CelebrationScreen` + `ParticleSystem`

**Magic Numbers & Strings:**
- ❌ NO hardcoded
- ✅ Extract a constants con nombres descriptivos
```typescript
// ✅ CORRECTO
const GOLD_THRESHOLD = 80
if (score >= GOLD_THRESHOLD) return STAR_LEVELS.GOLD
```

**Error Handling:**
- ✅ Manejar errores en boundaries (API, localStorage)
- ✅ Error messages descriptivos
- ❌ NO silent failures

**Git Hygiene:**
- ✅ Commits atómicos
- ✅ Commit messages: imperativo, descriptivo
- ❌ NO commits de `console.log()` debugging
- ❌ NO archivos temporales

### Development Workflow Rules

**Branch Naming Conventions:**
```
feature/[nombre]     - Nuevas features
fix/[nombre]         - Bug fixes
refactor/[nombre]    - Refactoring
test/[nombre]        - Testing changes
docs/[nombre]        - Documentation
```
- ✅ kebab-case para branch names
- ❌ NO branches `dev`, `test`, `temp` sin contexto

**Commit Message Format:**
```
<tipo>: <descripción corta imperativa>

[Cuerpo opcional explicando WHY]
```

**Tipos:** `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `style:`, `perf:`, `chore:`

**Ejemplos:**
```
✅ feat: add planet unlock animation
✅ fix: prevent localStorage quota exceeded error
❌ "changes" - NO descriptivo
❌ "WIP" - NO commits work-in-progress
```

**Commit Best Practices:**
- ✅ Commits atómicos
- ✅ Imperativo: "add" NOT "added"
- ✅ Max 72 chars en subject
- ❌ NO commits de `console.log()`, `debugger`
- ❌ NO commits que rompen build/tests

**Pre-commit Checklist (OBLIGATORIO):**
1. ✅ `npm run test`
2. ✅ `npm run lint`
3. ✅ `npm run type-check` o `tsc --noEmit`
4. ✅ `npm run build`
5. ✅ `git diff --staged`

**Husky Hooks (auto-configured):**
```bash
# .husky/pre-commit
npm run lint-staged
npm run type-check
```

**PR Requirements:**
- ✅ Tests pasan
- ✅ Build OK
- ✅ No ESLint/TypeScript errors
- ✅ Code reviewed
- ✅ Branch actualizado con main

**Development Commands (CRÍTICO):**
```bash
npm run dev              # Vite dev server (HMR)
npm run build            # Production build
npm run preview          # Preview production build
npm run test             # Run tests (Vitest)
npm run test:watch       # Watch mode (TDD)
npm run test:coverage    # Coverage report
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run type-check       # TypeScript check
npm run format           # Prettier format
```

**Development Workflow:**
```
1. git pull origin main
2. git checkout -b feature/my-feature
3. npm run test:watch  (TDD cycle)
4. npm run dev
5. npm run lint && npm run type-check
6. git commit -m "feat: add my feature"
7. git push origin feature/my-feature
8. Create PR
```

**Build & Deployment:**
- ✅ Output: `dist/` (gitignored)
- ✅ Bundle: <2MB total
- ✅ PWA: `manifest.json` + Service Worker auto-generated
- ✅ Icons: 192x192, 512x512 en `public/icons/`
- ✅ HTTPS required para service worker
- ✅ Deploy desde `main` branch

**Dependency Management:**
```bash
npm install <package>     # Production
npm install -D <package>  # Dev
```
- ✅ Verificar bundle size impact
- ✅ `npm audit` para security
- ✅ SIEMPRE commit `package-lock.json`
- ❌ NO deps "por si acaso"

**Workflow Anti-Patterns:**
- ❌ NO commit directly a `main`
- ❌ NO force push (excepto en feature branches propios)
- ❌ NO deployar sin tests pasando

### Critical Don't-Miss Rules

**LocalStorage Critical Rules (MUY IMPORTANTE):**

**Quota Exceeded Error:**
```typescript
// ❌ PELIGRO: NO handle localStorage sin try-catch
localStorage.setItem('gameState', JSON.stringify(state)) // Puede fallar

// ✅ CORRECTO: SIEMPRE wrap en try-catch
try {
  localStorage.setItem('gameState', JSON.stringify(state))
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('LocalStorage quota exceeded')
    // Implementar cleanup strategy
  }
}
```

**Data Validation (SEGURIDAD):**
```typescript
// ❌ PELIGRO: Confiar en localStorage sin validación
const data = JSON.parse(localStorage.getItem('gameState'))
useGameStore.setState(data) // Puede corromper state

// ✅ CORRECTO: SIEMPRE validar con type guards
const loadGameState = (): GameState | null => {
  try {
    const raw = localStorage.getItem('gameState')
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!isValidGameState(data)) return null
    return data
  } catch {
    return null
  }
}
```

**Schema Versioning (CRÍTICO):**
- ✅ SIEMPRE versionar schema en `src/features/persistence/types/storageSchema.ts`
- ✅ Implementar migrations cuando schema cambia
- ❌ NO breaking changes sin migration path

**Zustand State Anti-Patterns (CRÍTICO):**

**Direct Mutation (CAUSA BUGS SUTILES):**
```typescript
// ❌ PELIGRO: Mutation NO triggerea re-render
const unlockPlanet = (id: string) => set((state) => {
  state.planets.find(p => p.id === id).isUnlocked = true // ❌ MUTACIÓN
  return state // Zustand NO detecta cambio
})

// ✅ CORRECTO: Immutable update
const unlockPlanet = (id: string) => set((state) => ({
  planets: state.planets.map(p =>
    p.id === id ? { ...p, isUnlocked: true } : p
  )
}))
```

**Infinite Loop con useEffect:**
```typescript
// ❌ PELIGRO: Re-render loop
const store = useGameStore() // ❌ Re-render en CUALQUIER cambio
useEffect(() => { /* ... */ }, [store])

// ✅ CORRECTO: Selector específico
const planets = useGameStore(state => state.planets)
useEffect(() => { /* ... */ }, [planets])
```

**React 18 Concurrent Mode Gotchas:**

**Double Render en Strict Mode:**
```typescript
// ⚠️ React 18 Strict Mode ejecuta effects TWICE en dev
useEffect(() => {
  fetchData() // ❌ Duplica requests en dev
}, [])

// ✅ CORRECTO: Cleanup para idempotencia
useEffect(() => {
  let cancelled = false
  fetchData().then(data => {
    if (!cancelled) setData(data)
  })
  return () => { cancelled = true }
}, [])
```

**State Updates durante Render:**
```typescript
// ❌ PELIGRO: Loop infinito
function Component() {
  const [count, setCount] = useState(0)
  setCount(count + 1) // ❌ Update durante render
  return <div>{count}</div>
}

// ✅ CORRECTO: Updates en effects o handlers
```

**Framer Motion Performance Gotchas:**

**Animaciones en List Items:**
```typescript
// ❌ PELIGRO: Re-anima TODO en cada render
<motion.div animate={{ scale: 1.1 }}>

// ✅ CORRECTO: AnimatePresence + layout
<AnimatePresence>
  {items.map(item => (
    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
  ))}
</AnimatePresence>
```

**Animation Jank (< 60fps):**
```typescript
// ❌ PELIGRO: Animar width/height causa reflow
<motion.div animate={{ width: 300, height: 200 }} />

// ✅ CORRECTO: Animar transform/opacity (GPU-accelerated)
<motion.div animate={{ scale: 1.5, opacity: 1 }} />
```

**Input Validation & Security:**

**Type Coercion Bugs:**
```typescript
// ❌ PELIGRO: == permite coercion
if (answer == correctAnswer) { // '42' == 42 es true

// ✅ CORRECTO: === strict comparison
if (answer === correctAnswer) { // '42' === 42 es false
```

**Input Validation:**
```typescript
// ✅ SIEMPRE validar y sanitizar user input
const numericAnswer = parseInt(answer, 10)
if (isNaN(numericAnswer) || numericAnswer < 0 || numericAnswer > 1000) {
  setError('Respuesta inválida')
  return
}
```

**PWA & Offline Mode Edge Cases:**

**Service Worker Cache Staleness:**
```typescript
// ⚠️ Service Worker cachea aggressively
// ✅ Implementar update notification
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      // Notificar: "Nueva versión disponible"
      showUpdateNotification()
    })
  })
}
```

**Offline Data Sync:**
```typescript
// ❌ Asumir connectivity
fetch('/api/save') // Falla offline

// ✅ Detectar y queue
if (!navigator.onLine) {
  queueForLaterSync(data)
  showOfflineMessage()
}
```

**Performance Gotchas:**

**Bundle Size:**
```typescript
// ❌ Import completo
import _ from 'lodash' // +70KB

// ✅ Import específico
import shuffle from 'lodash/shuffle' // ~1KB
```

**Unnecessary Re-renders:**
```typescript
// ❌ Nuevo objeto cada render
const config = { theme: 'dark' }

// ✅ Memoize
const config = useMemo(() => ({ theme: 'dark' }), [])
```

**Testing Edge Cases:**

**Async State Updates:**
```typescript
// ❌ Asumir update inmediato
fireEvent.click(button)
expect(screen.getByText('1')).toBeInTheDocument() // Puede fallar

// ✅ waitFor para async
await userEvent.click(button)
await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
```

**Critical Checklist:**
- ✅ LocalStorage: SIEMPRE try-catch + validación + versioning
- ✅ Zustand: NUNCA mutación directa - SIEMPRE immutable
- ✅ React 18: Cleanup effects (Strict Mode double render)
- ✅ Framer Motion: Animar transform/opacity, NO width/height
- ✅ Input: SIEMPRE validar user input
- ✅ PWA: Update notification + offline handling
- ✅ Performance: Import específicos, memoize expensive ops
- ✅ Testing: waitFor para async, userEvent sobre fireEvent

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

**Last Updated:** 2026-01-27
**Status:** Complete and optimized for LLM consumption
**Total Sections:** 7 (Technology Stack + 6 Rule Categories)
