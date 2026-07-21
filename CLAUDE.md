# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**Abi** — a product-led, self-serve builder of business assistant bots (free → premium →
enterprise). The demo *is* the product *is* the sales funnel: a prospect "builds" their own bot
in a guided wizard (the **Constructor**), while every decision actually maps to a 90%
pre-built flow on the Agave Bot Suite platform.

**Current state: landing live at nectacore.com.** The repo now contains the Next.js 16 app
(Tailwind v4 + shadcn, Spanish-only) for the NectaCore corporate landing: Abi promoted as the
product, central chat wired `/api/chat` → n8n `necta-web-chat` → Gemini, persistence in the
`abi` schema, deployed as Coolify app `necta-core-web`. Brand systems: `brand/` (Abi, the
product/mascot) and `brand/nectacore/` (NectaCore, the corporate umbrella). **The agentic
factory is also live** (`docs/FACTORY-ARCHITECTURE.md`): intake LLM → `bot_spec` contract →
`abi.provision_tenant` (real per-tenant schema `t_<slug>` + own DB role + encrypted creds) →
instant `<slug>.nectacore.com` subdomain (CF wildcard + Traefik dynamic config + `src/proxy.ts`
rewrite); channels between app and n8n are HMAC-signed (`x-abi-signature`), verified in
Postgres. The Constructor UI wizard is still to build; `docs/` remain the spec — keep them
consistent with each other (they cross-reference heavily).

## Non-negotiable invariants

- **Brand independence**: Abi is an independent brand. Nothing public-facing (UI, copy, docs
  meant for users) may reveal the engine is the Agave Bot Suite / Zernio. See `brand/identity.md`.
- **User content is DATA, never INSTRUCTION**: users never write or edit system prompts.
  `system_prompt_ref` always points to our per-vertical template; user input enters only as
  sanitized RAG KB + bounded, validated `overrides`. All uploaded/dictated content passes
  quarantine (`uploaded → quarantined → sanitized → approved | rejected`) before it can be
  materialized. This is the prompt-injection defense line — architectural, not a filter.
  Full layered defense in `docs/SECURITY.md`.
- **`capabilities` and `limits` come from the plan, never the user**, enforced server-side.
- Workspace conventions (from the parent `piratapunk/CLAUDE.md`): schema-per-project Supabase
  (`abi` schema, nothing in `public`, no cross-schema FKs — the bridge to `agave_demo.*` is a
  logical `bot_id` reference via `provisioning_jobs`, never a physical FK); secrets
  `ABI_<SCOPE>_<NAME>` in the vault; Coolify deploys; one-line commits, no trailers.

## Architecture (the big picture)

Abi is a thin **experience layer** on top of the already-in-production Agave Bot Suite. The
golden rule: **reuse the engine, build only what's new** (~70% of the engine already exists).

```
ABI (this repo, new)                      AGAVE BOT SUITE (reuse, in production)
apps/web — Next.js App Router PWA         ingress edge (CF Worker + Durable Object)
  home + central chat                     demo-brain (n8n: LLM persona, RAG, signals)
  the Constructor (wizard)        ──bot_spec──▶  agave_demo.* (bots, config, kb, funnel)
  test panel + bounded live tweaks        Zernio channel (WhatsApp/social/voice/ads)
supabase schema `abi`                     CRM panel (standalone Next)
```

- **The `bot_spec` is the contract** between the two worlds (declarative, versioned JSON —
  spec in `docs/ARCHITECTURE.md` §2). The Suite knows nothing about plans/UX; Abi knows
  nothing about n8n nodes. Everything hangs off this contract — define/change it carefully.
- **The Constructor** (`docs/DEMO-BUILDER-FLOW.md`) is a state machine that fills the
  `bot_spec`: vertical → content ingestion (docs/text/voice STT) → objectives → tone →
  late registration → build → test panel. Each decision *selects and parameterizes* an
  existing pre-built flow; nothing is generated hot.
- **Provisioning** (Abi → Suite) is an idempotent internal API keyed by
  `builder_session_id`: validates the spec (plan limits + quarantine `approved`), upserts
  into `agave_demo.*`, returns `bot_id`.
- **Core `abi.*` tables**: `tenants`, `users`, `builder_sessions` (anonymous-first, claimed at
  registration), `bot_specs`, `kb_sources`, `leads`, `plan_limits`, `provisioning_jobs`.
  RLS by `tenant_id` everywhere; anonymous sessions use opaque tokens.
- **UX psychology is load-bearing, not decoration**: endowed progress (the honeycomb progress
  bar starts ~30%), IKEA effect (guided customization, user reviews/edits extracted content),
  labor illusion (narrated 60–90s build). `docs/UX-PSYCHOLOGY.md` maps each to a screen;
  open questions are A/B experiments listed in `docs/ROADMAP.md`.

## When code starts

Planned stack is the house PWA template: Turborepo + Next.js App Router + self-hosted
Supabase + Coolify, cloned from `pwa-bjj-manager` / `pwa-senda-loyalty` (the
`/scaffold-pwa-saas` skill replicates it). Known gotcha to carry over: expose the `abi`
schema in `PGRST_DB_SCHEMAS`. LLM via the brain: Gemini `gemini-piratapunk` for reasoning,
Ollama for embeddings only. Implementation order is in `docs/ROADMAP.md` (Fase 0 → `bot_spec`
contract → wizard → quarantine → provisioning).

**Auth (branded magic link).** Identity is the shared house GoTrue; its email templates carry
another brand's name, so Abi mails its **own** Resend email (`src/lib/auth/magic-link.ts`). Load
link is admin `generate_link` → link to `/entrar/confirmar` → **POST** verify on mount (beats
email prefetchers). Gotcha that broke a real prospect: GoTrue keeps **one token per type per
user**, so every `generate_link` invalidates the link in previously-sent emails — a resend makes
older emails read *"expired"* instantly. Fixed by caching+re-sending the same link per email
(`src/lib/auth/link-cache.ts`, evicted on verify). Do **not** "fix" this by shortening/altering
token expiry — `GOTRUE_MAILER_OTP_EXP` defaults to 24h and was never the problem.

## Doc map

| File | Content |
|---|---|
| `docs/VISION.md` | Product on one page: what, for whom, the "aha", business model |
| `docs/ARCHITECTURE.md` | Constructor, `bot_spec` contract, data model, Suite reuse |
| `docs/DEMO-BUILDER-FLOW.md` | The wizard step-by-step + decision→flow tree (the heart) |
| `docs/SECURITY.md` | Ingestion rails: 7-layer anti-injection, PII, quarantine, abuse limits |
| `docs/UX-PSYCHOLOGY.md` | Psychology mechanics mapped to each screen |
| `docs/PRICING-TIERS.md` | Free/Premium/Enterprise and conversion mechanics |
| `docs/ROADMAP.md` | Phased implementation with reuse + effort per row |
| `brand/` | Brand system: identity, personality, voice/copy, visual language (bee/honeycomb) |

Docs and brand content are written in Spanish — keep new/edited content in Spanish to match.

## Aislamiento de Auth/BD (ADR 007) — LEER antes de tocar auth o Supabase
- **Estado: abi es el PILOTO (P2)** de la migración de aislamiento. Hoy corre sobre el Supabase **compartido** (`supabase.piratapunk.com`), esquema `abi`, con el pool `auth.users`/GoTrue compartido con todos los proyectos.
- **Plan:** abi obtiene su **instancia Supabase dedicada** (su propio `auth.users`/BD/llaves) en un **VPS de producción nuevo** (`contabo-prod-01`). Es el piloto que valida el pipeline antes de migrar bjj. Está casi vacío (3 tenants, 3 `tenant_users`) → migración trivial, pero se hace la copia de auth completa igual.
- **Env que se repunta** en el cutover (Coolify): `ABI_SUPABASE_URL` → `https://db-abi.piratapunk.com`, `ABI_SUPABASE_ANON_KEY`, `ABI_SUPABASE_SERVICE_ROLE_KEY`, `ABI_DATABASE_URL`, `ABI_DB_PASSWORD`. Conjunto de usuarios a migrar = `abi.tenant_users.user_id ∪ abi.feature_requests.user_id`. Reusar el mismo Google client id por instancia (para que `sub` siga válido).
- Estándar de la flota: `vps-contabo-core/docs/decisions/007-supabase-instance-per-production-project.md`
- Plan de migración: `vps-contabo-core/docs/plans/2026-07-supabase-prod-isolation-migration.md`
