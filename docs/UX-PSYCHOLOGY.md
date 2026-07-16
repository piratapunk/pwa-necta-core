# Abi — Psicología aplicada (research → producto)

> El primer prompt pidió investigar **Endowed Progress Effect** y **"EAS"** para diseñar las
> opciones interactivas del Constructor. Esto es ese research, aterrizado a pantallas concretas.
> Fuente: web (ShiftKognition, Renascence, Userpilot, Patent355, Cognitigence) + tahona
> (`emotional-ux`: *Cognitive Biases in Design*, *IKEA Effect Design*, *Personalization*).

## Nota sobre "EAS"

No existe un efecto UX estándar con esa sigla; con alta probabilidad "EAS" apuntaba a uno de
estos (todos relevantes y aquí cubiertos): **E**ndowment effect / **E**ffort justification /
**E**scalation of commitment. Los tratamos a todos como la **familia del compromiso creciente**
que sostiene la conversión de Abi. Si tenías otra cosa en mente, se ajusta.

## Los efectos que usamos (y dónde)

### 1. Endowed Progress Effect — *arranca ya avanzado*
La gente se esfuerza más y abandona menos cuando percibe **avance regalado** hacia una meta. El
clásico: una tarjeta de 8 sellos que **ya trae 2 marcados** se completa más rápido que una de 6
vacía — misma distancia real, distinta percepción. Palancas: *reference-point shift*, *behavioral
consistency*, *goal-gradient acceleration*. Es **fundacional del onboarding SaaS que convierte
>60%**.
- **En Abi:** el **panal nunca arranca en 0**. Al elegir vertical salta a ~30% ("ya te armé la
  base"). Cada micro-acción llena miel visiblemente; el registro cae al ~80%.

### 2. IKEA Effect — *lo que construyes, lo valoras (y lo quieres conservar)*
El usuario asigna valor desproporcionado a lo que **co-crea**. El esfuerzo (subir contenido,
corregir lo extraído, elegir tono) genera **apego** → el bot deja de ser "una demo" y pasa a ser
"mi bot". tahona (*IKEA Effect Design*): permitir contenido propio + **customización guiada**
(no ilimitada, que abruma) + **resaltar lo que el usuario creó**.
- **En Abi:** la ingesta y la corrección de lo extraído *son* el trabajo que genera apego. El
  panel de prueba **resalta "tu" contenido/tono**. Conservar "mi bot" = convertir a premium.

### 3. Goal-Gradient — *acelera cerca de la meta*
Cuanto más cerca del objetivo, más esfuerzo. Ya validado en el workspace (senda: goal-gradient de
la tarjeta de sellos, "se completa ~33% más rápido con ventaja").
- **En Abi:** al 80% el copy empuja ("casi listo, solo falta…"); el build de 60-90s se vive como
  el último tramo, no como espera.

### 4. Labor Illusion — *ver el esfuerzo sube el valor percibido*
Mostrar el trabajo que ocurre (aunque sea rápido) aumenta la valoración del resultado.
- **En Abi:** el paso "Construyendo tu bot…" narra pasos reales ("leyendo tu menú… afinando el
  tono…"). Teatro **honesto**: son pasos que de verdad ocurren.

### 5. Open-Loop / Zeigarnik + Checklists — *cerrar lo abierto*
El cerebro empuja a cerrar tareas iniciadas. Checklists siguen siendo **la mejor herramienta de
onboarding 2026** justo por esto. Pre-marcar el primer ítem hace sentir "ya empecé".
- **En Abi:** el panal *es* la checklist visual; el primer paso viene "medio hecho".

### 6. Anchoring — *el premium se ve desde el free*
Anclar features premium primero condiciona la percepción de valor (tahona: *Cognitive Biases* →
"anchor premium features first").
- **En Abi:** los objetivos/tweaks premium aparecen **visibles con candado 🔒** durante todo el
  Constructor. No frustran: siembran.

## Mapa efecto → pantalla (resumen operativo)

| Efecto | Dónde vive en el Constructor | Métrica que mueve |
|---|---|---|
| Endowed progress | Panal arranca ~30%, nunca en 0 | Tasa de finalización del wizard |
| IKEA effect | Ingesta + corrección + panel resalta "lo tuyo" | Activación → intención de conservar |
| Goal-gradient | Copy y ritmo del 80% al build | Drop-off en el tramo final |
| Labor illusion | Paso "Construyendo…" (60-90s narrados) | Valor percibido / satisfacción |
| Open-loop / checklist | El panal como checklist visual | Reanudación de sesiones |
| Anchoring | Candados 🔒 de premium visibles | Conversión free→premium |

## Ética (línea que no cruzamos)

tahona es explícito: *"prioriza el beneficio del usuario sobre la manipulación; el mal uso de
sesgos erosiona la confianza."* Reglas de Abi:
- **El avance regalado es real**, no falso: la base del bot para su vertical *existe* de verdad.
- **El bot que prueba es real** y funcional dentro de sus límites — no una maqueta que luego no
  cumple.
- **Sin urgencia falsa** ni escasez inventada. Los candados premium dicen la verdad de qué hay
  detrás.
- La persuasión acelera una decisión que le **conviene** al usuario, no lo engaña a una que no.

## Experimentos (qué mediremos)

1. **Posición del registro** (inicio vs. final vs. progresivo) → activación vs. leads capturados.
2. **Punto de arranque del panal** (20% vs. 30% vs. 40%) → finalización del wizard.
3. **Nº de decisiones de tono** (2 vs. 3 vs. 5) → apego vs. abandono por sobrecarga.
4. **Duración del build** (instantáneo vs. 60-90s narrados) → valor percibido y conversión.

**Fuentes:** [ShiftKognition — Endowed Progress](https://shiftkognition.com/en/chapters/effet-progression-dotee-endowed-progress-ia-psychologie-vente-fondements-progression-dotee)
· [Renascence — Endowed Progress Effect](https://www.renascence.io/behavioral-biases/endowed-progress-effect)
· [Userpilot — Progress Bar Psychology](https://userpilot.com/blog/progress-bar-psychology/)
· [Userpilot — Best Onboarding 2026](https://userpilot.com/blog/best-user-onboarding-experience/)
· [Patent355 — IKEA Effect](https://www.patent355.com/behavioral-design-glossary/ikea-effect)
· [Cognitigence — IKEA Effect in SaaS](https://www.cognitigence.com/blog/ikea-effect-in-saas-building-customer-loyalty)
· tahona: `emotional-ux/cognitive-biases-in-design`, `emotional-ux/ikea-effect-design`,
  `emotional-ux/personalization-technique`.
