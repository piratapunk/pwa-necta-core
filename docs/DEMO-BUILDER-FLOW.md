# Abi — El Constructor (flujo self-serve)

> El corazón del producto. Un flujo corto de "personalización" donde el usuario **siente que
> arma su bot desde cero**, mientras por detrás cada decisión selecciona un flujo **90%
> preconstruido**. Diseñado alrededor de dos efectos: **endowed progress** (arranca ya
> avanzado) e **IKEA effect** (lo construye → lo valora → lo quiere conservar). Ver
> [`UX-PSYCHOLOGY.md`](UX-PSYCHOLOGY.md).

## Principio rector

**Cada pantalla pide una decisión de *negocio*, nunca una técnica.** El usuario elige "quiero
que agende citas", no "añade un nodo de webhook". La complejidad vive en el backend; la sensación
de autoría vive en el frente. La "personalización" es real en lo que el usuario percibe (tono,
contenido, objetivos) y preconstruida en lo que no ve (el flujo, las señales, la arquitectura).

## La barra de progreso (endowed progress, hecho panal 🐝)

- El progreso se representa como un **panal que se llena de miel**: cada paso completa celdas.
- **Arranca con celdas ya llenas.** En cuanto el usuario elige su vertical, el panal salta a
  ~30% ("ya te armé la base para tu giro"). Nunca empieza en 0. → *reference-point shift*.
- Cada micro-acción del usuario (subir un archivo, marcar un objetivo) **avanza visiblemente** la
  miel → *goal-gradient acceleration* cerca del final.
- El registro (paso de datos) cae cuando el panal está ~80% → el usuario ya no quiere abandonar
  algo casi terminado (*open-loop / consistency*).

## Los pasos

### Paso 0 — Entrada (dos caminos hacia el mismo lugar)
- **Chat central**: el visitante pregunta; al mostrar interés, el propio chat ofrece "¿lo armamos
  para tu negocio?" → entra al Constructor.
- **CTA "Prueba una demo"**: entra directo.

> Sesión **anónima** desde aquí (token opaco). El registro viene más adelante — a propósito
> (ver "¿registro al inicio o al final?").

### Paso 1 — "¿A qué se dedica tu negocio?" (selección de vertical)
- Opciones interactivas grandes (restaurante, clínica/consultorio, inmobiliaria, tienda/ecommerce,
  servicios, ISP/telecom, otro). Detección asistida: si escribió algo en el chat, se pre-selecciona.
- **Efecto:** al elegir, el panal salta a ~30% y aparece un mensaje de Abi: *"Listo, ya te armé
  la base para [vertical]. Ahora la hacemos tuya."* → endowment.
- **Backend:** fija `bot_spec.vertical` → selecciona el `funnel.template` y el `system_prompt_ref` base.

### Paso 2 — "Dale su conocimiento" (ingesta de contenido)
Tres modos, el usuario elige el que tenga a la mano:
- **Subir archivos** (menú, catálogo, FAQ, folleto, precios) → extracción + **cuarentena**
  (SECURITY.md) → KB.
- **Escribir** ("cuéntame de tu negocio y qué quieres que haga el bot").
- **Dictar por voz** (STT del navegador) — mismo destino.
- Aquí también va un **mini-formulario de descubrimiento** entretejido (no como "form" seco):
  *¿cuál es el problema #1 que quieres resolver? ¿por dónde te escriben hoy? ¿qué te preguntan
  siempre?* → alimenta el `bot_spec` **y** nos da inteligencia comercial (para el upsell).
- **IKEA effect:** tras extraer, se le muestra lo entendido y puede **corregir/completar**
  ("esto es tu menú, ¿le movemos algo?"). Corregirlo = apropiárselo.

### Paso 3 — "¿Qué quieres que haga?" (objetivos → señales)
- Checkboxes de resultados de negocio, filtrados por vertical:
  *responder dudas · agendar/reservar · tomar pedidos · capturar prospectos · pasar a un humano ·
  enviar catálogo/fichas · cobrar/enlazar pago (premium)…*
- **Cada objetivo activa una señal** ya cableada en el brain (`lead`, `reserva`, `ticket`,
  `media`, `handoff`). El usuario cree que "diseña capacidades"; en realidad **enciende
  interruptores** sobre un flujo existente.
- Los objetivos "premium" aparecen visibles pero con candado 🔒 → siembran el upsell (anchoring).

### Paso 4 — "Dale su personalidad" (tono)
- 2-3 elecciones de tono máximo (cercano/formal, breve/explicativo, con emojis/sobrio). Menos es
  más: demasiada personalización abruma (tahona: *IKEA Effect Design* → "guided customization").
- Vista previa **en vivo**: un mensajito de ejemplo cambia al elegir tono → gratificación inmediata.
- **Backend:** rellena `persona.tone` + `overrides.saludo`. **Nunca** deja al usuario escribir el
  system prompt crudo (SECURITY.md).

### Paso 5 — Registro (captura del lead)
- Cuando el panal está ~80%: *"Tu bot está casi listo. Déjame dónde te lo mando y lo terminamos
  de construir."* → nombre, negocio, WhatsApp/email.
- El usuario ya invirtió esfuerzo → alta disposición a completar (consistency + sunk cost).
- La sesión anónima se **asocia** al nuevo tenant. Se crea el `lead`.

### Paso 6 — "Construyendo tu bot…" (el build, 60-90s de teatro honesto)
- Animación de Abi "armando la colmena": pasos reales narrados (*"leyendo tu menú… afinando el
  tono… conectando WhatsApp de prueba…"*). El tiempo de provisioning se convierte en **prueba de
  esfuerzo percibido** (labor illusion) → sube el valor.
- **Backend:** valida `bot_spec` → `provisioning_job` → materializa en el Suite (ARCHITECTURE §6).

### Paso 7 — "¡Conócelo!" (panel de prueba + tweaks)
- El usuario **prueba su bot** (chat embebido + QR a WhatsApp demo).
- Puede ajustar **parámetros acotados** en vivo (tono, saludo, respuestas, on/off de una señal).
- Los tweaks avanzados (integraciones reales, canal propio, voz, campañas) muestran candado 🔒 →
  **"Esto ya es parte de Premium"** → conversión.

## El árbol de decisiones → flujos preconstruidos

La matriz `vertical × objetivos × tono` **no genera** flujos: **selecciona y parametriza** rutas
ya construidas en el `demo-brain`. Ejemplo (recorte):

| Vertical | Template base (funnel) | Señales típicas | Assets tipo | Estado |
|---|---|---|---|---|
| Restaurante | `reservas` / `pedidos` | reserva, lead, media(menú), handoff | menú, horarios | receta nueva |
| Inmobiliaria | `captacion-propiedades` | lead, ficha(media), handoff, cita | fichas, fotos | **ya existe** (hogar) |
| ISP / Telecom | `soporte-altas` | ticket, lead, handoff | planes, cobertura | **ya existe** (fiber) |
| Licorera / tienda | `catalogo-venta` | media(catálogo), lead, pedido | catálogo, precios | **ya existe** (la-nacional) |
| Clínica/consultorio | `agenda-citas` | cita, lead, recordatorio, handoff | servicios, horarios | receta nueva |
| Servicios (genérico) | `captacion-generica` | lead, handoff, media | servicios | receta nueva |

- Tres verticales **ya están construidas** como demos en producción (hogar, fiber, la-nacional).
  Las nuevas se documentan como **"recetas"** (prompt + funnel + señales + assets tipo) — brecha
  #6 de `producto-bot-crm.md`. Cada receta nueva = trabajo una vez, vendible infinitas veces.
- El wizard solo escribe los `overrides` (el 10%). El 90% (arquitectura del flujo) es fijo.

## Reglas de diseño del flujo (no negociables)

1. **Corto.** ≤ 7 pasos, cada uno respondible en segundos. Cada paso extra cuesta activación.
2. **Nunca en cero.** El panal siempre arranca con avance regalado.
3. **Valor visible en cada paso**, no solo al final (preview en vivo del tono, de lo extraído).
4. **El registro cae tarde** (paso 5), cuando ya hay esfuerzo invertido — salvo que pruebas
   A/B digan lo contrario (ver abajo).
5. **Decisiones de negocio, no técnicas.** Si una pantalla suena a software, está mal diseñada.
6. **Seguridad invisible pero presente:** la cuarentena de contenido nunca frena la sensación de
   fluidez, pero siempre corre (SECURITY.md).

## ¿Registro al inicio o al final? (decisión de producto)

Tensión real: registrar **al final** maximiza activación (el usuario prueba antes de dar datos)
pero pierde leads de los que abandonan; registrar **al inicio** captura más leads pero baja la
activación. **Propuesta v1:** registro **al final (paso 5)** con **captura progresiva** — pedir
solo lo mínimo, y **guardar la sesión anónima** para poder re-emailear si dejó correo en el chat.
**A/B testear** posición del registro es el primer experimento del roadmap. La decisión "afecta
lo que hacemos más adelante" — por eso se deja explícita y medible, no fija por corazonada.
