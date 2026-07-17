# Pendientes — seguimiento

> Backlog operativo de nectacore.com. Se actualiza al cerrar o descubrir pendientes.
> Contexto: `FACTORY-ARCHITECTURE.md`, `CAPACITY-EXPO.md`, `ROADMAP.md`.
> Última revisión: 2026-07-17 (segunda pasada — cerrados S1, S2, S4, S5, O3, O4, P6 y parte de P1).

## ✅ Cerrados en esta pasada

| # | Qué | Cómo quedó |
|---|---|---|
| S1 | Turnstile | Widget CF `nectacore-constructor` (managed). Gate en `/api/constructor` (primer mensaje por sesión) y `/api/factory/provision`. CSP actualizada. Verificado en navegador real. |
| S2 | Rotación de `factory_hmac` | Runbook `vps-contabo-core/scripts/rotate-necta-hmac.sh` (DB → vault → Coolify → redeploys). **Ejecutado una vez con éxito** — la rotación real está probada. |
| S4 | Tope de tenants | Candado server-side `abi.factory_daily_cap_reached()` (50 bots nuevos/día) dentro de `provision_tenant` + Turnstile como gate humano. |
| S5 | Cuotas de mensajes por tenant | `tenant_chat_context` corta al llegar a `msgs_day` del plan; el bot responde el límite con gracia. Verificado en vivo (Patitas lo disparó tras las pruebas de carga). |
| O3 | Backup Supabase | **Ya existía y corre**: `/opt/backup-supabase.sh`, cron diario 10:15 UTC → R2, retención 14 días, incluye schemas de tenants (pg_dumpall). La advertencia del workspace CLAUDE.md estaba desactualizada — corregida. |
| O4 | DR workflows n8n | Export corrido (46 workflows, incluye los 3 necta). El script del repo estaba roto (heredoc frágil) — reparado con jq. |
| P6 | Tuning de voz | Regla anti-rellenos endurecida con ejemplos en: `behavior.ts` (chat central), prompt del Constructor (Strands) y prompt del tenant-chat (n8n). Verificado: respuestas entran directo. |
| P1 (parcial) | Constructor | El Constructor **conversacional ya opera en producción** con panal de progreso animado (endowed progress: arranca en 2/6, avanza por etapa real del agente: conversando → borrador → construido). |

## 🔴 Nuevo — atención

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| N1 | **Rotar `N8N_API_KEY`** | La llave quedó expuesta en un trace de debug local (sesión Claude 2026-07-17). Rotación manual: n8n UI → Settings → API → borrar y crear; actualizar `secrets/n8n.env` y `~/mcp-env/n8n.env` del VPS (mcp-n8n). | **Alta** |

## Seguridad / endurecimiento

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| S3 | CF Full **strict** para `*.nectacore.com` | Requiere Origin CA Key de Cloudflare (no está en el vault; el API token no basta para emitir origin certs). Generar Origin Cert wildcard manualmente en el dash CF → instalarlo en Traefik → subir zona a Full (strict). | Media |

## Producto (fases mayores — decisiones evaluadas con datos en [`EVALUACION-P2-F2.md`](EVALUACION-P2-F2.md))

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| P1 (resto) | Constructor: ingesta de documentos + voz | Subir menú/catálogo (pipeline de cuarentena de `SECURITY.md`) y dictado STT. El agente Strands ya es la base; falta la tool `ingerir_documento` + UI de upload. | Alta |
| P2 | Registro/claim de cuenta | **✅ Implementado y probado E2E** (2026-07-17): GoTrue + magic link brandeado (`generate_link` + callback propio, sin tocar config compartida) + `abi.tenant_users`/`claim_tenant`/`user_tenants` + página `/mis-bots` + captura de email post-provisión en el Constructor. `abi.plan_limits` creada como fuente única (incluye límites de archivos con doble candado anti-compresión; RAG jamás en free). | — |
| P2-mail | Correo saliente | **✅ Resuelto (2026-07-17)**: dominio nectacore.com agregado a la cuenta Resend del dueño (vía su sesión, Manual setup — sin darle OAuth a Resend sobre CF), registros DKIM/SPF/MX/DMARC creados por API en Cloudflare, dominio verificado, envío real probado desde `hola@nectacore.com`, y el flujo de magic links quedó vivo en producción. Pendiente solo (b) Google OAuth: `GOTRUE_URI_ALLOW_LIST` + Google Console. | (b) más adelante |
| P-mailrouting | **Email Routing para TODOS los dominios de proyectos** | El dueño quiere dejar de crear buzones en iCloud por proyecto: configurar **Cloudflare Email Routing** (gratis) en cada zona (nectacore.com, y los demás dominios de marca que administre) reenviando `hola@`/`contacto@` → su inbox personal. Es 100% automatizable por API (habilitar routing en la zona + reglas + verificar destino). Hacer una pasada por todas las zonas CF cuando lo pida. | Más adelante |
| P-WA | Onboarding WhatsApp self-serve | Diseño completo en [`WHATSAPP-ONBOARDING.md`](WHATSAPP-ONBOARDING.md): 0 toques vía portal — `POST /v1/profiles` + Embedded Signup por redirect + webhooks. La tarjeta de WhatsApp ya existe en `/panel/[slug]/conexiones` (candado Premium); se activa con F1. | Con F1 |
| P3 | Panel del dueño | **✅ v1 en producción (2026-07-17)**, homologado al dashboard del canal: Resumen (métricas reales), Conversaciones (historial real), Archivos (skeleton con límites del plan), Conexiones (chat web conectado + WhatsApp candado Premium + próximamente), **Funciones a la medida (funcional → `abi.feature_requests`)**, Mi plan (límites de `plan_limits` + CTA esperando F1). Ownership vía `abi.user_owns_tenant` en cada contrato. Falta: edición de persona (saludo/tono), marcada "muy pronto". | — |
| P4 | pgvector / RAG para KBs grandes | Umbral determinista (~15k chars o >1 doc) → chunking + embeddings Ollama + pgvector en el schema del tenant. No es agente (ver `STRANDS-EVALUATION.md` §2C). | Media |
| P5 | Espejo `/en` | Copy nativo en inglés. | Baja |

## Operación

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| O1 | Monitores Uptime Kuma | **Manual (2 min)** — no hay API/credenciales automatizables (el MCP vps-ops solo lee y le falta config). En Kuma agregar 4 monitores HTTP: `https://nectacore.com`, `https://nectacore.com/constructor`, `https://taqueria-la-nona.nectacore.com`, `https://necta-constructor.piratapunk.com/healthz` + notificación. | Alta (pre-Expo) |
| O2 | Tenants demo | `taqueria-la-nona`, `estetica-bella-luna`, `patitas-felices` — se conservan como demos para la Expo. Borrar después con drop schema/role + delete en `abi.tenants`. | Baja |

## Facturación (cuando P2 exista)

| # | Pendiente | Detalle |
|---|---|---|
| F1 | Pasarela self-serve premium | Stripe (stack de la casa). Precios con números reales. |
| F2 | `upgrade_tenant` | Re-provision con más capabilities al subir de plan. |

## Checklist Expo (de `CAPACITY-EXPO.md`)

- [ ] Congelar deploys en horario del evento
- [ ] Pausar crons pesados (content-factory)
- [ ] O1 (monitores Kuma) hecho
- [ ] Verificar tier/cuota del key Gemini
- [ ] Ensayo completo la víspera + hotspot de respaldo
