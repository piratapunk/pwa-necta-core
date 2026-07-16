# Visual Language

> Cómo se ve Abi. Los **valores autoritativos** (hex/oklch, tipografías) vivirán en
> `src/design-system/tokens.css` cuando exista el código; aquí va la **intención de diseño** y
> las decisiones de marca. No dupliques valores finales aquí: referéncialos.

## Concepto

Cálida, con energía, un poco juguetona pero **pulida**. Lo opuesto al azul-frío de "IA seria".
Dos protagonistas visuales: **la miel** (color) y **el panal** (forma). Y una **mascota** con
carácter.

## Color (dirección, valores finales en tokens)

- **Miel / Ámbar** — el acento primario (dorado cálido). Fills, CTAs, la "miel" que llena el panal.
- **Negro / carbón** — fondo dominante (dark-first). Hace brillar el ámbar; se siente premium, no infantil.
- **Crema / hueso** — texto y superficies claras (variante light de primera clase).
- **Acentos de apoyo** — un par de tonos para estados: verde-miel (éxito), ámbar-quemado (alerta),
  quizás un morado/índigo tenue para lo "premium/enterprise" (contraste noble contra el dorado).
- **Regla:** dark-first con variante light real. **Nunca** hardcodear hex de fg/bg — todo por
  tokens para que light/dark funcionen (aprendizaje de web-agave: fue fuente de bugs).

> Nota: el par **ámbar + negro** es también el color natural de la abeja — refuerza la mascota
> sin esfuerzo. Cuidar el contraste (AA) del amarillo sobre claro: usar un ámbar más profundo
> para texto/íconos.

## El panal (el motivo de forma)

El **hexágono** es el ladrillo del sistema visual — y no es decorativo, **significa**:
- **Textura de marca:** patrón sutil de panal en fondos/secciones.
- **Grid de UI:** tarjetas/celdas con lógica hexagonal donde tenga sentido.
- **Los módulos:** cada "bloque de flujo" que el usuario arma se ve como una celda de panal.
- ⭐ **La barra de progreso del Constructor = un panal que se llena de miel.** Es la pieza
  visual estrella: une la mascota, el motivo de forma y el *endowed progress effect* en una sola
  imagen. Arranca con celdas ya llenas (nunca vacío). Ver `docs/DEMO-BUILDER-FLOW.md` y
  `docs/UX-PSYCHOLOGY.md`.

## La mascota — Abi 🐝

El activo de marca más importante. Abi **es** un personaje, no un ícono estático.

### Diseño
- Una **abejita** simpática y **competente** (no bebé, no boba): redondeada, expresiva, con
  antenitas, alas suaves. Legible a 24px (favicon/sticker) y con presencia a tamaño grande.
- Paleta natural (ámbar + negro) → coincide con la marca sin esfuerzo.
- Estilo: limpio, moderno, con calidez. Evitar 3D genérico de stock; buscar un trazo con carácter
  propio y reconocible.

### Expresividad (necesita un set, no un dibujo)
Abi aparece en muchos momentos → necesita **poses/estados**:
- saludando (bienvenida), trabajando/martillando (build), celebrando (paso completado),
  pensando (procesando), señalando (tips), con candado (premium), durmiendo (límite/inactiva),
  con lupa (revisar contenido).
- **Loaders**: Abi "armando la colmena" durante el build (labor illusion).
- **Stickers de WhatsApp**: set descargable = marketing orgánico (la abeja circula sola).

### Reglas
- La mascota **ayuda**, no estorba: en el Constructor guía; en tareas serias (billing, error,
  seguridad) se hace pequeña. (Coherente con el "termómetro" de `personality.md`.)
- Consistencia total de estilo entre poses. Un solo Abi, muchas actitudes.
- Respeta `prefers-reduced-motion`: las animaciones de Abi degradan a estático.

## Logo

- **Wordmark `abi`** en minúsculas (se lee marca/producto, no nombre de persona), con la mascota
  o un hexágono-miel integrado (p. ej. el punto de una letra como celda de panal, o la mascota
  posada en la palabra).
- Versión con mascota + versión wordmark solo (para espacios chicos).
- Siempre legible en dark y light.

## Tipografía (dirección)

- **Display/headings:** una sans con **calidez y carácter** (redondeada de bordes, no geométrica
  fría), peso 600-800, tracking apretado. Debe sentirse amable pero seria.
- **Texto:** una sans muy legible, neutra, para lecturas largas y UI.
- Valores finales y familias concretas → en el design system cuando exista el código.

## Movimiento

- **Juguetón pero pulido.** Micro-animaciones en cada avance del Constructor (miel que sube,
  Abi que reacciona). Gratificación inmediata en cada paso (ver UX §valor visible por paso).
- SVG + CSS server-rendered donde se pueda (patrón "service animations" de web-agave: geometría
  determinista, cero riesgo de hidratación, coloreado por tokens, reduced-motion guard).

## Layout (heredado de la casa)

- Mobile-first (el producto se muestra en web, iPad y móvil — requisito del brief). Tap targets
  cómodos; tamaños que bajan en móvil y suben en `sm:`.
- Secciones centradas, eyebrow (label corto en mayúsculas) → heading → subhead de una línea.
- Tailwind para layout/espaciado/color/tipo; `style` inline solo para valores computados.

## Checklist de marca visual (para cuando se construya)

- [ ] Tokens de color (miel/ámbar/negro/crema) en `tokens.css`, dark+light, contraste AA.
- [ ] Motivo hexagonal como textura + grid.
- [ ] **Panal-de-progreso** animado (la pieza estrella), arranca no-vacío.
- [ ] Mascota Abi: set de poses/estados + loader del build + stickers de WhatsApp.
- [ ] Logo wordmark `abi` + versión con mascota, ambos dark/light.
- [ ] Todas las animaciones con reduced-motion guard.
- [ ] Nada en la UI revela Agave/Zernio.
