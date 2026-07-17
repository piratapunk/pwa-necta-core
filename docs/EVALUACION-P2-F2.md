# Evaluación con datos: P2 · P3 · P4 · P5 · F1 · F2

> 2026-07-17. Decisiones fundadas en tres fuentes: (a) **los patrones ya en producción de la
> casa** (auditoría de pwa-bjj-manager y pwa-senda-loyalty), (b) **la infraestructura real
> verificada** en contabo-core-01, y (c) **datos de mercado** (pasarelas MX) + prácticas de
> tahona. Cada fase cierra con una decisión recomendada, esfuerzo y orden.

## Los datos base (verificados hoy)

| Dato | Valor | Implicación |
|---|---|---|
| GoTrue (Supabase Auth) self-hosted | `running healthy`, SMTP configurado, email + **Google OAuth ya habilitados**, 65 usuarios reales (bjj/senda) | P2 no necesita infra nueva: el auth de la casa ya opera en producción |
| Patrón auth de la casa | `@supabase/ssr` + schema dedicado + tabla puente `org_users(org_id,user_id,role)` + RLS con helper `current_user_org_ids()` | P2/P3 tienen molde exacto (Senda = base limpia; BJJ = módulos maduros) |
| Stripe en la casa | **BJJ lo tiene completo en producción**: checkout suscripción, webhook con tabla de idempotencia, portal, `PLAN_LIMITS`, columnas de status | F1 es ~80% copia de código probado, no un proyecto desde cero |
| pgvector | v0.8.0 instalado; **5,359 vectores en producción** (tahona) | P4 no requiere infra nueva |
| Pipeline de embeddings | Workflow n8n `demo-kb-embed` en vivo: pending → embed → update, usando **Gemini `embedding-001`** | P4 tiene patrón de ingesta ya operando en el motor |
| Ollama en el VPS | `bge-m3` (multilingüe, bueno en español) y `nomic-embed-text` | Alternativa local de embeddings disponible |
| KBs actuales de tenants | 1 chunk, 271–391 chars c/u (cap actual 20k al contexto) | P4 **no urge**: estamos ~50× debajo del umbral |
| i18n en la casa | BJJ bilingüe ES/EN con next-intl@3 + pathnames localizados; agave con next-intl@4 | P5 tiene dos referencias internas funcionando |
| Stripe MX | 3.6% + $3 MXN por transacción; **OXXO solo pagos únicos (sin suscripciones)**, rango $10–$10,000 MXN | Las suscripciones self-serve son con tarjeta; efectivo = prepago único |
| Competencia pasarelas | Conekta 3.4% + $3 (OXXO/SPEI nativos); Mercado Pago cubre efectivo + QR presencial | Solo cambiaríamos de pasarela si el efectivo recurrente fuera el caso dominante |

---

## P2 — Registro / claim de cuenta ⭐ (la fase que desbloquea todo)

**Decisión recomendada: Supabase Auth self-hosted (GoTrue), magic-link-first + Google OAuth, con el patrón Senda como base.**

Por qué, con datos:
- El stack ya existe, está sano y tiene 65 usuarios reales — cero infra nueva, cero proveedor nuevo.
- Google OAuth **ya está habilitado** en GoTrue (solo falta sumar el redirect de nectacore.com).
- Magic-link-first es coherente con la marca ("sin fricción, sin jerga"): el Constructor ya
  pide "déjame dónde te lo mando" — ese email ES el registro. BJJ ya resolvió los emails
  branded (service-role `generateLink` + Resend) para no usar los correos genéricos de GoTrue.
- Tahona/JWT: validar `exp/iss/aud` — y la casa ya se tropezó con eso (gotcha documentado en
  bjj: si `iss` ≠ URL pública, supabase-js descarta la sesión en silencio). Heredamos la solución.

**El claim** (diseño): `abi.tenant_users(tenant_id, user_id, role)` — tabla puente idéntica al
patrón `org_users` de Senda (FK real a `auth.users` sí es válida ahí). Flujo: al terminar el
Constructor, Abi pide el email → magic link → callback crea el vínculo
`builder_session → tenant → user` (función contrato `abi.claim_tenant(session, user_id)`,
SECURITY DEFINER, idempotente — mismo estilo del factory). Sesiones anónimas siguen igual.

**Checklist heredado de la casa (gotchas ya pagados por bjj/senda):**
añadir `abi` a `PGRST_DB_SCHEMAS` + restart rest/kong · alinear `SITE_URL`/redirect allowlist
de GoTrue con nectacore.com · helper `getAppOrigin()` (x-forwarded-host) porque
`request.url` miente detrás de Traefik · GRANTs explícitos por tabla · `getClaims()` en
middleware, `getUser()` solo en gates fuertes.

**Esfuerzo:** 3–5 días. **Riesgo:** bajo (todo el camino está pisado). **Orden:** primera.

## P3 — Panel del dueño

**Decisión recomendada: route group `(panel)` dentro del mismo app Next, con gates estilo BJJ
y escrituras SOLO vía funciones contrato.**

- Molde directo: `(admin)/layout.tsx` de BJJ (`getServerDataContext` memoizado + rol +
  suscripción) — probado en producción con multi-rol.
- Coherencia con el factory: el panel NO toca los schemas `t_*` directamente desde el cliente.
  Se agregan contratos: `abi.update_tenant_persona(slug, cambios acotados)`,
  `abi.tenant_conversations(slug, page)`, `abi.tenant_leads(slug)` — SECURITY DEFINER que
  verifican `tenant_users` antes de leer/escribir. Cero SQL dinámico nuevo, cero exposición
  de los schemas de tenants a PostgREST.
- Alcance v1 (mapea a PRICING free): editar saludo/tono/respuestas (los `overrides` acotados
  del spec), ver conversaciones y leads, botón "probar mi bot". Analytics después.

**Esfuerzo:** 4–6 días. **Depende de:** P2. **Orden:** tercera (tras F1, porque el panel sin
upgrade CTA pierde su mejor momento de conversión).

## P4 — pgvector / RAG para KBs grandes

**Decisión recomendada: disparador determinista + embeddings Gemini `embedding-001` +
tabla vector en el schema del tenant, reusando el patrón `demo-kb-embed`. NO es urgente.**

- Dato duro: las KBs reales hoy miden 271–391 chars; el corte a RAG se justifica arriba de
  ~15k chars o >1 documento. Estamos ~50× debajo. Implementar cuando el Constructor acepte
  documentos (P1-resto), no antes.
- Embeddings — evaluación honesta de las dos opciones disponibles:
  - **Gemini `embedding-001`** ✅: es lo que el motor YA usa en producción (`demo-kb-embed`,
    RAG de web-agave). Mismo proveedor del brain, latencia baja, sin carga al VPS. Costo
    marginal ínfimo a estas escalas.
  - **Ollama `bge-m3` local**: gratis y privado, pero corre en CPU del VPS (6 vCPU
    compartidos) y agrega un camino nuevo no probado. La regla del workspace "Ollama =
    embeddings only" describe el rol permitido de Ollama, no una obligación — la práctica
    real de la plataforma es Gemini. Queda como plan B si el costo/privacidad lo pidiera.
- Reglas de tahona aplicadas: chunks de párrafo ~800–1,200 chars con overlap; **mismo modelo
  en ingesta y consulta**; umbral de score (~0.6) al recuperar; híbrido BM25+vector solo si
  la relevancia lo pide (no de inicio).
- Diseño coherente con el factory: `provision_tenant` ya crea `kb_chunks` por tenant — se le
  agrega columna `embedding vector(3072)` + índice HNSW cuando el tenant cruce el umbral, y
  un contrato `abi.tenant_kb_search(slug, query_embedding, k)` para el brain. La ingesta la
  dispara el mismo pipeline de cuarentena.

**Esfuerzo:** 2–3 días cuando toque. **Depende de:** ingesta de documentos (P1-resto). **Orden:** con P1-resto.

## P5 — Espejo `/en`

**Decisión recomendada: next-intl v4 con el patrón de agave/bjj — pero DESPUÉS de P2/F1.**

- Dos referencias internas funcionando (bjj v3 con pathnames localizados; agave v4 con
  `localePrefix: as-needed` — español en raíz, `/en` prefijado: exactamente lo que queremos).
- Costo real: el copy vive en los componentes de sección (decisión deliberada de la v1);
  extraerlo a `messages/{es,en}.json` es lo grueso del trabajo. El proxy de subdominios debe
  componerse con el middleware de intl (los `/t/[slug]` NO se localizan — el idioma del bot
  del tenant es del negocio, ya viaja en el spec).
- Dato de negocio: el mercado inicial (Expo, PyMEs MX) es 100% español. `/en` no mueve la
  aguja de conversión ahora; es deuda de marca ("bilingüe first-class") que conviene pagar
  cuando haya tracción.

**Esfuerzo:** 2–3 días (mayormente copy nativo, no traducción). **Orden:** última junto con P3+.

## F1 — Facturación premium

**Decisión recomendada: Stripe Billing, tarjeta-first, reusando el módulo completo de BJJ; el
efectivo (OXXO/SPEI) entra como "prepago" de N meses en una fase 2.**

Con datos:
- **Reuso**: BJJ tiene en producción exactamente lo que F1 necesita — `stripe-config.ts`
  (mapeo plan→price, límites, idempotencia de checkout), 3 rutas (checkout/webhook/portal),
  tabla `stripe_webhook_events` (idempotencia), columnas de estado de suscripción y el gate
  `requireActiveSubscription`. Adaptarlo a `abi.tenants` es traducción, no diseño. El vault
  ya tiene `stripe.env`.
- **Mercado**: Stripe 3.6%+$3 vs Conekta 3.4%+$3 — la diferencia (0.2 pts) no paga el costo
  de abandonar un módulo probado + los gotchas ya resueltos (webhook al apex porque Stripe
  no sigue redirects, firma, idempotencia). Mercado Pago solo ganaría si el caso dominante
  fuera efectivo recurrente/QR presencial — no es nuestro modelo (SaaS online).
- **La restricción que define el diseño**: OXXO en Stripe es **solo pago único** (sin
  suscripciones, $10–$10k MXN). Para la PyME sin tarjeta la respuesta correcta no es cambiar
  de pasarela sino ofrecer **prepago**: invoice único de 3/6/12 meses vía OXXO/SPEI que un
  webhook convierte en `premium` con `premium_until`. Es además mejor caja (cobro adelantado).
- Coherencia de marca: "precios con números reales, nunca inventados" — los precios se
  definen al configurar los Price IDs, no antes.

**Esfuerzo:** 4–6 días (fase tarjeta; prepago +2–3). **Depende de:** P2. **Orden:** segunda.

## F2 — `upgrade_tenant`

**Decisión recomendada: función contrato SECURITY DEFINER gemela de `provision_tenant`,
disparada por el webhook de Stripe. Diseño cerrado, implementación trivial tras F1.**

- `abi.upgrade_tenant(tenant_id, plan)`: valida plan ∈ {free, premium, enterprise}, actualiza
  `abi.tenants.plan` y reescribe `capabilities`/`limits` en el `bot_config` del schema del
  tenant **desde una tabla `abi.plan_limits`** (nueva, fuente única de qué da cada plan —
  hoy los límites free están inline en `provision_tenant`; F2 los normaliza). Registra
  `factory_jobs(kind='upgrade')` (ampliar el CHECK del enum). Idempotente por diseño.
- Trigger: webhook `checkout.session.completed` / `subscription.updated` con
  `metadata.tenant_id` → llama al contrato. Downgrade en `subscription.deleted` → vuelve a
  límites free (el bot NUNCA se borra — coherente con "free que funciona de verdad").
- Cero UI propia: vive dentro del webhook de F1 + un CTA en el panel (P3).

**Esfuerzo:** 1–2 días. **Depende de:** F1. **Orden:** inmediatamente tras F1.

---

## El plan en una línea de tiempo

```
P2 auth+claim (3-5d) ──► F1 Stripe tarjeta (4-6d) ──► F2 upgrade (1-2d) ──► P3 panel (4-6d)
                                                                                │
P1-resto (docs+voz al Constructor) ──► P4 pgvector (2-3d, por umbral) ─────────┤
                                                                                ▼
                                                              P5 /en (2-3d) + F1 fase prepago
```

**Total estimado del bloque núcleo (P2→F1→F2→P3): ~3 semanas de trabajo efectivo**, con la
mayor parte del riesgo ya absorbido por bjj/senda (auth, Stripe, RLS, gotchas self-hosted).

## Qué NO hacer (decisiones descartadas, con razón)

- **Auth propio / proveedor externo (Clerk, Auth0)**: infra nueva + costo recurrente + datos
  fuera de casa, contra un GoTrue sano con 65 usuarios y todos los gotchas resueltos. No.
- **Cambiar a Conekta/MP por el 0.2%**: tira un módulo probado por un ahorro marginal. No.
- **pgvector "por si acaso" ya**: 391 chars de KB no necesitan vectores; sería complejidad
  sin usuario. Umbral primero. No.
- **Agente LLM para decidir el corte a RAG**: es un `if` (ya documentado en
  `STRANDS-EVALUATION.md`). No.
- **`/en` antes de tracción**: cero demanda medible hoy; el Expo es MX. Después. No.
