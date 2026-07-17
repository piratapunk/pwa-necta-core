# Strands Agents — evaluación crítica para NectaCore

> Investigado 2026-07-17. Veredicto corto: **TRIAL acotado** — vale la pena para UNA pieza
> (el Constructor conversacional, P1 de `PENDIENTES.md`), no como reemplazo del brain n8n
> ni como solución de autenticación. Detalle y fuentes abajo.

## 1. Qué es hoy (verificado, no el pitch)

- SDK open source (Apache 2.0) de AWS para agentes en producción. Monorepo
  `strands-agents/harness-sdk`: Python (`strands-agents`, 1.42.x) + TypeScript
  (`@strands-agents/sdk`, 1.9.0 al 10-jul-2026) + docs. Python 1.0 salió may-2026;
  el TS es más joven (1.0 en abr-2026).
- Adopción real: ~16.7M descargas/mes del paquete Python (jun-2026) — no es un
  experimento; lo empuja el ecosistema AWS.
- **Modelos**: agnóstico de verdad hoy — Bedrock, Anthropic, OpenAI y **Gemini
  first-class** (además LiteLLM, Ollama, custom). Requiere tool-calling nativo.
- **Import real**: `from strands import Agent, tool` (el paquete es `strands-agents`
  pero el módulo es `strands` — el snippet que circula con `from strands_agents import
  tool` está mal). TS: `import { Agent } from '@strands-agents/sdk'`.
- **MCP client integrado**: stdio, SSE y streamable-http, con filtrado/prefijos de
  tools y OAuth (client_credentials con cache de token). Structured output y output
  schemas en tools MCP.
- **Multi-agente**: swarm/workflow/graph + protocolo A2A + session managers.
  Observabilidad por OpenTelemetry.
- **Manejo de errores en tools**: el error vuelve al LLM como texto para que razone
  y reintente — cierto, y es el comportamiento que queremos para un wizard.
- Sesgo AWS honesto: el deployment story oficial es AgentCore/Lambda/Fargate y las
  memory-tools preconstruidas son Bedrock KB / Mem0 / Elasticsearch / MongoDB.
  **No hay tool de memoria pgvector de fábrica** — sería tool propia (trivial).
  Nada de esto nos bloquea en Contabo: es un `pip install` en un contenedor.

## 2. Dónde SÍ nos da leverage

### A. El Constructor conversacional (P1) — el caso fuerte ⭐
Hoy el intake es one-shot (texto → spec). El Constructor real (`DEMO-BUILDER-FLOW.md`)
es **multi-turno con acciones**: preguntar, validar, revisar lo extraído con el usuario
(IKEA effect), checar slug, disparar provisioning, narrar el build. Eso es exactamente
un agent loop con tools — y mantenerlo como grafo de nodos n8n se vuelve frágil e
intesteable a esa complejidad.

Lo clave: **nuestros contratos SECURITY DEFINER ya son las tools perfectas**. El agente
no recibiría permisos nuevos — solo EXECUTE sobre lo que ya existe:

```python
from strands import Agent, tool

@tool
def revisar_slug(nombre: str) -> str:
    """Propone el slug disponible para el negocio. Úsalo cuando el usuario confirme el nombre."""
    return db.one("select abi.factory_slugify(%s)", nombre)

@tool
def provisionar_bot(builder_session: str, spec: dict) -> dict:
    """Materializa el bot (schema + subdominio). Úsalo SOLO cuando el usuario apruebe el resumen final."""
    return db.one("select abi.provision_tenant(%s::uuid, %s::jsonb, %s)", ...)
```

Dos formas de desplegarlo (decidir al arrancar P1):
1. **TS dentro del Next** (`@strands-agents/sdk` en una route del app): un solo deploy,
   pero SDK más joven y loops largos dentro de requests Next.
2. **Servicio Python aparte** (patrón `/scaffold-service`, contenedor Coolify
   `serv-necta-constructor`): SDK más maduro, aislado, testeable. **Recomendado.**

### B. Agente de ops interno sobre nuestros MCP
El MCP client de Strands (streamable-http + OAuth) consume tal cual
`piratapunk-n8n` / `piratapunk-supabase` / `piratapunk-vps-ops` / `tahona`.
Un "ops agent" (diagnóstico de bots caídos, deploy asistido) sale casi gratis.
Valor real pero no urgente: nice-to-have.

### C. pgvector cuando el corpus lo amerite (P4) — con matiz honesto
La **decisión** "¿este corpus amerita embeddings?" es determinista (umbral de tamaño/
número de docs) — **no necesita agente, necesita un `if`**. Usar un LLM para eso sería
sobre-ingeniería. Donde un agente sí aporta es en la **ingesta**: clasificar el tipo de
doc, extraer, decidir chunking por estructura, marcar PII dudosa para revisión. Diseño
correcto: pipeline determinista con el corte a pgvector por umbral + un agente Strands
(el mismo del Constructor) que la invoca como tool `ingerir_documento(...)`.

## 3. Dónde NO nos da leverage (honesto)

- **Autenticación (P2)**: Strands NO resuelve auth de usuarios. Su OAuth es para que
  el agente se conecte a MCP servers, punto. El registro/claim de cuentas es trabajo
  Supabase/Next normal. Aquí la respuesta es simplemente "no aplica".
- **Reemplazar los brains n8n existentes**: `necta-tenant-chat` y `necta-web-chat` son
  pipelines lineales (cargar contexto → LLM → log). Un framework de agentes no les
  agrega nada, y n8n es el estándar de la casa para bots de canal (Zernio vive ahí).
  Migrarlos sería churn sin beneficio.
- **Las 20+ tools AWS preconstruidas**: irrelevantes para el stack Contabo.
- **Costo operativo**: un runtime más que operar (contenedor, deps, OTel). Manejable
  con el patrón serv-*, pero es un costo real que solo el Constructor justifica.

## 4. Veredicto por caso de uso

| Caso | Veredicto | Por qué |
|---|---|---|
| Constructor conversacional (P1) | **TRIAL → probable ADOPT** | agent loop + tools sobre contratos DB existentes; n8n no escala a esa complejidad de flujo |
| Ingesta de docs → cuarentena → KB | TRIAL (mismo agente) | clasificación/extracción agéntica; escritura vía tools deterministas |
| Derivar a pgvector (P4) | **NO como agente** | es un umbral determinista; pgvector = tool/función normal |
| Autenticación (P2) | **NO aplica** | Strands no hace auth de usuarios |
| Brains n8n de canal | **HOLD / no migrar** | lineales, funcionan, estándar de la casa |
| Ops agent sobre MCPs piratapunk | Nice-to-have | MCP client con OAuth ya lo soporta; cuando haya tiempo |

**Condición del trial**: spike de 1-2 días al arrancar P1 — agente Python (Gemini
provider) con 3 tools (`revisar_slug`, `guardar_spec`, `provisionar_bot`) contra el
flujo del wizard. Si el loop narrado se siente sólido y el tracing OTel nos sirve,
se adopta; si no, el plan B es el mismo wizard como máquina de estados explícita en
Next (más código, cero dependencias nuevas).

## 5. Fuentes

- Repo/monorepo: github.com/strands-agents/harness-sdk (versiones, install, licencia)
- Docs: strandsagents.com — model providers (Gemini nativo), MCP tools (transports,
  OAuth, structured output), community tools package (memoria: Bedrock KB/Mem0/ES/Mongo)
- AWS Open Source Blog: anuncio del SDK y serie "Open Protocols… Strands & MCP"
- Comparativas 2026: AWS Builder "Picking an AI Agent Framework in 2026", Speakeasy
  framework comparison, blog gainesai "LangGraph vs Strands vs AgentCore" — consenso:
  Strands = loop model-driven simple con buen deployment/observabilidad; LangGraph
  gana cuando necesitas auditabilidad paso-a-paso de grafos.
