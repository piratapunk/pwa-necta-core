# Abi — Arquitectura técnica

> Abi = una **capa product-led** (web + Constructor + panel de prueba) montada sobre el
> **Agave Bot Suite** que ya está en producción. La regla de oro: **reusar el motor, construir
> solo lo nuevo.** Lo nuevo es el Constructor y su multi-tenancy self-serve.

## 1. Vista de 10,000 pies

```
┌──────────────────────────────────────────────────────────────────────┐
│  ABI (nuevo, este repo)                                                │
│                                                                        │
│  apps/web (Next.js App Router, PWA)                                    │
│   ├── Home + chat central (demo viva de la tecnología)                 │
│   ├── El Constructor  ← wizard de co-creación (el corazón)             │
│   ├── Panel de prueba  ← el bot recién creado, con tweaks en vivo      │
│   └── Auth + billing (free/premium/enterprise)                         │
│                                                                        │
│  supabase schema `abi`  ← tenants, sesiones del constructor, leads,    │
│                            bot_specs generados, límites de plan        │
└───────────────┬────────────────────────────────────────────────────────┘
                │  "materializa" un bot_spec  →
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  AGAVE BOT SUITE (reuse, ya en producción)                             │
│                                                                        │
│  ingress edge (CF Worker + Durable Object)  ← ACK<1s, dedup, firma     │
│        │                                                               │
│        ▼                                                               │
│  demo-brain (n8n, 48 nodos)  ← persona LLM, responseSchema, RAG,       │
│        │                        señales→acciones (media/tickets/leads) │
│        ▼                                                               │
│  agave_demo.*  (bots · bot_config · kb_chunks · funnel · assets)       │
│        │                                                               │
│        ▼                                                               │
│  canal Zernio  ← WhatsApp / social / voz / ads                         │
│                                                                        │
│  panel CRM (Next standalone)  ← leads, conversaciones, tickets         │
└──────────────────────────────────────────────────────────────────────┘
```

**Frontera clara:** Abi produce un **`bot_spec`** (contrato declarativo) y lo entrega al Suite
vía un endpoint interno de "provisioning". El Suite no sabe nada de planes ni de UX; Abi no sabe
nada de nodos de n8n. El `bot_spec` es el contrato entre ambos mundos.

## 2. El `bot_spec` (contrato entre Abi y el motor)

Salida del Constructor, entrada del provisioning. Declarativo, versionado, auditable:

```jsonc
{
  "spec_version": "1",
  "tenant_id": "abi_tenant_...",
  "vertical": "restaurante",              // selecciona el flujo preconstruido base
  "persona": {
    "name": "El asistente de La Nona",
    "tone": ["cercano", "rapido"],        // deriva del research + elecciones del wizard
    "system_prompt_ref": "tmpl.restaurante.v3",   // NUNCA prompt crudo del usuario (ver SECURITY)
    "overrides": { "saludo": "…", "horario": "…" } // campos acotados y validados
  },
  "knowledge": {
    "sources": [                          // lo que subió/dijo el usuario, YA sanitizado
      { "id": "kb_...", "type": "menu", "status": "quarantined→approved" }
    ]
  },
  "funnel": { "template": "reservas", "signals": ["lead", "reserva", "handoff"] },
  "capabilities": ["chat"],               // free = chat; premium desbloquea voz/social/…
  "limits": { "plan": "free", "msgs_day": 50, "kb_mb": 5 }
}
```

Puntos clave:
- **`system_prompt_ref` apunta a una plantilla nuestra**, no al texto del usuario. Las palabras
  del usuario entran como **datos** (overrides acotados + KB), nunca como instrucciones del
  sistema. Es la línea que evita prompt-injection (ver [`SECURITY.md`](SECURITY.md)).
- **`vertical` + `funnel.template`** seleccionan un flujo **90% preconstruido**. El wizard solo
  ajusta el 10% (los `overrides`). El usuario *percibe* que lo hizo de cero.
- `capabilities` y `limits` los pone el **plan**, no el usuario.

## 3. El Constructor: decisión → flujo preconstruido

El wizard es una **máquina de estados** que va llenando el `bot_spec`. Cada paso es una
decisión de *negocio* (no técnica) que colapsa a una rama ya construida:

```
elige vertical ──▶ carga contenido ──▶ elige objetivos ──▶ ajusta tono ──▶ registro ──▶ build ──▶ prueba
   (mapea a         (docs/texto/voz     (checkboxes que      (2-3          (lead)      (anim.    (panel +
   template base)    → KB sanitizada)    activan señales)     opciones)                 60-90s)   tweaks)
```

- **Cada combinación de decisiones = una ruta pre-resuelta** en el `demo-brain` (persona +
  señales + funnel + assets tipo). No generamos flujos nuevos en caliente; **seleccionamos y
  parametrizamos** uno existente. Las verticales inmobiliaria/ISP/licorera **ya existen** como
  demos (ver `producto-bot-crm.md` §4, brecha #6: "recetas").
- El árbol completo (verticales × objetivos × tono) y su mapeo a plantillas vive en
  [`DEMO-BUILDER-FLOW.md`](DEMO-BUILDER-FLOW.md).

## 4. Ingesta de contenido (docs / texto / voz)

Tres entradas, un mismo destino (KB sanitizada). Pipeline:

```
[archivo | texto | voz]
   │
   ▼  extracción
   ├─ docs  → texto plano (pdf/docx/img→OCR); se descartan macros/scripts/objetos activos
   ├─ texto → tal cual
   └─ voz   → STT (transcripción)                    ← "captar voz con periféricos"
   │
   ▼  CUARENTENA + sanitización (SECURITY.md, defensa por capas)
   │   normaliza Unicode · quita instrucciones embebidas · marca como DATO no-instrucción ·
   │   detecta/redacta PII · clasifica (menú/FAQ/servicios/…)
   │
   ▼  chunking + embeddings → kb_chunks (RAG por bot)   [reuse del brain]
   │
   ▼  (opcional) el usuario revisa/edita lo extraído  ← refuerza IKEA effect (lo "corrige", lo hace suyo)
```

- **Camino sin documentos:** si el cliente no tiene archivos, **escribe o dicta** cómo quiere
  su bot; el mismo pipeline aplica (texto/STT → cuarentena → KB/overrides).
- La voz reusa la línea de voz ya evaluada en el workspace (Vapi/WhatsApp Calling para el bot en
  producción; para el *Constructor* basta STT del navegador para captar la descripción).

## 5. Multi-tenancy y modelo de datos (`abi.*`)

Schema `abi` self-contained (patrón schema-per-project). Tablas núcleo:

| Tabla | Rol |
|---|---|
| `tenants` | La cuenta del cliente (dueño del bot). Plan, dominio, branding propio. |
| `users` | Auth (Supabase Auth). Un tenant, N usuarios. |
| `builder_sessions` | Una sesión del Constructor: estado del wizard, decisiones, progreso (para reanudar y para analítica del funnel). Puede existir **antes** del registro (sesión anónima → se asocia al registrarse). |
| `bot_specs` | El `bot_spec` generado (versionado). Estado: `draft → building → live`. |
| `kb_sources` | Contenido subido/dicho: original, estado de cuarentena, versión sanitizada, clasificación. |
| `leads` | Datos de registro + señales del negocio (para nuestro CRM y para el upsell). |
| `plan_limits` | Límites por plan (mensajes/día, MB de KB, capabilities). Enforced server-side. |
| `provisioning_jobs` | El puente al Suite: estado de materialización del bot (idempotente). |

- **RLS** por `tenant_id` en todo. Sesión anónima del constructor = token opaco (patrón
  `public_token`/gate ya usado en senda/panel).
- **Sin FK cruzadas** a `agave_demo.*`: el puente es el `provisioning_job` + el `bot_id` que
  devuelve el Suite (referencia lógica, no FK física). Mantiene los schemas desacoplados.

## 6. Provisioning (Abi → Suite)

Endpoint interno idempotente (`ABI_PROVISION_*` en el vault). Al terminar el Constructor:

1. Valida el `bot_spec` (schema + límites del plan + estado de cuarentena = `approved`).
2. Inserta/upsert en `agave_demo.bots` + `bot_config` + `kb_chunks` + `funnel` (una "receta").
3. Registra webhook/canal demo (Zernio sandbox para free; canal propio en premium).
4. Devuelve `bot_id` + endpoint de prueba → Abi muestra el **panel de prueba**.
5. Idempotente por `builder_session_id` (reintentos no duplican). Patrón `provisioning_jobs`.

Esto es exactamente la **brecha #1 de `producto-bot-crm.md`** (`/scaffold-zernio-bot`
automatizado) expuesta como **API self-serve**. Abi es la UI de ese scaffold.

## 7. El panel de prueba + tweaks en vivo

Tras el build, el usuario prueba su bot (chat embebido y/o QR a WhatsApp demo) y puede ajustar
**parámetros acotados** (tono, saludo, un par de respuestas, activar/desactivar una señal). Cada
tweak = un `overrides` nuevo → re-provision incremental (barato). Los tweaks "peligrosos"
(prompt crudo, integraciones reales, canal propio) están **detrás del paywall** → gancho natural
a premium.

## 8. Stack y despliegue

- **Front/app:** Next.js App Router (PWA), Turbo monorepo — clon de `pwa-bjj-manager`/`senda`.
- **DB:** Supabase self-hosted, schema `abi`. Exponer en `PGRST_DB_SCHEMAS` (gotcha conocido de senda).
- **LLM:** Gemini `gemini-piratapunk` (razonamiento) + Ollama (embeddings) — vía el brain.
- **Deploy:** Coolify (auto-deploy off para rebuilds pesados, ADR 005). DNS: dominio propio de Abi.
- **Secrets:** `ABI_<SCOPE>_<NAME>` en el vault.

## 9. Qué reusamos vs. qué construimos

| Reuse (ya en producción) | Construir (nuevo en Abi) |
|---|---|
| ingress edge multi-canal | La web + chat central |
| demo-brain (personas, RAG, señales) | El **Constructor** (wizard + máquina de estados) |
| panel CRM | El pipeline de **ingesta + cuarentena** de contenido |
| canal Zernio (WA/social/voz/ads) | El **`bot_spec`** + API de provisioning self-serve |
| plantillas de vertical (recetas) | Multi-tenancy self-serve + billing por plan |
| scaffold `/scaffold-zernio-bot` | Panel de prueba + tweaks acotados |

> **Consecuencia estratégica:** el 70% del motor de Abi ya existe. El repo se concentra en la
> capa de experiencia (Constructor + psicología) y la seguridad de la ingesta — que es
> justamente donde está el valor percibido y el riesgo. Ver [`ROADMAP.md`](ROADMAP.md).
