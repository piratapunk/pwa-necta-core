# Abi — Visión de producto (una página)

## Qué es

Abi es una **web product-led** (optimizada para desktop, iPad y móvil) con dos superficies:

1. **Un chat central** — como el de `web-agave-systems`: el visitante puede preguntar y
   entender qué es Abi conversando (la propia home *es* una demo de la tecnología).
2. **Un CTA "Prueba una demo"** que lanza el **Constructor**: un flujo corto donde el usuario
   **crea su propio bot** y termina probándolo en vivo.

El Constructor es el verdadero valor. No es un formulario: es una experiencia de co-creación
donde el usuario siente que diseña su asistente desde cero, mientras por detrás cada elección
selecciona un **flujo preconstruido** de nuestra plataforma.

## El "aha" (el momento que vendemos)

> *"Le hablé, le subí mi menú, elegí un par de cosas… y en dos minutos ya tenía un bot que
> contesta como mi negocio. Y encima puedo cambiarlo."*

Ese momento — ver **tu** bot vivo, con **tu** tono y **tu** contenido, respondiendo — es el
producto. Todo lo demás (planes, upsell, operación) cuelga de ahí.

## Para quién

- **Dueño/operador de PyME no técnico** (restaurante, clínica, inmobiliaria, ISP, tienda,
  servicios). Siente el dolor (mensajes sin responder, se le van clientes, contesta lo mismo
  100 veces) pero no sabe qué es un "chatbot con IA" ni quiere aprender. → Abi le habla al dolor.
- **Marketer / agencia chica** que quiere montar asistentes para varios clientes sin código.
- Secundario: **el curioso** que llega top-of-funnel y vago ("¿esto me sirve?") — el chat y el
  Constructor lo aterrizan a un caso de uso concreto de su industria.

## El modelo de negocio (por qué existe)

Tres planes; el gratis es el gancho, el premium es donde ganamos, el enterprise es donde
entramos nosotros de la mano:

| Plan | Qué es | Rol |
|---|---|---|
| **Free** | El acceso a esto: construir y probar **un** bot acotado (canal demo, límites de uso). | Gancho / captura de lead. El valor real que engancha (IKEA effect). |
| **Premium** | El bot pasa a **producción** con canal propio + más capabilities del suite (voz, social, campañas, reseñas, ads), más personalización y más límites. Self-serve. | **El corazón del negocio.** Suscripción recurrente. |
| **Enterprise** | Todo lo anterior + **junta con nosotros**, integraciones a sus sistemas (CRM/ERP/pagos), llamadas y seguimiento, SLA. | Alto ticket, alto toque. Lo cierra un humano; Abi es el pipeline. |

Detalle en [`PRICING-TIERS.md`](PRICING-TIERS.md).

## Qué lo hace defendible

- **El motor ya existe y está en producción** (Agave Bot Suite: ingress + demo-brain + panel +
  Zernio). Abi no construye un bot desde cero por prospecto: **instancia** uno preconstruido.
  Costo marginal de cada demo ≈ una fila en `agave_demo.bots` + `bot_config`.
- **La psicología es el moat de conversión.** El endowed progress + IKEA effect no son
  "features": son la razón por la que el free convierte a premium. Ver [`UX-PSYCHOLOGY.md`](UX-PSYCHOLOGY.md).
- **La seguridad es requisito, no opción.** Aceptamos contenido del usuario (docs, texto, voz)
  para armar la personalidad — con rieles anti prompt-injection por capas. Ver [`SECURITY.md`](SECURITY.md).

## Qué NO es

- No es un builder visual de flujos tipo ManyChat/zernflow (esos exponen la complejidad; Abi la
  **esconde**: el usuario toma decisiones de *negocio*, no arrastra nodos).
- No revela la marca Agave/Zernio en su superficie pública.
- No es una consultoría — es un producto self-serve. El toque humano vive **solo** en enterprise.

## Norte estrella (métrica)

**% de sesiones del Constructor que llegan a "bot probado en vivo"** (activación), y de ahí
**% que convierte free→premium**. Todo el diseño optimiza esos dos números.
