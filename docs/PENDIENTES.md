# Pendientes — seguimiento

> Backlog operativo de nectacore.com. Se actualiza al cerrar o descubrir pendientes.
> Contexto de cada uno: `FACTORY-ARCHITECTURE.md` §8, `ROADMAP.md` (fases de producto).
> Última revisión: 2026-07-17.

## Seguridad / endurecimiento

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| S1 | Turnstile en `/api/factory/provision` (y `/intake`) | Hoy solo rate limit 3/h por IP + honeypot. Un bot distribuido puede fabricar tenants basura. Cloudflare Turnstile es gratis y ya hay skill (`cloudflare:turnstile-spin`). | Alta |
| S2 | Rotación programada de `factory_hmac` | La tabla `abi.factory_secrets` ya registra `rotated_at`. Falta el runbook/cron: generar nuevo, ventana de doble validez, actualizar Coolify env. | Media |
| S3 | CF Full **strict** para `*.nectacore.com` | Hoy el origen sirve el cert default de Traefik bajo modo Full. Instalar un Cloudflare Origin Cert wildcard en Traefik y subir la zona a Full (strict). | Media |
| S4 | Límite de tenants por sesión/contacto | La idempotencia evita duplicados por sesión, pero nada impide N sesiones nuevas. Ligar provisioning a registro (ver P2) o a verificación de contacto. | Media |
| S5 | Cuotas de mensajes por tenant enforced en runtime | `limits` (msgs_day) ya viven en `bot_config`, pero el brain aún no los aplica. Contador en el schema del tenant + corte amable. | Alta |

## Producto

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| P1 | **Constructor UI** (el wizard con panal de progreso) | La maquinaria (intake → spec → provision) ya está en producción; falta la experiencia: pasos, endowed progress, labor illusion del build. Spec: `DEMO-BUILDER-FLOW.md`. Al arrancar: spike de Strands Agents para el loop conversacional (`STRANDS-EVALUATION.md` §4). | Alta |
| P2 | Registro/claim de cuenta | `builder_sessions` anónimas → claim al registrar (email/WhatsApp). Prerrequisito de billing y del panel. | Alta |
| P3 | Panel del dueño | Tweaks en vivo (tono, saludo, respuestas), ver conversaciones/leads de SU schema. | Media |
| P4 | pgvector / RAG real para KBs grandes | Hoy la KB entra completa al contexto (cap 20k chars). Cuando el corpus lo amerite: chunking + embeddings (Ollama, regla de la casa) + pgvector en el schema del tenant. Umbral sugerido: KB > ~15k chars o >1 doc. La decisión es un umbral determinista, NO un agente (`STRANDS-EVALUATION.md` §2C). | Media |
| P5 | Espejo `/en` | La marca es bilingüe; el sitio hoy es es-only. Copy nativo, no traducción literal. | Baja |
| P6 | Tuning de la persona Abi | Gemini a veces suelta rellenos prohibidos ("¡Claro!", "¡Excelente!"). Pasada a `src/lib/chat/behavior.ts` + prompt del brain con ejemplos negativos. | Baja |

## Operación

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| O1 | Monitor Uptime Kuma para nectacore.com y un subdominio de tenant | No hay monitoreo del sitio ni del wildcard. | Alta |
| O2 | Borrar tenants demo | `taqueria-la-nona` y `estetica-bella-luna` son datos de prueba (drop schema + drop role + delete en `abi.tenants`). Se conservan hoy como demos vivas. | Baja |
| O3 | Backup: recordar que Supabase NO está en el backup nocturno R2 | Los schemas `t_*` son datos de clientes. Incluir en la estrategia de backup antes de tener clientes reales de pago. | Alta (antes de GA) |
| O4 | DR de workflows n8n del factory | Export periódico (`n8n-export-all-workflows.sh`) ya cubre; verificar que corre desde que existen `necta-*`. | Baja |

## Facturación (fase premium)

| # | Pendiente | Detalle | Prioridad |
|---|---|---|---|
| F1 | Pasarela self-serve premium | Por definir (Stripe está en el stack de la casa). Precios: con números reales, nunca inventados. | Cuando P1/P2 |
| F2 | Upgrade de plan = re-provision con más capabilities | `provision_tenant` ya separa capabilities/limits por plan; falta la función `upgrade_tenant`. | Cuando F1 |
