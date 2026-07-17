# Abi 🐝

**Constructor self-serve de asistentes de negocio.** Abi es un producto product-led (marca
propia, independiente de Agave) donde un prospecto **arma su propio bot en minutos** — sube
sus documentos o lo describe por texto/voz, y en un flujo guiado de "personalización" siente
que lo construye desde cero. Por detrás, cada decisión mapea a un flujo **90% preconstruido**
en nuestra plataforma. Al final captura el lead, "construye" el bot en vivo, lo prueba en la
UI y — si quiere más — **paga** (free → premium → enterprise).

> El demo *es* el producto y *es* el embudo de venta. Free entrega valor real (un bot
> funcional acotado); premium y enterprise abren el resto del suite (voz, social, campañas,
> reseñas, ads, integraciones) y la operación. La psicología (endowed progress + IKEA effect)
> es el motor de conversión, no un adorno.

Motor por detrás (nuestro, no del cliente): el **Agave Bot Suite** — ingress edge (CF Worker +
Durable Object) → demo-brain (n8n) → panel CRM → canal Zernio. Ver `resh-zernio/producto-bot-crm.md`.

---

## Estado

🟢 **Landing en producción** — [nectacore.com](https://nectacore.com): la web corporativa de
**NectaCore** (la marca-empresa; ver `brand/nectacore/`) promociona a Abi como su producto
estrella, con el chat central conectado al brain (n8n `necta-web-chat` → Gemini) y persistencia
en el schema `abi`. El Constructor (wizard) es la siguiente fase — ver `docs/ROADMAP.md`.

**Stack actual**: Next.js 16 App Router + Tailwind v4 (tokens oklch, dark-first) + shadcn/ui,
Docker standalone en Coolify (app `necta-core-web`). Rutas API: `/api/chat` (proxy con
guardrails → webhook n8n) y `/api/lead` (rol `abi_app` → `abi.leads`). Env runtime:
`ABI_DATABASE_URL`, `ABI_CHAT_N8N_WEBHOOK_URL`, `NEXT_PUBLIC_SITE_URL`, `SITE_URL`
(vault: `secrets/necta.env`). Español-only por ahora; el espejo `/en` queda para después.

## Arquitectura (resumen)

Mismo stack de la casa que `pwa-bjj-manager` / `pwa-senda-loyalty`, más el motor de bots:

```
apps/web            Next.js (App Router) — la web de Abi + el Constructor (wizard) + panel de prueba
packages/*          db (schema abi) · domain · config  (patrón Turbo de la casa)
supabase/           schema `abi` self-hosted (tenants, sesiones del constructor, leads, bots generados)
edge (reuse)        CF Worker ingress del Agave Bot Suite (multi-canal, ya en producción)
brain (reuse)       demo-brain n8n parametrizado (personas LLM, contrato estructurado, RAG, señales)
canal (reuse)       Zernio API (WhatsApp + social + voz + ads)
```

**La pieza nueva de Abi** = el **Constructor** (`docs/DEMO-BUILDER-FLOW.md`): el wizard que
convierte decisiones del usuario + su contenido (docs/texto/voz) en un `bot_spec`, lo pasa por
los **rieles de seguridad** (`docs/SECURITY.md`) y lo materializa como un bot real del Suite —
una fila en `agave_demo.bots` + `bot_config` + KB + funnel. El resto (canal, brain, panel) ya existe.

## Índice de documentación

| Doc | Qué contiene |
|---|---|
| [`docs/VISION.md`](docs/VISION.md) | El producto en una página: qué es, para quién, el "aha", el modelo de negocio |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitectura técnica: Constructor, mapeo decisión→flujo, multi-tenant, data model, reuse del Suite |
| [`docs/DEMO-BUILDER-FLOW.md`](docs/DEMO-BUILDER-FLOW.md) | El corazón: el flujo self-serve paso a paso + endowed progress + árbol de decisiones→flujos |
| [`docs/UX-PSYCHOLOGY.md`](docs/UX-PSYCHOLOGY.md) | Research aplicado: endowed progress, IKEA effect, goal-gradient — mapeado a cada pantalla |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Rieles anti prompt-injection y de datos: sanitización de docs subidos, defensa por capas, PII |
| [`docs/PRICING-TIERS.md`](docs/PRICING-TIERS.md) | Free / Premium / Enterprise: qué incluye cada uno y la mecánica de conversión |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Fases de implementación con evidencia de mercado + reuse de la plataforma + esfuerzo |
| [`docs/FACTORY-ARCHITECTURE.md`](docs/FACTORY-ARCHITECTURE.md) | **El factory agéntico en producción**: intake LLM → contratos → schema/rol/subdominio por tenant, firmas HMAC |
| [`brand/`](brand/README.md) | Sistema de marca de Abi: identidad, personalidad, voz, lenguaje visual y la mascota 🐝 |

## Convenciones (heredadas del workspace)

- **DB**: schema `abi` self-contained en el Supabase self-hosted (`contabo-core-01`). Nada en
  `public`. Un schema por proyecto; sin FKs cruzadas.
- **Deploy**: Coolify. DNS de infra `*.piratapunk.com`; la marca pública Abi usa su **propio
  dominio** (nunca `agavesysmx.com` ni delata a Agave).
- **Secrets**: vault `vps-contabo-core/secrets/*.env`, naming `ABI_<SCOPE>_<NAME>`.
- **Commits**: una línea, sin trailer.
- **Marca**: Abi es un producto **independiente**. Nada en la UI pública debe revelar que el
  motor es el Agave Bot Suite / Zernio. Ver `brand/identity.md`.
