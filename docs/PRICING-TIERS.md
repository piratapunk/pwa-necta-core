# Abi — Planes y conversión

> Tres planes. El **free** es el gancho (entrega valor real y captura el lead). El **premium**
> es donde ganamos (recurrente, self-serve). El **enterprise** es alto ticket con toque humano.
> El diseño del Constructor siembra el upsell desde el minuto uno (candados 🔒 visibles).

## Los planes

### 🐝 Free — "Arma y prueba tu bot"
El acceso a todo el Constructor y a un **bot funcional acotado**.
- 1 bot, canal **demo** (WhatsApp sandbox / chat embebido). No es su número de producción.
- Capability: **chat** (texto). RAG con su contenido (límite de MB).
- Límites de uso: mensajes/día, KB en MB (`plan_limits`).
- Tweaks acotados en el panel de prueba (tono, saludo, respuestas, on/off de señales básicas).
- **Objetivo del plan:** que el usuario viva el "aha" y se apropie del bot (IKEA effect). No es
  un trial que caduca: es un free que **funciona pero se queda corto a propósito**.

### ⭐ Premium — "Ponlo a trabajar de verdad" (el corazón del negocio)
El bot pasa a **producción** y se abre el suite. Self-serve, suscripción mensual.
- **Canal propio** del cliente (su número WhatsApp vía Zernio; coexistencia o número nuevo).
- Más **capabilities**: voz, social (IG/FB/TikTok), campañas/broadcasts, reseñas, ads CTWA.
- Más límites (mensajes, KB, bots), personalización mayor, branding propio en el panel.
- Analytics del bot + CRM (leads, conversaciones, tickets).
- **Gancho natural:** todo lo que en el Constructor tenía 🔒 se desbloquea aquí.

### 🏢 Enterprise — "Lo hacemos contigo" (alto ticket, alto toque)
Todo lo de premium + operación y humano en el loop.
- **Junta con nosotros**, onboarding guiado, **llamadas y seguimiento**, SLA.
- **Integraciones reales** a sus sistemas (CRM/ERP/pagos: Kommo/Odoo/tickets/pasarelas) — el
  paso demo→prod completo de la doctrina del Suite.
- Prompt/flujos a la medida (fuera del 90% preconstruido), verticales dedicadas.
- **Abi es el pipeline; el cierre lo hace un humano.** El bot enterprise se arma a mano sobre el
  mismo motor.

## Tabla comparativa

| | Free 🐝 | Premium ⭐ | Enterprise 🏢 |
|---|---|---|---|
| Constructor completo | ✅ | ✅ | ✅ |
| Bot funcional | ✅ (demo) | ✅ (producción) | ✅ (a la medida) |
| Canal | Sandbox | Número propio | Números/IVR/voz |
| Capabilities | Chat | Chat+voz+social+campañas+reseñas+ads | Todo + integraciones |
| Personalización | Acotada | Amplia | A la medida |
| Panel CRM / analytics | — | ✅ | ✅ + reportes |
| Integraciones (CRM/ERP/pagos) | — | — | ✅ |
| Soporte | Self-serve | Self-serve + | Junta + llamadas + SLA |
| Modelo | Gratis | Mensual recurrente | Setup + mensualidad alta |

> Precios en cifras: **por definir con datos** (costo de infra compartida + tokens LLM +
> passthrough Meta/Zernio sin markup + soporte). El modelo de Zernio (cuenta del cliente) evita
> revender su billing. **No inventar cifras** — se cotizan con números reales (regla del workspace).

## Límites técnicos por plan (fuente única: `abi.plan_limits`, enforced server-side)

| | Free 🐝 | Premium ⭐ | Enterprise 🏢 |
|---|---|---|---|
| Mensajes / día | 50 | 1,000 | 10,000 |
| KB en contexto (chars) | 20,000 | 200,000 | 1,000,000 |
| Archivos subibles | 1 | 10 | 50 |
| Tamaño por archivo (crudo) | 2 MB | 10 MB | 25 MB |
| Texto extraído máx. (chars) | 20,000 | 200,000 | 1,000,000 |
| RAG / embeddings (pgvector) | ❌ nunca | ✅ | ✅ |

Reglas de diseño de estos límites:
- **El free se queda en lo lite a propósito**: su KB completa cabe en el contexto del modelo
  (20k chars) — jamás genera embeddings ni toca pgvector. Vectorizar cuesta cómputo y abre
  superficie; es valor de pago.
- **Doble candado anti-compresión**: se limita el archivo CRUDO (MB subidos) **y** el texto
  EXTRAÍDO (chars). Un zip/docx/pdf pequeño puede expandirse a mucho texto (bomba de
  descompresión) — el segundo límite corta la extracción aunque el archivo haya pasado el
  primero. Ambos se validan server-side durante la cuarentena (`SECURITY.md`).
- Cambiar un límite = un UPDATE a `abi.plan_limits`, no un deploy.

## La mecánica de conversión (cómo el free jala a premium)

1. **Anchoring temprano:** en el Constructor, objetivos y tweaks premium se ven con 🔒. El usuario
   sabe que hay más *antes* de terminar.
2. **Apego (IKEA):** al terminar tiene "su" bot funcionando. Quererlo conservar/soltarlo a
   producción = premium.
3. **Fricción honesta del free:** el free funciona pero en sandbox y solo chat. "Conéctalo a mi
   WhatsApp real" es el primer deseo natural → premium.
4. **Momento del deseo = momento del paywall:** los candados aparecen justo cuando el usuario
   quiere esa capacidad (no antes, no como banner molesto).
5. **Enterprise por señales:** volumen, industria, o pedir integración real → dispara oferta de
   **junta** (lead calificado a ventas).

## Aterrizaje técnico

- `plan_limits` (schema `abi`) define límites por plan; **enforced server-side** en el
  provisioning y en runtime (nunca confiar en el cliente).
- Subir de plan = re-provision con más `capabilities` + canal propio (ARCHITECTURE §6). Barato.
- Billing: self-serve para premium (por definir pasarela); enterprise por contrato.
