# Abi — Roadmap de implementación

> Método (igual que `senda/docs/ROADMAP.md`): cada fila lleva **por qué importa** (evidencia /
> valor) y **qué reusamos** del Agave Bot Suite para acelerar. Esfuerzo: 🟢 bajo · 🟡 medio ·
> 🔴 alto. Fecha de planeación: **2026-07-16**.

## Tesis

El 70% del motor **ya existe y está en producción** (ingress + demo-brain + panel + Zernio +
scaffold). Abi **no reinventa el bot**: le pone una **capa de experiencia self-serve** encima que
convierte "armar un bot" en un embudo product-led. Por eso el roadmap se concentra en lo nuevo y
riesgoso — el **Constructor**, la **ingesta segura** y el **multi-tenant/billing** — no en el
conversacional (que es el moat ya construido).

Dos palancas por fila:
- **Valor** → por qué mueve activación o conversión (ver `UX-PSYCHOLOGY.md`).
- **Reuse** → qué activo del Suite / del workspace nos acelera.

---

## Fase 0 — Fundación (habilita todo lo demás)

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| Scaffold del monorepo (Turbo + Next App Router + PWA) | Base del stack de la casa | Clonar `pwa-bjj-manager` / `pwa-senda-loyalty` casi verbatim (tsconfig, eslint, `packages/*`) | 🟢 |
| Schema `abi` inicial (`tenants`, `users`, `builder_sessions`, `bot_specs`, `kb_sources`, `leads`, `plan_limits`, `provisioning_jobs`) + RLS | El modelo multi-tenant desde el día 1 | Patrón schema-per-project + RLS de senda; `PGRST_DB_SCHEMAS` gotcha documentado | 🟡 |
| Auth + tenants (Supabase Auth) | Registro/propiedad del bot | Patrón auth de bjj/senda | 🟢 |
| Sistema de diseño de Abi (tokens miel/panal, primitivos) | UI consistente y con marca propia | `components/ui/*` de bjj + tokens nuevos de `brand/visual-language.md` | 🟡 |
| Definir el **contrato `bot_spec`** (JSON schema versionado) | Es la frontera Abi↔Suite; todo cuelga de aquí | Deriva de `agave_demo.bots`+`bot_config`+funnel existentes | 🟡 |

## Fase 1 — El Constructor (MVP del corazón)

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| Wizard máquina de estados (pasos 1-5, ver `DEMO-BUILDER-FLOW.md`) | El producto. Sin esto no hay Abi | Lógica nueva; UI del design system | 🔴 |
| **Panal de progreso** (endowed progress: arranca ~30%, nunca 0) | Palanca #1 de finalización del wizard | Concepto propio; SVG animado (patrón "service animations" de web-agave) | 🟡 |
| Selección de vertical → `funnel.template` base | Colapsa decisión a flujo preconstruido | Verticales **ya existen**: hogar (inmobiliaria), fiber (ISP), la-nacional (licorera) | 🟢 |
| Objetivos → señales (checkboxes → interruptores del brain) | El usuario "diseña" activando lo ya cableado | Señales del `demo-brain` (lead/reserva/ticket/media/handoff) ya en producción | 🟡 |
| Tono → `persona.tone` + `overrides` (customización **guiada**, 2-3 opciones) | IKEA effect sin sobrecarga (tahona) | `system_prompt_ref` por plantilla; overrides validados | 🟢 |
| Registro tardío (paso 5) + captura del `lead` | Balancea activación vs. lead | Patrón lead/score del panel CRM | 🟢 |

## Fase 2 — Ingesta segura (docs / texto / voz)

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| Upload + extracción (pdf/docx/img→OCR) → texto plano | Alimenta la personalidad; motor del IKEA effect | Worker sandbox nuevo | 🟡 |
| Entrada por **texto** y por **voz (STT navegador)** | Camino para quien no tiene docs; "captar voz" | Línea de voz ya evaluada en el workspace (STT basta para el Constructor) | 🟡 |
| **Cuarentena + defensa por capas** (normalización, extracción-solo-texto, detección de inyección) | Requisito no negociable (`SECURITY.md`) | tahona 7-capas + `responseSchema` del brain | 🔴 |
| Detección/redacción de **PII** (3 etapas) | Cumplimiento + confianza | tahona *Multi-layer data sanitization* | 🟡 |
| Revisión/corrección de lo extraído por el usuario | Refuerza apego (lo hace suyo) | UI del design system | 🟢 |
| Chunking + embeddings → `kb_chunks` (RAG por bot) | El bot "sabe" del negocio | **RAG del brain reusado tal cual** | 🟢 |

## Fase 3 — Provisioning + panel de prueba (cerrar el "aha")

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| API de provisioning idempotente (Abi → `agave_demo.*`) | Materializa el bot; es el clímax del flujo | **Brecha #1 de `producto-bot-crm.md`** (`/scaffold-zernio-bot`) expuesta como API | 🔴 |
| Paso "Construyendo tu bot…" (build narrado 60-90s) | Labor illusion → sube valor percibido | Estados reales del `provisioning_job` | 🟢 |
| Panel de prueba (chat embebido + QR WhatsApp demo) | El usuario prueba **su** bot | Canal demo Zernio (sandbox) + ingress existente | 🟡 |
| **Tweaks en vivo acotados** (tono/saludo/respuestas/señales) | Autonomía percibida; los tweaks 🔒 siembran premium | Re-provision incremental (overrides) | 🟡 |

## Fase 4 — Planes, billing y conversión

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| `plan_limits` enforced server-side (free) | Free que funciona pero se queda corto a propósito | — | 🟢 |
| Candados 🔒 premium visibles en el Constructor | Anchoring → conversión | — | 🟢 |
| Upgrade free→premium = re-provision (canal propio + capabilities) | El corazón del negocio | Playbook de coexistencia Zernio + scaffold | 🟡 |
| Billing self-serve (pasarela por definir) | Recurrente sin fricción | — | 🟡 |
| Señales → oferta enterprise (junta/lead calificado) | Alto ticket | Panel CRM / notify | 🟢 |

## Fase 5 — Suite ampliado y analítica (post-conversión)

| Feature | Valor | Reuse | Esfuerzo |
|---|---|---|---|
| Desbloqueo de voz / social / campañas / reseñas / ads en premium | Cumple la promesa del suite | **Capabilities de Zernio ya catalogadas** (`resh-zernio/capabilities/*`) + skills `/zernio-*` | 🟡 |
| Analytics del bot + del funnel del Constructor | Optimiza activación y conversión | Panel CRM + `/zernio-analytics-report` | 🟡 |
| **Nuevas "recetas" de vertical** (restaurante, clínica, servicios…) | Cada receta = trabajo una vez, vendible ∞ | Doctrina demo-first + scaffold (brecha #6) | 🟡 |
| Panel multi-tenant con theming por cliente | Marca propia del cliente | Casi dado por env var (brecha #2 del producto) | 🟢 |

---

## Experimentos que corren en paralelo (desde Fase 1)

Del `UX-PSYCHOLOGY.md` — A/B tests que guían decisiones abiertas:
1. Posición del registro (inicio / final / progresivo) → activación vs. leads.
2. Punto de arranque del panal (20/30/40%) → finalización del wizard.
3. Nº de decisiones de tono (2/3/5) → apego vs. abandono.
4. Duración del build (instantáneo / 60-90s narrados) → valor percibido y conversión.

## Riesgos (y mitigación)

| Riesgo | Mitigación |
|---|---|
| Prompt injection vía contenido subido | Arquitectura "usuario = dato, no instrucción" + cuarentena por capas (`SECURITY.md`). No es opcional |
| Dependencia de Zernio (plataforma joven) | El ingress multi-canal ya abstrae el canal (YCloud→Zernio fue solo un branch). El `bot_spec` no cambia |
| Abuso del free (uploads/STT/tokens de anónimos) | Rate limits, cuotas por plan, sandbox de extracción, moderación |
| Sobrecarga del wizard (demasiada "personalización") | Customización **guiada** (tahona): pocas decisiones, alto impacto percibido |
| El "90% preconstruido" se nota | Invertir en que el 10% de overrides + el contenido propio hagan sentir único (IKEA effect) |
| Costo marginal por demo | Ya bajo por diseño (una fila en `agave_demo.bots`+config); vigilar tokens LLM/STT |

## Secuencia recomendada (primer sprint real)

**Fase 0 → contrato `bot_spec` → Fase 1 (wizard + panal) con las 3 verticales que ya existen →
Fase 2 cuarentena → Fase 3 provisioning + prueba.** Es el camino más corto al "aha" con el motor
que ya está en producción. Planes/billing (Fase 4) entran en cuanto el "aha" esté sólido.
