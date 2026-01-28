---
stepsCompleted: [1, 2, 3, 5, 6, 7, 8]
inputDocuments:
  - product-brief-Tablas1-2026-01-26.md
date: 2026-01-26
author: enrique
---

# UX Design Specification Tablas1

**Author:** enrique
**Date:** 2026-01-26

---

## Executive Summary

### Project Vision

Tablas1 es una aplicación web móvil que transforma el aprendizaje de las tablas de multiplicar (2-9) en una aventura espacial interactiva para niños de 8 años. El producto convierte la repetición aburrida en una experiencia de juego entretenida, aprovechando la pasión del niño por el espacio para crear motivación intrínseca hacia la práctica matemática. A través de progresión por planetas, sistema de estrellas, y un dashboard personal, el niño experimenta autonomía y logro mientras desarrolla fluidez en multiplicaciones.

### Target Users

**Usuario Primario: Niño de 8 años**
- **Nivel Tecnológico**: Limitada experiencia con dispositivos móviles
- **Contexto de Uso**: Sesiones cortas (5-10 minutos) en momentos específicos del día
- **Dispositivo**: Teléfono Android vía navegador web
- **Motivación**: Le apasiona el tema espacial, pero evita la práctica tradicional por aburrida
- **Objetivo**: Responder multiplicaciones del 2-9 rápidamente y con confianza
- **Comportamiento Deseado**: Jugar voluntariamente y querer volver al día siguiente para desbloquear nuevos planetas

**Características del Usuario:**
- Necesita interfaces extremadamente intuitivas sin instrucciones
- Prefiere feedback visual inmediato sobre sonido
- Busca logros tangibles y progreso visible
- Valora autonomía y control sobre su propio aprendizaje

### Key Design Challenges

**1. Simplicidad para Usuario Inexperto en Móviles**
- Interfaz ultra intuitiva que no requiere experiencia previa con apps
- Sin gestos complejos (swipes, long-press, pinch-to-zoom)
- Navegación obvia y predecible para niños sin experiencia digital
- Controles táctiles grandes (mínimo 48px) con espaciado generoso
- Todo debe ser comprensible sin leer instrucciones

**2. Optimización para Sesiones Rápidas**
- Carga instantánea (PWA con caché agresivo)
- Acceso inmediato al juego sin barreras de navegación
- Cada sesión debe sentirse completa en 5-10 minutos
- Guardar progreso automático sin fricción
- "Toca y juega" en segundos desde abrir el navegador

**3. Web Móvil en Android**
- Diseño responsive que se sienta como app nativa
- Touch targets grandes y espaciados para dedos pequeños
- Rendimiento fluido en navegadores móviles (Chrome Android)
- Funcionar sin características nativas del sistema
- Experiencia consistente en diferentes tamaños de pantalla

**4. Sustituto de Sonido**
- Feedback visual rico que compensa ausencia de audio
- Animaciones celebratorias grandes y evidentes
- Indicadores visuales claros de correcto/incorrecto
- Progreso visible constantemente

### Design Opportunities

**1. Interfaz "Toca y Juega" Sin Fricción**
- Dashboard principal como mapa espacial interactivo
- Tocar planeta = iniciar juego inmediatamente
- Eliminar menús profundos y opciones complejas
- Reducir clicks entre "quiero jugar" y "estoy jugando" a 1-2 toques
- Diseño que invita a la exploración táctil

**2. Feedback Visual Como Sustituto de Audio**
- Animaciones grandes y celebratorias por respuestas correctas
- Confeti, estrellas, efectos de partículas espaciales
- Progreso visible en tiempo real (barras, contadores, planetas iluminándose)
- Cada interacción tiene respuesta visual inmediata y satisfactoria
- Aprovechar paleta de colores vibrante del espacio

**3. Diseño Auto-Explicativo**
- La interfaz misma es el tutorial
- Elementos visuales que comunican su función (affordances claras)
- Iconografía espacial reconocible (cohetes, planetas, estrellas)
- Sin necesidad de texto explicativo extenso
- Progressive disclosure: mostrar solo lo necesario para el siguiente paso

**4. Gamificación Visual Motivadora**
- Sistema solar como metáfora visual del progreso
- Planetas bloqueados/desbloqueados visualmente distintos
- Estrellas como recompensa tangible y coleccionable
- Racha de días representada con elementos espaciales (órbitas, trayectorias)
- Dashboard que cuenta una historia visual de conquista espacial

---

## Core User Experience

### Defining Experience

La experiencia central de Tablas1 se define por un ciclo de juego adictivo y satisfactorio: **Ver pregunta → Ingresar respuesta → Recibir feedback visual → Próxima pregunta**. Este loop debe ser instantáneo, claro y gratificante.

La acción más frecuente del usuario es **responder preguntas de multiplicación dentro de cada planeta**, y esta interacción es absolutamente crítica. Si este ciclo es fluido y satisfactorio, el niño querrá continuar jugando. El momento "Respuesta correcta → Celebración visual grande → Próxima pregunta" debe ser tan adictivo que naturalmente lleve a "una pregunta más".

La segunda experiencia central es **explorar el mapa espacial** como dashboard principal, donde el niño ve su progreso, elige su próximo destino, y siente orgullo por sus conquistas. Tocar un planeta debe llevarlo instantáneamente al juego, eliminando cualquier fricción entre intención y acción.

### Platform Strategy

**Plataforma Principal:** Web móvil para Android vía navegador (Chrome)

**Características Técnicas:**
- Progressive Web App (PWA) con caché agresivo para carga instantánea
- Diseño responsive optimizado para pantallas móviles (320px - 428px width típico)
- Touch-first: todos los controles diseñados para interacción táctil
- Sin dependencia de APIs nativas del sistema operativo
- Funcionalidad offline esencial: una vez cargada, el juego funciona sin conexión

**Decisiones de Plataforma:**
- **Sin vibraciones hápticas**: Mantener la experiencia completamente visual, sin estímulos físicos
- **Sin notificaciones push**: El niño decide cuándo jugar, sin recordatorios invasivos
- **LocalStorage para progreso**: Persistencia simple y confiable del estado del juego
- **Instalable pero no requerido**: Puede usarse desde navegador o instalarse como PWA

**Consideraciones de Rendimiento:**
- Animaciones con CSS/Canvas para rendimiento fluido (60fps)
- Imágenes optimizadas y lazy loading donde sea apropiado
- Tamaño total < 2MB para carga rápida en conexiones móviles

### Effortless Interactions

**Automático e Invisible (sin intervención del usuario):**

1. **Guardar Progreso**
   - Cada respuesta se guarda automáticamente en LocalStorage
   - Sin botones de "Guardar" o confirmaciones
   - El niño nunca pierde su progreso

2. **Retomar Sesión**
   - Abrir la app = volver exactamente donde estaba
   - Sin pantallas de "Continuar partida guardada"
   - Estado restaurado instantáneamente

3. **Tracking de Racha**
   - Racha de días se actualiza automáticamente
   - Visible en el dashboard sin navegar a estadísticas

4. **Cálculo de Estrellas**
   - Sistema automático de porcentaje → estrellas
   - El niño solo ve el resultado visual (Bronce/Plata/Oro)

**Completamente Natural (requiere mínimo esfuerzo):**

1. **Ver Próximo Objetivo**
   - Dashboard muestra claramente el siguiente planeta bloqueado
   - Señal visual que invita a "conquistar esto siguiente"

2. **Conocer Estado Actual**
   - Mapa solar muestra instantáneamente qué se ha conquistado
   - Contador de estrellas siempre visible

3. **Entrar a Jugar**
   - Desde abrir navegador hasta primera pregunta: < 3 segundos
   - Flujo: Abrir → Ver mapa → Tocar planeta → ¡Jugar!

4. **Saber si Acertó/Falló**
   - Feedback visual inmediato (< 300ms)
   - No hay ambigüedad: verde grande = correcto, rojo suave = intentar de nuevo

### Critical Success Moments

**Momento "Primera Impresión" (Make-or-Break):**

**Flujo:** Abre la app por primera vez → Ve mapa espacial hermoso → Toca primer planeta (tabla del 2) → Aparece primera pregunta "2 × 3 = ?" → Ingresa "6" → ¡EXPLOSIÓN de confeti y estrellas! → Próxima pregunta aparece

**Criticidad:** Si este flujo confunde, frustra, o no celebra adecuadamente el éxito, el niño nunca volverá. Debe ser instantáneamente comprensible y gratificante.

**Momento "Esto es Mejor" (Value Realization):**

**Cuándo:** Después de completar su primera sesión en un planeta y ver:
- El planeta iluminarse en el mapa
- Estrellas aparecer sobre el planeta conquistado
- Siguiente planeta desbloquearse con animación
- Dashboard mostrando "¡Has ganado 3 estrellas hoy!"

**Por qué importa:** Este es el momento donde el niño conecta "jugar = progreso visible" y siente que está conquistando algo real.

**Momento "Logro Personal" (Retention Driver):**

**Cuándo:** Al final de cada sesión, el dashboard muestra:
- Estrellas nuevas ganadas
- Racha de días (ej: "¡5 días explorando! 🔥")
- Récord personal si lo rompió
- Planetas conquistados visualizados

**Por qué importa:** Este momento de reflexión sobre el logro crea el deseo de volver mañana. "Quiero ver ese 6 días seguidos" o "Quiero desbloquear el próximo planeta".

**Momento "Flujo de Juego" (Engagement):**

**Cuándo:** Durante una sesión activa, el ciclo:
- Pregunta → Responde → Celebración visual → Siguiente pregunta
- Se repite sin interrupciones durante 10-15 preguntas

**Por qué importa:** Si el ritmo es correcto (ni muy lento, ni muy rápido), el niño entra en "flow state" y pierde la noción del tiempo. "Solo una más" se convierte en 20 preguntas antes de darse cuenta.

### Experience Principles

Estos principios guían TODAS las decisiones de diseño UX para Tablas1:

**1. Inmediatez Absoluta**
- De "abrir navegador" a "jugando" en menos de 3 segundos
- Cero barreras entre intención y acción
- El camino más corto siempre gana
- Ejemplo: No hay pantalla de inicio, menú principal complejo, o selección de perfil

**2. Feedback Visual Exagerado**
- Sin sonido = compensar con celebraciones visuales grandes y satisfactorias
- Cada acción tiene respuesta visual inmediata (< 300ms)
- El progreso siempre es visible y tangible
- "Más es más" cuando se trata de celebrar éxitos

**3. Obvio Sin Palabras**
- Un niño sin experiencia móvil debe entender todo sin leer instrucciones
- La interfaz se explica a sí misma mediante affordances visuales claras
- Los elementos visuales comunican su función (botones parecen botones, planetas parecen tocables)
- Iconografía espacial universalmente reconocible

**4. Autonomía y Logro**
- El niño es dueño de su progreso (dashboard para él, no para vigilancia parental)
- Cada sesión termina con sentido de logro visible y cuantificable
- Control total: puede elegir qué practicar (dentro de lo desbloqueado)
- Celebrar el esfuerzo y el progreso, nunca castigar errores

**5. Cero Fricción Técnica**
- Guardar progreso es automático e invisible
- Carga instantánea mediante PWA y caché agresivo
- Funciona fluido en cualquier Android moderno sin lag
- Offline-first después de la primera carga
- Sin formularios, logins, permisos, o interrupciones técnicas

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Duolingo - Aprendizaje Gamificado**

**Qué hace bien:**
- Racha de días ultra visible que motiva retorno diario
- Progresión lineal clara (niveles que se desbloquean secuencialmente)
- Feedback inmediato celebratorio (confeti, sonidos, animaciones)
- Sesiones cortas diseñadas (5-10 minutos perfectamente ejecutables)
- Sistema de niveles con recompensas visuales tangibles

**Por qué funciona:**
- Crea hábito mediante racha visible
- Cada sesión tiene inicio y final claro
- Progreso siempre visible motiva a continuar

**Aplicable a Tablas1:**
- Racha de días como motivador principal
- Progresión planetaria secuencial
- Celebraciones visuales exageradas

**Angry Birds - Juego Casual con Estrellas**

**Qué hace bien:**
- Sistema de 3 estrellas por nivel (bronce/plata/oro implícito)
- Niveles bloqueados/desbloqueados visualmente distintos
- Mapa de niveles como navegación principal
- Rejogar niveles para mejorar puntuación
- Tutorial integrado en primeros niveles

**Por qué funciona:**
- Sistema de estrellas da razón para repetir
- Mapa visual muestra progreso de un vistazo
- "Solo uno más" es irresistible

**Aplicable a Tablas1:**
- Sistema de 3 estrellas por planeta
- Mapa solar como navegación
- Posibilidad de mejorar estrellas repitiendo

**Monument Valley - Navegación Obvia**

**Qué hace bien:**
- Interfaz minimalista sin distracciones
- Elementos interactivos obvios visualmente
- Sin texto innecesario
- Cada pantalla tiene propósito claro
- Animaciones suaves que guían la atención

**Por qué funciona:**
- Cero curva de aprendizaje
- Belleza visual mantiene interés
- Intuición sobre instrucciones

**Aplicable a Tablas1:**
- Minimalismo en interfaz
- Planetas obviamente tocables
- Animaciones que guían

### Transferable UX Patterns

**Patrón 1: Racha Visual Prominente (de Duolingo)**
- Aplicación: Contador de días consecutivos siempre visible en dashboard
- Beneficio: Crea hábito y motivación para volver diariamente
- Adaptación para Tablas1: Representar racha con órbitas o trayectoria espacial

**Patrón 2: Mapa de Progresión (de Angry Birds)**
- Aplicación: Mapa solar interactivo como pantalla principal
- Beneficio: Navegación obvia + sentido de conquista visible
- Adaptación para Tablas1: Planetas en sistema solar, bloqueados/desbloqueados claramente distinguibles

**Patrón 3: Sistema de 3 Estrellas (universal en juegos)**
- Aplicación: Bronce (70%), Plata (85%), Oro (95%) por planeta
- Beneficio: Da razón para repetir y mejorar, sin sentir fracaso
- Adaptación para Tablas1: Estrellas flotando sobre planetas conquistados

**Patrón 4: Feedback Inmediato Exagerado (de juegos casuales)**
- Aplicación: Celebración visual grande por respuesta correcta
- Beneficio: Dopamina instantánea = querer continuar
- Adaptación para Tablas1: Confeti espacial, partículas de estrellas, planetas brillando

**Patrón 5: Sesiones con Final Claro (de Duolingo)**
- Aplicación: Pantalla de resumen al terminar sesión
- Beneficio: Sentido de completitud + reflexión sobre logro
- Adaptación para Tablas1: "¡Misión completa! Ganaste X estrellas hoy"

**Patrón 6: Progressive Disclosure (de Monument Valley)**
- Aplicación: Mostrar solo lo necesario en cada momento
- Beneficio: No abrumar a usuario inexperto
- Adaptación para Tablas1: Dashboard simple → Tocar planeta → Solo pregunta y teclado → Feedback

### Anti-Patterns to Avoid

**Anti-Patrón 1: Menús Profundos y Opciones Complejas**
- Problema: Niños sin experiencia móvil se pierden
- Ejemplo: Apps educativas con 5 niveles de menús
- Para evitar: Máximo 2 toques entre dashboard y jugar

**Anti-Patrón 2: Tutorial con Mucho Texto**
- Problema: Niños no leen instrucciones largas
- Ejemplo: Apps que explican todo antes de empezar
- Para evitar: Tutorial implícito, la interfaz se explica sola

**Anti-Patrón 3: Penalizaciones por Errores**
- Problema: Desmotiva y crea ansiedad
- Ejemplo: Perder vidas, game over, bloqueos por fallos
- Para evitar: Errores = oportunidad de aprender, sin castigo

**Anti-Patrón 4: Métricas Vanidosas sin Significado**
- Problema: Números que no representan progreso real
- Ejemplo: Puntos arbitrarios sin contexto
- Para evitar: Métricas ligadas a dominio real (% aciertos → estrellas)

**Anti-Patrón 5: Saturación Visual y Distracciones**
- Problema: Abruma y distrae del objetivo principal
- Ejemplo: Apps con 10 elementos parpadeando simultáneamente
- Para evitar: Diseño limpio, una acción principal por pantalla

**Anti-Patrón 6: Requerir Cuenta/Login para Empezar**
- Problema: Fricción que mata el impulso de jugar
- Ejemplo: Apps que piden email/cuenta antes de probar
- Para evitar: LocalStorage, jugar inmediatamente

### Design Inspiration Strategy

**Qué Adoptar Directamente:**

1. **Sistema de Racha de Días** (Duolingo)
   - Porque: Motiva retorno diario sin presión externa
   - Cómo: Contador visible en dashboard, celebración por mantener racha

2. **Mapa Visual de Progresión** (Angry Birds)
   - Porque: Navegación obvia + sentido de conquista
   - Cómo: Sistema solar interactivo como pantalla principal

3. **Sistema de 3 Estrellas** (Universal)
   - Porque: Estándar reconocible + motiva mejora
   - Cómo: Bronce/Plata/Oro por planeta, visible en mapa

**Qué Adaptar para Nuestro Contexto:**

1. **Feedback Celebratorio** (juegos casuales)
   - Adaptación: Sin sonido, compensar con visuales GRANDES
   - Cómo: Confeti espacial, explosión de partículas, planeta brillando

2. **Progressive Disclosure** (Monument Valley)
   - Adaptación: Simplificar aún más para usuario sin experiencia móvil
   - Cómo: Una acción obvia por pantalla, sin opciones ocultas

3. **Sesiones Cortas Diseñadas** (Duolingo)
   - Adaptación: 5-10 minutos naturalmente, no forzado
   - Cómo: 15-20 preguntas se siente completo, pero puede continuar si quiere

**Qué Evitar Completamente:**

1. **Monetización Agresiva** (muchos juegos móviles)
   - Por qué: Conflicto con objetivo educativo puro
   - Alternativa: Progreso 100% ganado por mérito

2. **Social Features Complejas** (muchas apps)
   - Por qué: Complejidad innecesaria + privacidad
   - Alternativa: Progreso personal, sin comparación con otros

3. **Notificaciones Push** (apps de hábito)
   - Por qué: Respeta autonomía del niño
   - Alternativa: Racha visible motiva sin recordatorios externos

**Esta estrategia combina lo mejor de juegos casuales exitosos con las necesidades específicas de un niño de 8 años aprendiendo matemáticas, manteniendo Tablas1 único mediante su temática espacial y enfoque en autonomía.**

---

## Design System Foundation

### Design System Choice

**Tailwind CSS + Custom Components**

Tablas1 utilizará Tailwind CSS como base de utilidades de diseño combinado con componentes personalizados creados específicamente para la temática espacial y las necesidades del juego educativo.

### Rationale for Selection

**1. Velocidad de Desarrollo + Flexibilidad Total**
- Tailwind permite prototipado rápido mediante clases utilitarias
- No impone restricciones visuales = libertad total para tema espacial único
- Ideal para proyecto de un solo desarrollador

**2. Customización Visual Única Requerida**
- Tema espacial necesita componentes visuales personalizados (planetas, estrellas, mapa solar, confeti espacial)
- Sistemas pre-hechos (Material, MUI) no ofrecen estos elementos
- Tailwind permite construir exactamente lo que se necesita sin luchar contra defaults

**3. Optimización Móvil Nativa**
- Tailwind está diseñado mobile-first desde el inicio
- Todas las clases tienen variantes responsive out-of-the-box
- Perfecto para PWA móvil en Android

**4. Bundle Size Óptimo para PWA**
- Tailwind con PurgeCSS elimina CSS no utilizado
- Resultado: bundle mucho más liviano que frameworks completos
- Crítico para carga instantánea en móvil (< 2MB total)

**5. Nivel de Experiencia Apropiado**
- Usuario intermedio puede trabajar efectivamente con Tailwind
- Curva de aprendizaje menor que React component libraries complejas
- Documentación excelente y amplia comunidad

**6. Sin Overhead Innecesario**
- MUI/Chakra incluyen toneladas de componentes que nunca usaremos
- Tablas1 necesita: botones, inputs numéricos, cards simples, y custom visuals
- Tailwind = solo pagar por lo que usas

### Implementation Approach

**Stack Técnico Propuesto:**

**Frontend Framework:** React (recomendado) o Vue
- React: Ecosystem maduro, excelente para animaciones con Framer Motion
- Vue: Más simple si prefieres menor complejidad

**Styling:**
- **Tailwind CSS 3.x** - Utilidades base
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad cross-browser

**Animaciones:**
- **Framer Motion** (si React) - Animaciones declarativas fluidas
- **@vueuse/motion** (si Vue) - Alternativa para Vue
- **CSS Animations** nativas para efectos simples

**Componentes Visuales Custom:**
- Mapa Solar interactivo (Canvas o SVG)
- Planetas (SVG con animaciones CSS)
- Sistema de partículas para confeti (Canvas)
- Estrellas y efectos espaciales (SVG + CSS)

**Icons:**
- **Lucide Icons** o **Heroicons** - Iconos SVG minimalistas
- Custom SVG para elementos espaciales específicos

**Tipografía:**
- Google Fonts: Fuente sans-serif clara y legible para niños
- Considerar: Nunito, Quicksand, o Poppins (friendly y redondas)
- Peso: Principalmente Bold/Semibold para claridad máxima

### Customization Strategy

**Paleta de Colores Espacial:**

```javascript
// tailwind.config.js custom colors
colors: {
  space: {
    dark: '#0a0e27',      // Fondo espacio profundo
    navy: '#1a2332',       // Espacio medio
    purple: '#5b21b6',     // Acentos nebulosa
    blue: '#2563eb',       // Planetas azules
    cyan: '#06b6d4',       // Brillos y efectos
    gold: '#fbbf24',       // Estrellas doradas
    success: '#10b981',    // Feedback positivo
    warning: '#f59e0b',    // Feedback neutro
  }
}
```

**Spacing y Sizing Custom:**
- Touch targets mínimos: 48px (mayor que default 44px)
- Spacing generoso entre elementos interactivos
- Font sizes más grandes de lo habitual (16px mínimo en móvil)

**Border Radius:**
- Elementos muy redondeados (rounded-2xl, rounded-3xl)
- Planetas = círculos perfectos (rounded-full)
- Botones amigables y accesibles visualmente

**Sombras y Efectos:**
- Drop shadows para profundidad espacial
- Glow effects para planetas y estrellas activas
- Animaciones de pulse para elementos interactivos

**Componentes Custom a Desarrollar:**

1. **SolarMap Component**
   - Canvas/SVG interactivo
   - Planetas posicionados en órbitas
   - Estados: locked, unlocked, active, completed
   - Animaciones de unlock

2. **Planet Component**
   - Visual único por tabla (colores/texturas diferentes)
   - Sistema de estrellas superpuesto
   - Estados hover/active para touch
   - Glow effect cuando está activo

3. **QuestionCard Component**
   - Display de pregunta grande y clara
   - Input numérico optimizado para móvil
   - Keyboard numérico custom (0-9 + borrar + enviar)
   - Feedback visual integrado

4. **CelebrationOverlay Component**
   - Sistema de partículas para confeti
   - Animaciones de entrada/salida
   - Variantes: small (respuesta correcta), big (planeta completado)

5. **StatsPanel Component**
   - Contador de racha de días
   - Colección de estrellas totales
   - Récords personales
   - Visualización de progreso por tabla

6. **ProgressBar Component**
   - Barra visual de progreso en sesión activa
   - Animación smooth de relleno
   - Indicador de estrellas potenciales

**Design Tokens (Tailwind Config):**

- Transiciones: 150ms para feedback inmediato, 300ms para cambios de estado
- Easing: ease-out para sensación responsiva
- Z-index layers: Definir layers claros (background, content, overlay, modal)
- Breakpoints: Solo mobile (default) y tablet (640px+) necesarios

**Accessibility Considerations:**

- Colores con contraste WCAG AA mínimo
- Touch targets de 48px+
- Focus states visibles para keyboard navigation (aunque poco usado)
- Animaciones respetan prefers-reduced-motion
- Semantic HTML para screen readers (aunque no es el target primario)

Esta estrategia de design system balancea velocidad de desarrollo con la flexibilidad necesaria para crear una experiencia visual única y atractiva para un niño de 8 años, manteniendo el bundle ligero y el rendimiento óptimo para PWA móvil.

---

## Visual Design Foundation

### Color System

**Paleta Principal Espacial:**

```
Space Dark:    #0a0e27  - Fondo de espacio profundo (backgrounds principales)
Space Navy:    #1a2332  - Espacio medio (cards, containers)
Space Purple:  #5b21b6  - Acentos de nebulosa (highlights, hover states)
Space Blue:    #2563eb  - Planetas azules (elementos primarios interactivos)
Space Cyan:    #06b6d4  - Brillos y efectos (glow effects, borders activos)
Space Gold:    #fbbf24  - Estrellas doradas (recompensas, achievements)
```

**Colores Semánticos:**

```
Success:  #10b981  - Respuestas correctas, feedback positivo
Warning:  #f59e0b  - Estados neutros, alertas informativas
Error:    #ef4444  - Errores suaves (sin alarmar al niño)
```

**Colores de UI:**

```
Text Primary:    #ffffff  - Texto sobre fondos oscuros (100% legibilidad)
Text Secondary:  #9ca3af  - Texto secundario (menor jerarquía)
Text Muted:      #6b7280  - Texto desenfatizado (placeholders, hints)
```

**Aplicación del Color:**

- **Fondos**: Gradientes de space-dark a space-navy para profundidad
- **Planetas**: Cada tabla tiene color único derivado de la paleta (2=cyan, 3=blue, 4=purple, etc.)
- **Estados**: locked=grayscale, unlocked=full color, active=gold glow, completed=green checkmark
- **Feedback**: Verde brillante para correcto, rojo suave para incorrecto (sin dramatizar)
- **Celebraciones**: Explosiones de gold, cyan y purple para confeti

**Contraste y Accesibilidad:**

- Todos los pares texto/fondo cumplen WCAG AA (mínimo 4.5:1)
- Text primary (#ffffff) sobre space-dark (#0a0e27) = contraste perfecto
- Botones primarios usan space-blue con texto blanco = excelente contraste
- Estados disabled usan opacity 50% para indicar no-interactividad

### Typography System

**Fuente Principal: Poppins (Google Fonts)**

Seleccionada por:
- Formas redondeadas y amigables ideales para niños
- Excelente legibilidad en pantallas móviles
- Pesos disponibles: Regular (400), SemiBold (600), Bold (700)
- Números claros y distinguibles (crítico para app matemática)

**Escala Tipográfica:**

```
Display (Títulos Hero):
  - Size: 48px (3rem)
  - Weight: Bold (700)
  - Line Height: 1.1
  - Uso: Pantallas de celebración, logros grandes

H1 (Títulos Principales):
  - Size: 32px (2rem)
  - Weight: Bold (700)
  - Line Height: 1.2
  - Uso: Nombres de planetas, títulos de secciones

H2 (Subtítulos):
  - Size: 24px (1.5rem)
  - Weight: SemiBold (600)
  - Line Height: 1.3
  - Uso: Stats, contadores, labels importantes

Body Large (Preguntas Matemáticas):
  - Size: 40px (2.5rem)
  - Weight: Bold (700)
  - Line Height: 1.2
  - Uso: Preguntas de multiplicación (6 × 7 = ?)

Body (Texto Estándar):
  - Size: 18px (1.125rem)
  - Weight: Regular (400)
  - Line Height: 1.5
  - Uso: Descripciones, instrucciones breves

Small (Texto Secundario):
  - Size: 14px (0.875rem)
  - Weight: Regular (400)
  - Line Height: 1.4
  - Uso: Hints, mensajes pequeños
```

**Decisiones Tipográficas:**

- **Mínimo 16px móvil**: Ningún texto menor a 16px excepto micro-copy ocasional
- **Números extra grandes**: Preguntas matemáticas a 40px para claridad absoluta
- **Weight bold por defecto**: Elementos importantes usan SemiBold o Bold para máximo contraste
- **Sin italic**: Solo regular y bold, sin cursiva (más simple visualmente)
- **Letter-spacing normal**: Sin tracking ajustado, legibilidad máxima

**Jerarquía de Lectura:**

1. Pregunta matemática (40px bold) = lo más importante
2. Feedback de respuesta (32px bold colored) = segundo más importante
3. Contador de progreso (24px semibold) = información contextual
4. Botones y labels (18px regular/semibold) = acciones disponibles

### Spacing & Layout Foundation

**Sistema de Espaciado (8px base):**

```
xs:  4px   (0.25rem)  - Spacing interno mínimo
sm:  8px   (0.5rem)   - Spacing entre elementos relacionados
md:  16px  (1rem)     - Spacing estándar entre componentes
lg:  24px  (1.5rem)   - Spacing entre secciones
xl:  32px  (2rem)     - Spacing entre bloques grandes
2xl: 48px  (3rem)     - Spacing vertical entre pantallas
3xl: 64px  (4rem)     - Padding máximo en containers
```

**Touch Targets:**

- Mínimo absoluto: 48px × 48px (WCAG AAA)
- Preferido: 56px × 56px para botones primarios
- Planetas en mapa: 72px-96px de diámetro (grandes y obvios)
- Spacing entre touch targets: mínimo 8px

**Layout Móvil-First:**

**Estructura de Pantalla Típica:**
```
┌─────────────────────────┐
│   Header (56px)         │ Stats, back button
├─────────────────────────┤
│                         │
│   Content Area          │ Mapa solar / Pregunta / Stats
│   (flex-grow)           │ Padding: 16px laterales
│                         │
├─────────────────────────┤
│   Footer/Actions (auto) │ Botones primarios si aplica
└─────────────────────────┘
```

**Márgenes y Padding:**

- Container principal: padding 16px (móvil), 24px (tablet)
- Cards: padding 20px interno
- Botones: padding 12px vertical, 24px horizontal
- Inputs: padding 16px todos los lados

**Layout Patterns:**

**Dashboard (Mapa Solar):**
- Full screen canvas/SVG
- Planetas posicionados con spacing visual generoso
- Stats overlay en esquinas (no obstruye vista)

**Pantalla de Juego:**
- Centrado vertical del contenido
- Pregunta: top 20% de pantalla
- Teclado numérico: bottom 20% de pantalla
- Espacio intermedio para feedback visual

**Modal/Overlay:**
- Z-index 1000
- Backdrop opacity 80%
- Content centrado con max-width 400px
- Padding 24px interno

### Accessibility Considerations

**Contraste de Color:**
- Todos los pares texto/fondo cumplen WCAG AA mínimo (4.5:1)
- Elementos interactivos tienen contraste 3:1 con fondo
- Estados disabled claramente distinguibles (opacity 50%)

**Touch Accessibility:**
- Todos los elementos interactivos ≥48px touch target
- Spacing mínimo 8px entre elementos tocables
- No requiere precisión extrema (dedos de niño)

**Motion Accessibility:**
- Respeta `prefers-reduced-motion` para animaciones
- Animaciones críticas (feedback) siempre visibles
- Animaciones decorativas se reducen si preferencia activada

**Semantic HTML:**
- Estructura semántica correcta (header, main, button, etc.)
- ARIA labels donde sea necesario
- Focus visible en keyboard navigation (aunque poco usado en móvil)

**Legibilidad:**
- Contraste alto en todos los textos
- Font size mínimo 16px
- Line height generoso (1.4-1.5)
- Sans-serif clara y legible

**Esta fundación visual asegura una experiencia consistente, accesible y visualmente atractiva que captura la magia del espacio mientras mantiene la funcionalidad educativa en primer plano.**
