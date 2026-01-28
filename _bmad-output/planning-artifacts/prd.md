---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping']
inputDocuments:
  - 'product-brief-Tablas1-2026-01-26.md'
  - 'ux-design-specification.md'
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
uxDesignCount: 1
classification:
  projectType: 'web_app'
  domain: 'edtech'
  complexity: 'low'
  projectContext: 'greenfield'
skippedSteps: ['step-05-domain', 'step-06-innovation', 'step-08-scoping']
---

# Product Requirements Document - Tablas1

**Author:** enrique
**Date:** 2026-01-26

## Success Criteria

### User Success

**Objetivo Principal:** El niño domina las tablas de multiplicar del 2 al 9, respondiendo rápidamente y con confianza.

**Criterios Específicos:**
- **Velocidad de Respuesta:** Responde correctamente cualquier multiplicación del 2-9 en menos de 3 segundos
- **Precisión:** Alcanza al menos 70% de aciertos en cada tabla (mínimo Bronce) para desbloquear la siguiente
- **Engagement Voluntario:** Juega por iniciativa propia sin necesidad de recordatorios parentales
- **Frecuencia de Uso:** Juega al menos 3 veces por semana de forma voluntaria
- **Duración de Sesión:** Sesiones naturales de 10-15 minutos que se sienten como "juego", no como "estudio"
- **Progresión Completa:** Desbloquea los 8 planetas secuencialmente y completa al menos nivel Bronce en todos

**Momento "Aha!" del Usuario:**
Cuando el niño puede responder multiplicaciones mentalmente en su vida cotidiana sin necesidad de contar o calcular, sintiendo confianza en sus habilidades matemáticas.

**Indicadores de Éxito Emocional:**
- Pide jugar sin ser solicitado
- Dice "solo una más" y continúa jugando
- Muestra entusiasmo por desbloquear el próximo planeta
- Actitud positiva hacia las matemáticas en general

### Business Success

**Contexto:** Proyecto personal para uso familiar, sin objetivos comerciales en MVP.

**Criterio Principal de Éxito:**
El niño usa la aplicación de forma sostenida durante al menos 2-3 semanas y muestra mejora observable en dominio de multiplicaciones.

**Validación del Concepto:**
- **Semana 1:** El niño abre la app voluntariamente al menos 3 veces
- **Semana 2:** Desbloquea al menos 4 planetas (tablas 2-5)
- **Semana 3:** Mantiene racha y continúa progresando hacia planetas finales

**Éxito a Mediano Plazo (Post-MVP):**
Si el concepto funciona con el hijo, considerar:
- Compartir con otros padres/niños en contexto similar
- Expandir a otras operaciones matemáticas (divisiones, sumas avanzadas)
- Versión para tablet/escritorio

### Technical Success

**Rendimiento Móvil:**
- **Tiempo de Carga Inicial:** < 3 segundos en conexión móvil 4G
- **Tiempo de Respuesta:** < 300ms de feedback visual tras cada respuesta
- **Fluidez:** Animaciones a 60fps sin lag perceptible
- **Tamaño de Bundle:** < 2MB total para carga rápida

**Funcionalidad Offline:**
- Después de primera carga, funciona completamente sin conexión
- Progreso se guarda localmente sin pérdida de datos
- Sin dependencia de APIs externas

**Compatibilidad:**
- Funciona fluido en Android moderno (Chrome móvil)
- Responsive en pantallas móviles 320px - 428px width
- Touch targets mínimos de 48px para dedos de niño

**Estabilidad:**
- Sin bugs críticos que impidan jugar
- Sin pérdida de progreso entre sesiones
- Manejo correcto de errores (ej: LocalStorage lleno)

### Measurable Outcomes

**Métricas de Aprendizaje (medibles vía LocalStorage):**
- Tiempo promedio de respuesta por tabla
- Porcentaje de aciertos por tabla
- Número de intentos por pregunta
- Tablas completadas con cada nivel de estrellas (Bronce/Plata/Oro)

**Métricas de Engagement:**
- Días consecutivos jugando
- Número total de sesiones
- Duración promedio de sesión
- Planetas desbloqueados

**Indicadores de Mejora:**
- Reducción del tiempo de respuesta en tablas practicadas
- Aumento del porcentaje de aciertos a lo largo del tiempo
- Menos intentos por pregunta en tablas ya vistas

## Product Scope

### MVP - Minimum Viable Product (v1.0)

**Lo que SÍ incluye el MVP:**

**Core Gameplay:**
- 8 planetas representando tablas del 2 al 9
- Progresión secuencial: desbloquear planetas uno tras otro
- Sistema de preguntas de multiplicación con input numérico
- Feedback visual inmediato: verde = correcto, rojo = incorrecto
- Sistema de 3 estrellas por planeta (Bronce 70%, Plata 85%, Oro 95%)

**Dashboard & Navegación:**
- Mapa solar visual simple como pantalla principal
- Planetas bloqueados/desbloqueados visualmente diferenciados
- Contador de estrellas totales recolectadas
- Posibilidad de repetir planetas para mejorar estrellas

**Persistencia:**
- Guardado automático de progreso en LocalStorage
- Estado del juego persiste entre sesiones
- Recuperación automática al abrir la app

**Visual & UX:**
- Temática espacial consistente
- Diseño móvil-first responsive
- Touch targets grandes (48px+)
- Paleta de colores espacial definida
- Tipografía Poppins legible

**Lo que NO incluye el MVP (pospuesto para iteraciones):**
- ❌ Modo Aleatorio de práctica libre
- ❌ Racha de días consecutivos
- ❌ Animaciones elaboradas de confeti/partículas
- ❌ Stats detallados por sesión
- ❌ Récord personal de velocidad
- ❌ Sonido (por diseño, se mantiene sin sonido)
- ❌ Notificaciones push
- ❌ Multijugador
- ❌ Power-ups o mecánicas avanzadas

### Growth Features (Post-MVP v1.1 - v1.3)

**Después de validar concepto con el niño:**

**v1.1 - Mejoras de Engagement (1-2 semanas post-lanzamiento):**
- Modo Aleatorio: práctica de tablas desbloqueadas sin presión
- Racha de días consecutivos visible en dashboard
- Animaciones celebratorias más elaboradas (confeti espacial, partículas)
- Pantalla de resumen al terminar sesión

**v1.2 - Stats & Motivación (3-4 semanas):**
- Dashboard de estadísticas más detallado
- Récord personal de velocidad por tabla
- Gráfico de progreso histórico
- Visualización de tablas "dominadas" vs "en progreso"

**v1.3 - Polish & Extras (si hay demanda):**
- Más animaciones y efectos visuales
- Personalización básica de avatar/nave espacial
- Logros y trofeos coleccionables
- Sonido opcional (si se requiere)

### Vision (Future - Largo Plazo)

**Si el producto demuestra valor sostenido:**

**Expansión de Contenido:**
- Tablas extendidas (×11, ×12)
- Divisiones como operación inversa
- Boss battles temáticos al final de cada planeta
- Misiones diarias y desafíos especiales
- Nuevos "sistemas solares" con operaciones más complejas

**Gamificación Profunda:**
- Sistema completo de personalización de astronauta
- Power-ups estratégicos ganados por mérito
- Colección de logros y trofeos temáticos
- Mini-juegos educativos espaciales variados

**Plataformas Adicionales:**
- Versión tablet/escritorio optimizada
- PWA instalable para uso completamente offline
- Sincronización opcional entre dispositivos (si se expande más allá de uso personal)

**Características Sociales (Opcional, con cuidado):**
- Modo cooperativo para hermanos
- Desafíos amistosos sin rankings públicos
- Compartir logros de forma positiva (sin presión competitiva)

**Aprendizaje Adaptativo:**
- Sistema que detecta multiplicaciones problemáticas y las refuerza
- Dificultad adaptativa basada en rendimiento
- Sugerencias inteligentes de qué practicar
- Algoritmo de repetición espaciada

## User Journeys

### Journey 1: Primera Exploración - El Descubrimiento Espacial

**Persona:** Lucas, 8 años
- **Personalidad:** Curioso por el espacio, le gustan los planetas y cohetes
- **Experiencia técnica:** Usa poco el móvil, principalmente para ver videos
- **Situación actual:** Su padre le acaba de abrir una "nueva aplicación espacial" en el teléfono

**Situación:** Es tarde en la tarde después de hacer sus deberes. Su padre le muestra una app nueva en el móvil y le dice "pruébala, creo que te va a gustar". Lucas no sabe qué esperar, pero ve planetas en la pantalla y eso le llama la atención.

**Goal:** Entender qué es esto y, si es divertido, seguir jugando.

**Obstáculo:** No ha usado muchas apps antes. No sabe qué tocar, qué hace cada cosa, ni si esto va a ser "aburrido como las hojas de ejercicios".

**Opening Scene (Primera Impresión):**
Lucas toca el ícono en el navegador. La pantalla carga (tarda 2 segundos). Aparece un espacio oscuro con estrellas y un sistema solar. Ve 8 planetas. La mayoría están grises (bloqueados), pero el primero (el más cercano) está brillando en azul cyan. Hay un contador en la esquina que dice "0 ⭐". Lucas piensa: "¿Qué es esto? ¿Es un juego?"

**¿Qué podría salir mal?**
- La app tarda más de 3 segundos en cargar → Lucas pierde interés y cierra el navegador
- El mapa solar es confuso → No sabe qué tocar
- No hay señal visual clara de "toca aquí para empezar" → Se queda mirando sin hacer nada

**Rising Action (Primer Planeta):**
Lucas, intrigado por el planeta brillante, lo toca. Inmediatamente (sin menús intermedios) aparece una pregunta grande: "2 × 3 = ?" con un teclado numérico abajo. Lucas sabe la respuesta. Escribe "6" y toca el botón de enviar (o la pregunta detecta automáticamente que ya escribió la respuesta).

¡EXPLOSIÓN de color verde! La pantalla celebra con feedback visual grande. Lucas sonríe. Aparece la siguiente pregunta: "2 × 4 = ?". Responde "8". Otra celebración. Y otra pregunta. Y otra.

**Emociones:** Curiosidad → Confianza → Diversión → "Una más..."

**¿Qué podría salir mal?**
- Lucas no sabe una respuesta → Necesita poder fallar sin castigo, intentar de nuevo
- No sabe cómo "terminar" la sesión → Necesita saber cuántas preguntas quedan o poder salir fácilmente
- Se aburre después de 5 preguntas idénticas → Necesita variedad o saber que está progresando

**Climax (Completar Primer Planeta):**
Después de 15-20 preguntas de la tabla del 2, aparece una pantalla de celebración: "¡Planeta Conquistado! Has ganado 3 ⭐ ESTRELLAS DE ORO!" (asumiendo que acertó más del 95%). Lucas ve que ha desbloqueado algo. Vuelve automáticamente al mapa solar.

**Resolution (Sentido de Logro):**
El primer planeta ahora está iluminado con un brillo especial y tiene 3 estrellas doradas flotando sobre él. El segundo planeta (tabla del 3) ahora está desbloqueado y brilla invitando a ser tocado. El contador de estrellas ahora dice "3 ⭐".

Lucas piensa: "¡Desbloqueé el siguiente planeta! Quiero ver qué pasa si toco ese también..." Toca el segundo planeta y empieza a jugar la tabla del 3.

**Nueva Realidad:** Lucas ha entendido el juego. Sabe que cada planeta es una tabla, que puede desbloquear más planetas, y que las estrellas son su "tesoro" espacial. Quiere seguir jugando "solo una más" hasta que su padre le dice que es hora de cenar.

**Requirements Revelados por este Journey:**
- **Onboarding implícito:** No hay tutorial con texto, la interfaz se explica sola
- **Tiempo de carga crítico:** < 3 segundos o pierde al usuario
- **Call-to-action visual claro:** Primer planeta debe brillar/pulsar para indicar "empieza aquí"
- **Transición inmediata:** Tocar planeta → Jugar (sin menús intermedios)
- **Feedback visual instantáneo:** < 300ms tras responder
- **Preguntas variadas:** Mezclar orden de preguntas para evitar patrones predecibles
- **Indicador de progreso:** Saber cuántas preguntas quedan o algún tipo de barra de progreso
- **Celebración de completitud:** Pantalla especial al terminar planeta
- **Vuelta al mapa automática:** Para ver el logro y descubrir siguiente planeta
- **Estados visuales de planetas:** locked (gris), unlocked (color brillante), completed (iluminado con estrellas)
- **Manejo de errores graceful:** Permitir fallar sin castigo, reintentar

### Journey 2: Sesión Típica - Conquistando el Siguiente Planeta

**Persona:** El mismo niño (Lucas), 3 días después
- **Situación actual:** Ha desbloqueado 3 planetas (tablas 2, 3, 4). Ya entiende cómo funciona el juego.

**Situación:** Es sábado por la mañana. Lucas recuerda que tiene la app espacial. Toma el móvil de su padre y abre el navegador buscando Tablas1 (o toca el ícono PWA si lo tiene instalado).

**Goal:** Desbloquear el siguiente planeta (tabla del 5) y quizás mejorar las estrellas de planetas anteriores si no tiene oro en todos.

**Obstáculo:** La tabla del 5 es más difícil que las anteriores. Podría cometer más errores.

**Opening Scene (Retomando el Juego):**
La app carga instantáneamente (ya está en caché). Lucas ve su mapa solar. Los primeros 3 planetas están iluminados con sus estrellas. Ve que el planeta 1 (tabla del 2) tiene 3 estrellas oro, el planeta 2 (tabla del 3) tiene 2 estrellas plata, y el planeta 3 (tabla del 4) tiene 3 estrellas oro. El cuarto planeta (tabla del 5) está desbloqueado y brillando, esperándolo.

Lucas piensa: "Quiero conseguir 3 estrellas en el planeta 2 primero, y luego voy al 5."

**Rising Action (Mejorando Estrellas):**
Lucas toca el planeta 2 (tabla del 3) que ya había completado. Ve las preguntas de la tabla del 3 de nuevo. Esta vez va más rápido porque ya las practicó. Completa la sesión con 95% de aciertos.

Pantalla de celebración: "¡MEJORADO! Ahora tienes 3 ⭐ ESTRELLAS DE ORO!" Vuelve al mapa y ve que el planeta 2 ahora tiene 3 estrellas oro en lugar de 2 plata.

**Emociones:** Orgullo → Motivación → "Ahora sí voy al planeta nuevo"

**Climax (Enfrentando Dificultad):**
Lucas toca el planeta 4 (tabla del 5). Las preguntas empiezan: "5 × 3 = ?". Duda un segundo... "15". Correcto, celebración verde. "5 × 7 = ?". Lucas cuenta mentalmente... "35". Correcto. "5 × 9 = ?". Se equivoca, pone "40".

La pantalla NO explota en rojo alarmante. Muestra un feedback suave: "¡Inténtalo de nuevo!" con la respuesta incorrecta desapareciendo. Lucas piensa de nuevo: "45". Correcto, celebración.

**¿Qué podría salir mal?**
- Lucas se frustra con errores repetidos → Necesita feedback positivo de "estás aprendiendo"
- No sabe si va a "perder" por fallar → Necesita entender que no hay castigo
- La sesión se hace muy larga porque está fallando mucho → Quizás limitar a 20 preguntas y calcular % al final

**Resolution (Completitud con Bronce):**
Termina la sesión con 75% de aciertos. Pantalla de celebración: "¡Planeta Conquistado! Has ganado 1 ⭐ ESTRELLA DE BRONCE! Sigue practicando para mejorar a Plata y Oro."

Lucas vuelve al mapa. El planeta 4 ahora tiene 1 estrella bronce. El planeta 5 (tabla del 6) se desbloquea con animación brillante.

**Nueva Realidad:** Lucas entiende que puede repetir planetas para mejorar. No se siente mal por haber sacado solo Bronce, porque sabe que puede volver y mejorar. Decide jugar un planeta más (el 5) antes de dejar el móvil.

**Requirements Revelados por este Journey:**
- **Carga instantánea en visitas recurrentes:** PWA con caché agresivo
- **Persistencia visual del progreso:** Mapa muestra claramente qué se ha completado y con cuántas estrellas
- **Permitir repetir planetas:** Tocar planeta ya completado = rejugar para mejorar estrellas
- **Feedback de error no punitivo:** "Inténtalo de nuevo" sin alarmas rojas estresantes
- **Posibilidad de fallar y seguir:** No hay "game over", siempre completas el planeta
- **Sistema de estrellas progresivo:** Bronce (70%), Plata (85%), Oro (95%)
- **Feedback de mejora:** "¡MEJORADO!" cuando mejora estrellas en planeta ya completado
- **Animación de desbloqueo:** Planeta siguiente se anima cuando se desbloquea
- **Sesiones variables:** Puede jugar un planeta (5-10 min) o varios seguidos

### Journey 3: Regreso Después de Ausencia - Recuperando el Impulso

**Persona:** El mismo niño (Lucas), 5 días después de su última sesión
- **Situación actual:** Ha desbloqueado 5 planetas. Dejó de jugar unos días porque estuvo ocupado con otras cosas.

**Situación:** Miércoles por la tarde. Lucas está aburrido esperando a que su padre termine de trabajar. Recuerda la app espacial y decide abrirla de nuevo.

**Goal:** Retomar donde lo dejó y seguir progresando.

**Obstáculo:** Han pasado días. ¿Se acordará de dónde estaba? ¿Habrá perdido su progreso?

**Opening Scene (Recuperación Automática):**
Lucas abre la app. Carga instantáneamente. Ve su mapa solar exactamente como lo dejó: 5 planetas completados con sus estrellas, el sexto planeta (tabla del 7) desbloqueado esperándolo. Su contador de estrellas muestra el total acumulado.

Lucas piensa: "Ah, todo sigue aquí. No perdí nada." Se siente aliviado y motivado para continuar.

**¿Qué podría salir mal?**
- El progreso NO se guardó → Lucas pierde confianza en la app y no quiere volver a empezar
- No recuerda dónde estaba → Necesita que el mapa sea obvio sobre "siguiente objetivo"
- Se siente desconectado después de días sin jugar → Necesita algo que lo re-enganche emocionalmente

**Rising Action (Re-enganche):**
Lucas toca el planeta 6 (tabla del 7). Empieza a jugar. Las primeras preguntas las responde correctamente y recuerda por qué le gustaba esto. El ritmo del juego lo vuelve a enganchar: pregunta → respuesta → feedback → siguiente pregunta.

**Climax (Redescubriendo el Flow):**
Después de 10 preguntas, Lucas está completamente inmerso. Ha entrado en el "flow state" donde pierde la noción del tiempo. "Solo una más" se convierte en terminar el planeta completo y querer empezar el siguiente.

**Resolution (Continuidad):**
Completa el planeta 6 con Plata (88% de aciertos). Ve el planeta 7 (tabla del 8) desbloquearse. Decide jugar "solo el siguiente y ya" pero termina jugando también el planeta 7 antes de que su padre le diga que es hora de cenar.

**Nueva Realidad:** Lucas ha recuperado el hábito. Recuerda que este juego es divertido y quiere volver mañana para terminar el último planeta (tabla del 9) y tener todos completados.

**Momento Futuro (Post-MVP - Racha de Días):**
En versiones futuras, aquí es donde la racha de días sería poderosa: "¡Volviste después de 5 días! Tu racha anterior fue de 3 días. ¿Puedes superar ese récord?" Esto crearía motivación adicional para volver diariamente.

**Requirements Revelados por este Journey:**
- **Guardado automático robusto:** Progreso persiste días/semanas después sin pérdida
- **Recuperación instantánea:** Estado exacto del juego se restaura automáticamente
- **Mapa como "memoria visual":** Usuario ve de un vistazo dónde estaba y qué sigue
- **Próximo objetivo obvio:** Planeta desbloqueado brilla invitando a ser el siguiente
- **Sin barreras de re-entrada:** No hay pantallas de "bienvenido de vuelta" o "continuar partida guardada"
- **Flow state debe ser rápido:** Enganchar de nuevo en las primeras 2-3 preguntas
- **Contadores persistentes:** Estrellas totales, planetas completados siguen ahí
- **Post-MVP:** Sistema de racha de días para incentivar retorno frecuente

### Journey Requirements Summary

**Capabilities Reveladas por los Journeys:**

**1. Onboarding & Primera Impresión (Journey 1)**
- Tiempo de carga inicial < 3 segundos (crítico para retención)
- Mapa solar auto-explicativo sin tutorial textual
- Primer planeta brillando/pulsando como call-to-action visual
- Transición inmediata de mapa → juego sin menús intermedios
- Feedback visual instantáneo (< 300ms)

**2. Core Gameplay Loop (Todos los Journeys)**
- Sistema de preguntas con input numérico
- Feedback inmediato: verde grande = correcto, rojo suave = incorrecto
- Preguntas variadas (no predecibles) dentro de cada tabla
- Indicador de progreso en sesión (saber cuántas preguntas quedan)
- Permitir fallar y reintentar sin castigo
- Sesión típica: 15-20 preguntas por planeta

**3. Progresión & Desbloqueo (Journey 1 & 2)**
- Sistema de 3 estrellas: Bronce (70%), Plata (85%), Oro (95%)
- Desbloqueo secuencial de planetas
- Pantalla de celebración al completar planeta
- Animación de desbloqueo para planeta siguiente
- Vuelta automática al mapa para ver logro

**4. Repetición & Mejora (Journey 2)**
- Posibilidad de tocar planeta completado para rejugarlo
- Sistema de mejora de estrellas (Bronce → Plata → Oro)
- Feedback especial "¡MEJORADO!" cuando mejora nivel de estrellas
- Sin límite de intentos para mejorar

**5. Persistencia & Recuperación (Journey 3)**
- Guardado automático en LocalStorage tras cada respuesta
- Estado completo del juego persiste entre sesiones
- Recuperación instantánea al abrir app (sin pantallas de "cargar partida")
- Progreso no se pierde nunca (crítico para confianza)

**6. Dashboard & Visualización (Todos los Journeys)**
- Mapa solar como pantalla principal
- Estados visuales claros: locked (gris), unlocked (color brillante), completed (iluminado + estrellas)
- Contador de estrellas totales siempre visible
- Próximo objetivo obviamente señalado
- Planetas completados muestran nivel de estrellas alcanzado

**7. Manejo de Errores & Edge Cases**
- Respuesta incorrecta → feedback suave + oportunidad de reintentar
- Sin "game over" o penalizaciones
- LocalStorage lleno → manejo graceful (advertencia o limpieza de datos antiguos)
- Sin conexión → funciona offline después de primera carga

## Platform Requirements (Web App)

### Browser Support
- **Target:** Chrome Android (primario)
- **Secundario:** Chrome Desktop, Firefox, Safari iOS (testing básico)
- **No soportado:** IE11, navegadores legacy

### Progressive Web App (PWA)
- Service Worker para caché offline
- manifest.json con metadata de app
- Instalable desde navegador
- Splash screen con tema espacial

### Responsive Design
- **Mobile-first:** 320px - 428px (primario)
- **Tablet:** 640px+ (secundario, mismo layout escalado)
- **Desktop:** No optimizado (funciona pero no es target)

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse PWA Score: > 90

### SEO & Accessibility
- **SEO:** No crítico (app personal, no pública)
- **Accessibility:** WCAG AA en contraste y touch targets (48px+)
- **Semantic HTML:** Para estructura, no para SEO

## Functional Requirements

### FR-1: Sistema de Mapa Solar (Dashboard Principal)

**Descripción:** Pantalla principal que muestra el sistema solar interactivo con 8 planetas representando tablas del 2 al 9.

**Prioridad:** CRÍTICA (MVP v1.0)

**Comportamiento:**
- Al cargar la app, mostrar mapa solar inmediatamente (< 3s)
- 8 planetas dispuestos visualmente en el espacio
- Primer planeta (tabla del 2) desbloqueado y brillando
- Resto de planetas bloqueados (gris/opaco)
- Contador de estrellas totales en esquina superior

**Estados Visuales:**
- **Locked:** Planeta gris, sin brillo, no interactivo
- **Unlocked:** Planeta color brillante, efecto pulse/glow, tap-able
- **Completed:** Planeta iluminado + estrellas flotando (1-3 según nivel)
- **Active:** Planeta con borde destacado cuando está siendo jugado

**Interacciones:**
- Tap en planeta unlocked → Iniciar sesión de juego (FR-2)
- Tap en planeta completed → Rejugar para mejorar estrellas
- Tap en planeta locked → Sin acción (visualmente no parece tap-able)
- Scroll/pinch → No necesario (todo visible en viewport)

**Criterios de Aceptación:**
- ✓ Mapa carga en < 3 segundos
- ✓ Primer planeta visiblemente diferente (desbloqueado)
- ✓ Estados visuales claramente distinguibles
- ✓ Tap en planeta unlocked inicia juego inmediatamente
- ✓ Contador de estrellas actualizado correctamente

---

### FR-2: Sistema de Juego por Planeta (Core Gameplay)

**Descripción:** Sesión de juego donde el niño responde 15-20 preguntas de multiplicación de la tabla correspondiente al planeta.

**Prioridad:** CRÍTICA (MVP v1.0)

**Flujo de Sesión:**
1. Usuario toca planeta en mapa
2. Transición inmediata a pantalla de juego (sin menús)
3. Mostrar pregunta de multiplicación (ej: "2 × 3 = ?")
4. Usuario ingresa respuesta con teclado numérico
5. Feedback inmediato (< 300ms)
6. Si correcta → Celebración + siguiente pregunta
7. Si incorrecta → "¡Inténtalo de nuevo!" + permitir reintentar
8. Repetir hasta 15-20 preguntas
9. Calcular % de aciertos
10. Mostrar pantalla de celebración con estrellas ganadas
11. Volver automáticamente al mapa

**Generación de Preguntas:**
- Todas las multiplicaciones de la tabla (ej: 2×1, 2×2, ... 2×10)
- Orden aleatorio (no predecible)
- Sin repetición en misma sesión
- Exactamente 15-20 preguntas por sesión

**Input de Respuesta:**
- Teclado numérico custom (0-9, Borrar, Enviar)
- Touch targets: 56px × 56px
- Auto-submit cuando ingresa respuesta completa (opcional)
- Botón "Enviar" siempre visible

**Feedback Visual:**
- **Correcto:** Flash verde grande, animación de celebración (estrellas/confeti básico)
- **Incorrecto:** Texto suave "¡Inténtalo de nuevo!", respuesta se borra
- **Transición:** Fade out → siguiente pregunta (300ms)

**Indicador de Progreso:**
- Barra de progreso horizontal: "Pregunta X de 20"
- O círculos pequeños mostrando progreso visual
- Botón "Salir" en esquina (vuelve al mapa, progreso se guarda)

**Criterios de Aceptación:**
- ✓ Transición planeta → juego en < 500ms
- ✓ Preguntas en orden aleatorio
- ✓ Feedback visual en < 300ms tras responder
- ✓ Permitir múltiples intentos por pregunta sin penalización
- ✓ Sesión de 15-20 preguntas exactas
- ✓ Cálculo correcto de % aciertos
- ✓ Vuelta automática al mapa tras completar

---

### FR-3: Sistema de Estrellas y Progresión

**Descripción:** Sistema de recompensas con 3 niveles (Bronce, Plata, Oro) basado en % de aciertos.

**Prioridad:** CRÍTICA (MVP v1.0)

**Niveles de Estrellas:**
- **Bronce (1 estrella):** 70% - 84% aciertos
- **Plata (2 estrellas):** 85% - 94% aciertos
- **Oro (3 estrellas):** 95% - 100% aciertos

**Cálculo:**
```
aciertos_totales = preguntas_correctas / preguntas_totales
if aciertos >= 0.95: estrellas = 3 (Oro)
else if aciertos >= 0.85: estrellas = 2 (Plata)
else if aciertos >= 0.70: estrellas = 1 (Bronce)
else: estrellas = 0 (sin desbloqueo de siguiente planeta)
```

**Desbloqueo de Planetas:**
- Completar planeta con mínimo Bronce (70%) desbloquea siguiente
- No hay penalización por bajo rendimiento
- Puede rejugar inmediatamente para mejorar

**Mejora de Estrellas:**
- Rejugar planeta ya completado reemplaza estrellas anteriores
- Ejemplo: Bronce → rejugar → Oro (reemplaza, no suma)
- Mensaje especial "¡MEJORADO!" cuando mejora nivel

**Pantalla de Celebración:**
- **Primera vez completado:**
  "¡Planeta Conquistado!
  Has ganado [1/2/3] ESTRELLA[S] DE [BRONCE/PLATA/ORO]!"
- **Mejora de estrellas:**
  "¡MEJORADO!
  Ahora tienes [2/3] ESTRELLA[S] DE [PLATA/ORO]!"

**Criterios de Aceptación:**
- ✓ Cálculo correcto de % aciertos
- ✓ Asignación correcta de nivel de estrellas
- ✓ Desbloqueo de siguiente planeta con mín. 70%
- ✓ Mejora de estrellas funciona correctamente
- ✓ Mensaje diferenciado para primera vez vs mejora

---

### FR-4: Persistencia de Progreso (LocalStorage)

**Descripción:** Sistema de guardado automático que persiste todo el progreso del juego en LocalStorage del navegador.

**Prioridad:** CRÍTICA (MVP v1.0)

**Datos a Persistir:**
```json
{
  "gameState": {
    "version": "1.0",
    "lastUpdated": "timestamp",
    "planets": [
      {
        "id": 2,
        "table": 2,
        "status": "completed",
        "stars": 3,
        "bestAccuracy": 98,
        "attemptsCount": 2,
        "lastPlayed": "timestamp"
      },
      // ... planetas 3-9
    ],
    "totalStars": 12,
    "currentPlanet": 5
  }
}
```

**Guardado Automático:**
- Al completar cada sesión de planeta
- Inmediatamente tras calcular estrellas
- Antes de volver al mapa
- Sin confirmación o indicador visible

**Recuperación:**
- Al cargar la app, leer LocalStorage
- Restaurar estado completo del mapa
- Si no existe datos, inicializar juego nuevo
- Sin pantallas de "Continuar partida"

**Manejo de Errores:**
- LocalStorage no disponible → Warning en consola, juego funciona sin guardar
- LocalStorage lleno → Intentar limpiar datos antiguos, si falla mostrar aviso
- Datos corruptos → Resetear a estado inicial, notificar al usuario

**Criterios de Aceptación:**
- ✓ Progreso se guarda automáticamente tras cada sesión
- ✓ Estado se recupera correctamente al reabrir app
- ✓ Manejo graceful de errores de storage
- ✓ Sin pérdida de datos entre sesiones
- ✓ Datos versionados para futuras migraciones

---

### FR-5: Pantallas de Transición y Feedback

**Descripción:** Pantallas intermedias que muestran feedback, celebraciones y transiciones entre estados.

**Prioridad:** ALTA (MVP v1.0)

**Pantalla: Celebración de Planeta Completado**
- Aparece tras completar 15-20 preguntas
- Duración: 2-3 segundos (auto-avanza)
- Contenido:
  - Título: "¡Planeta Conquistado!"
  - Estrellas ganadas (animación)
  - Mensaje según nivel
  - Botón "Continuar" (opcional, auto-avanza)

**Pantalla: Feedback de Respuesta**
- **Correcta:** Flash verde grande (300ms)
- **Incorrecta:** Texto "¡Inténtalo de nuevo!" (permanece hasta reintentar)

**Animación: Desbloqueo de Planeta**
- Cuando vuelve al mapa tras completar planeta
- Planeta siguiente se ilumina con animación (1-2s)
- Efecto de "unlock" visual

**Criterios de Aceptación:**
- ✓ Pantalla de celebración aparece automáticamente
- ✓ Auto-avance después de 2-3 segundos
- ✓ Animaciones fluidas (60fps)
- ✓ Feedback visual claro y distinguible

---

### FR-6: Interfaz de Usuario Móvil

**Descripción:** Componentes de UI optimizados para móvil con touch targets grandes y diseño responsive.

**Prioridad:** CRÍTICA (MVP v1.0)

**Layout Responsive:**
- Mobile-first: 320px - 428px width
- Orientación: Portrait (vertical) primaria
- Landscape: Funciona pero no optimizado

**Touch Targets:**
- Planetas: 72px - 96px diámetro
- Botones: 56px × 56px mínimo
- Teclado numérico: 56px × 56px por tecla
- Spacing entre targets: 8px mínimo

**Tipografía Móvil:**
- Pregunta matemática: 40px bold
- Feedback mensajes: 32px bold
- Contadores: 24px semibold
- Mínimo: 16px

**Paleta de Colores:**
- Background: #0a0e27 (space dark)
- Cards: #1a2332 (space navy)
- Primary: #2563eb (space blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Gold: #fbbf24 (stars)

**Criterios de Aceptación:**
- ✓ Touch targets mínimo 48px
- ✓ Texto mínimo 16px
- ✓ Layout funciona en 320px - 428px
- ✓ Contraste WCAG AA cumplido

---

### FR-7: Lógica de Juego y Reglas

**Descripción:** Reglas de negocio que gobiernan la mecánica del juego.

**Prioridad:** CRÍTICA (MVP v1.0)

**Reglas de Progresión:**
1. Solo primer planeta (tabla del 2) desbloqueado al inicio
2. Completar planeta con ≥70% desbloquea siguiente
3. Planetas se desbloquean secuencialmente (no se puede saltar)
4. No hay límite de intentos por planeta
5. Mejoras de estrellas permitidas sin restricción

**Reglas de Sesión:**
1. Cada sesión = 15-20 preguntas aleatorias de la tabla
2. Múltiples intentos por pregunta permitidos
3. Solo primer intento cuenta para % aciertos
4. Salir a mitad de sesión no guarda progreso parcial

**Reglas de Cálculo:**
1. % aciertos = (preguntas correctas en 1er intento) / total preguntas
2. Estrellas basadas en % final de sesión completa
3. Contador de estrellas totales = suma de estrellas actuales de todos planetas

**Criterios de Aceptación:**
- ✓ Solo tabla del 2 desbloqueada inicialmente
- ✓ Desbloqueo secuencial funciona correctamente
- ✓ Cálculo de % aciertos correcto
- ✓ Mejoras de estrellas funcionan sin bugs

---

## Non-Functional Requirements

### Performance
- **Carga inicial:** < 3 segundos (First Load)
- **Carga recurrente:** < 1 segundo (PWA cached)
- **Feedback respuesta:** < 300ms
- **Animaciones:** 60fps sin drops
- **Bundle size:** < 2MB total

### Reliability
- **Uptime:** N/A (offline-first después de primera carga)
- **Data Loss:** 0% (LocalStorage con manejo de errores)
- **Crash Rate:** < 1% (manejo de errores graceful)

### Usability
- **Onboarding:** 0 segundos (auto-explicativo)
- **Learning Curve:** Inmediato para niño de 8 años
- **Touch Accuracy:** 95%+ (targets grandes, spacing adecuado)

### Compatibility
- **Chrome Android:** 100% funcional (target primario)
- **Chrome Desktop:** 95% funcional
- **Safari iOS:** 90% funcional (testing básico)
- **Offline:** 100% funcional post-primera-carga

### Maintainability
- **Código comentado:** Solo donde lógica es no obvia
- **Estructura modular:** Componentes reutilizables
- **Testing:** Tests unitarios para lógica de juego crítica
