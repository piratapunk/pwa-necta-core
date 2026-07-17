# Guion — Prueba real de punta a punta (pizzería + pago + WhatsApp)

> 2026-07-17. Prueba EN VIVO del embudo completo con dinero real ($15 MXN) y tu número
> real de WhatsApp Business. El precio normal ($999) está intacto en Stripe — solo los
> envs apuntan temporalmente al precio de prueba. **Al terminar: avisar para restaurar.**

## Paso 0 — Liberar tu número (tú, ~3 min)

1. En tu dashboard del canal → **Connections** → tarjeta "WhatsApp / Agave Systems" →
   **Disconnect**.
2. En tu teléfono, app **WhatsApp Business** → Ajustes → **Cuenta** →
   **Plataforma de empresas** (Business Platform) → **Desconectar**.
   (Si no aparece esa opción, el paso 1 ya lo soltó todo.)
3. Espera **~5 minutos** — Meta tarda en soltar la asociación del número.
   ⚠️ Si más adelante el signup dice que el número "ya está registrado", espera 15 min
   más y reintenta; es la retención conocida de Meta.

## Paso 1 — Crear el bot de la pizzería (~3 min)

1. Abre **https://nectacore.com/constructor** (pasa el "soy humano" si aparece).
2. Cuéntale a Abi — puedes copiar/pegar esto en dos mensajes:

   > Tengo una pizzería en Guadalajara que se llama Pizzería Vesubio

   Y cuando pida la información:

   > Hacemos pizzas a la leña: Margarita $149, Pepperoni $169, Cuatro Quesos $189,
   > Hawaiana $159 y la especial Vesubio (salami picante y miel) $199. Tamaño familiar
   > +$60. Abrimos martes a domingo de 1 pm a 10 pm. Estamos en Av. Chapultepec 480,
   > Colonia Americana. Hacemos entregas a domicilio por $35 en la zona, o recoges en
   > tienda. Aceptamos tarjeta y efectivo. Los pedidos se hacen por WhatsApp.

3. Abi te mostrará el resumen y la dirección `pizzeria-vesubio.nectacore.com` →
   dile **"adelante, constrúyelo"**.
4. Abre el link "Tu bot ya está en línea" y hazle 1-2 preguntas (precios, horario)
   para verificar que contesta con TU información.

## Paso 2 — Ligarlo a tu cuenta (~1 min)

1. En el mismo Constructor, en la barra verde: escribe tu correo
   (`code@piratapunk.com`) → **"Ligarlo a mí"**.
2. Revisa tu correo (viene de `hola@nectacore.com` — si cae en junk, márcalo
   "No es no deseado") → clic en **"Entrar a mi cuenta"** → caes en el panel del bot.

## Paso 3 — Pagar Premium $15 (~2 min) 💳

1. Panel → **Mi plan** → botón **"Mensual — $15 MXN/mes"**.
2. Checkout de Stripe: tu tarjeta real. Pago real de $15.
3. Al terminar regresas al panel → el badge debe cambiar a **premium** (si tarda,
   refresca en ~10 s: el webhook hace el upgrade).
4. Verifica en **Mi plan**: "Estado: activa ✅" y en la tabla, tus límites nuevos
   (1,000 mensajes/día).

## Paso 4 — Conectar tu WhatsApp (~5 min) 📱

1. Panel → **Conexiones** → tarjeta WhatsApp ya sin candado → **"Conectar mi WhatsApp"**.
2. Te manda al flujo oficial de Meta (facebook.com). Inicia sesión si lo pide.
3. En el signup: elige tu portafolio de empresa → cuando pregunte por el número,
   elige la opción de **conectar tu cuenta existente de WhatsApp Business**
   (coexistencia) → Meta te mostrará un **QR**.
4. En tu teléfono: WhatsApp Business → Ajustes → **Dispositivos vinculados** →
   **Vincular dispositivo** → escanea el QR de Meta.
5. Termina el flujo → te regresa automáticamente a **Conexiones** con
   **"WhatsApp — conectado"** y tu número.

## Paso 5 — El momento de la verdad (~1 min) 🐝

1. Desde **otro teléfono** (o pídele a alguien): mandar un WhatsApp a tu número:
   > ¿Cuánto cuesta la pizza de pepperoni y hasta qué hora abren hoy?
2. El bot debe contestar solo en segundos, con los datos de la pizzería.
3. En tu app de WhatsApp Business verás la conversación espejeada (coexistencia:
   tú puedes meterte a contestar cuando quieras).
4. Panel → **Conversaciones**: ahí debe aparecer la plática.

## Si algo se atora

| Síntoma | Qué hacer |
|---|---|
| El pago no refleja premium | Espera 30 s y refresca; si no, avísame (reviso el webhook en Stripe) |
| Meta dice "número ya registrado" | La retención del Paso 0 — espera 15 min y reintenta el Paso 4 |
| El QR no aparece en el flujo | Asegúrate de elegir la opción de "cuenta existente de WhatsApp Business", no "número nuevo" |
| El bot no contesta el WhatsApp | Espera 1-2 min el primer mensaje; si nada, avísame (reviso el delivery log del webhook y la ejecución en n8n) |
| El bot contesta cosas raras | Dímelo con el texto exacto — ajusto el prompt |

## Al terminar — avisarme para:

1. **Restaurar el precio a $999** (cambio de envs + redeploy, 3 min).
2. Cancelar tu suscripción de $15 desde el panel ("Administrar suscripción" →
   cancelar) — o dejarla si quieres conservar la pizzería como demo premium.
3. Decidir si el número se queda conectado a la pizzería o lo regresamos a Agave.
