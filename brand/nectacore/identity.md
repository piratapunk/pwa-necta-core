# NectaCore — Identidad

## Quién es

**NectaCore** es la empresa-plataforma que fabrica asistentes conversacionales para negocios:
una **fábrica de bots** con CRM incluido. Su producto insignia es **Abi**, el asistente que
cualquier dueño de negocio arma en minutos. NectaCore es quien firma la factura, opera la
plataforma y acompaña a los clientes enterprise.

## Arquitectura de marca

```
NectaCore (corporativo, plataforma, "powered by NectaCore")
   └── Abi 🐝 (producto estrella: el constructor de asistentes self-serve)
        └── el bot del cliente (marca del cliente; ni Abi ni NectaCore protagonizan ahí)
```

- **NectaCore habla** en: el sitio corporativo (nectacore.com), pricing, legal, enterprise,
  facturación, el pie "un producto de NectaCore".
- **Abi habla** en: el producto (chat central, Constructor, panel), marketing del producto.
- Jerarquía visible pero ligera: en el sitio, Abi es la protagonista; NectaCore es el sello de
  confianza detrás ("de los creadores de…" al revés: "Abi, de NectaCore").

## Positioning

> La plataforma que le arma a tu negocio su equipo de asistentes: los construyes tú mismo en
> minutos con Abi, trabajan en tus canales reales, y todo lo que logran cae en tu CRM.

Tres promesas, en orden:
1. **Fábrica, no proyecto.** Un asistente aquí no se "desarrolla" en meses: se instancia en
   minutos sobre flujos probados en producción.
2. **Omnicanal de verdad.** WhatsApp, redes sociales, teléfono/voz, campañas, reseñas, anuncios —
   un solo asistente, todos los canales del negocio.
3. **CRM incluido.** Cada conversación se vuelve dato: leads, tickets, citas, reportes. La miel
   no se evapora.

## A quién le habla

1. **El dueño de PyME** (llega por Abi): le habla Abi; NectaCore solo respalda.
2. **El negocio en crecimiento / multi-sucursal**: quiere canales propios, campañas, reseñas,
   reportes → premium. Aquí NectaCore ya aparece como plataforma seria.
3. **Enterprise / agencias**: integraciones a sus sistemas (CRM/ERP/pagos), SLA, acompañamiento.
   Aquí NectaCore habla de tú a tú, con junta y contrato.

## Cómo nombra su tecnología (regla dura)

Nunca se nombran Zernio, n8n, Agave, ni proveedor alguno. El vocabulario público es:

| Interno (jamás público) | Público |
|---|---|
| Zernio / BSP / coexistencia | "tu número de WhatsApp conectado", "tus canales" |
| n8n / workflows / nodos | "automatizaciones", "la plataforma", "integraciones" |
| catálogo de nodos n8n | "+400 integraciones con las apps que ya usas" |
| Agave Bot Suite / demo-brain | "el motor NectaCore", "flujos probados en producción" |
| RAG / LLM / prompts | "tu asistente aprende de tu información" |

## Pilares

1. **Ingeniería que no se presume, se nota.** Cero jerga; la prueba es el bot vivo en 2 minutos.
2. **El cliente es la reina.** Su negocio, su marca, sus datos, su miel. Nosotros somos la colmena
   que trabaja para él.
3. **Honestidad comercial.** Free real, límites claros, precios cotizados con números reales
   (nunca inventados — regla del workspace).
4. **Calidez sólida.** Cálidos como Abi, serios como un proveedor de infraestructura.

## Qué NO es

- No es una agencia ni una consultora (el toque humano vive solo en enterprise).
- No es "una IA": es una **fábrica de asistentes con CRM**. La IA es ingrediente, no titular.
- No es Abi con corbata: NectaCore no usa la voz del personaje (ver `voice.md`).
