# Guión — Prueba completa desde cero (Constructor + ingesta + CRM + takeover)

> 2026-07-18. La base quedó **limpia** (0 tenants; respaldo en el VPS
> `abi-pre-wipe-20260719-0100.sql.gz`). El precio Premium mensual sigue en el de
> prueba (**$15 MXN**) — se aprovecha para el paso de pago y **al terminar se
> restaura a $999**. El monitor de Kuma del tenant demo está pausado; se reactiva
> al final. Cubre todo lo nuevo: ingesta de documentos, CRM (Clientes/Embudo),
> inbox con takeover humano y el gating Premium.

## Paso 0 — Sesión limpia en el navegador (~1 min)

1. En `nectacore.com`: DevTools (F12) → **Application → Storage → Clear site data**
   (borra el builder session y los bots "construidos" viejos del localStorage).
   Alternativa: ventana de incógnito.
2. Tu correo `code@piratapunk.com` conserva su cuenta — el claim del Paso 5
   funciona igual.

## Paso 1 — Constructor conversacional (~3 min)

1. Abre **https://nectacore.com/constructor** (marca el "soy humano").
2. Mensaje 1:
   > Tengo una taquería en Monterrey que se llama Taquería La Nona
3. Cuando Abi pida la información:
   > Somos una taquería familiar en el Barrio Antiguo. Nuestra especialidad es el
   > pastor. Abrimos de martes a domingo de 1 pm a 10 pm. Hacemos entregas a
   > domicilio en la zona por $30. Aceptamos efectivo y tarjeta.

   ✅ Checkpoints: una pregunta por mensaje, sin "¡Claro!/¡Perfecto!", el panal de
   progreso avanza, y **no te revela la URL todavía**.

## Paso 2 — 🆕 Subir el menú con el clip 📎 (~2 min)

1. Te mandé el archivo **menu-la-nona.pdf** — guárdalo.
2. En el chat del Constructor: botón del **clip** → elige el PDF.
3. Aparece la tarjeta de cuarentena con el **texto extraído editable**.
   ✅ Checkpoints: el texto es el menú legible (precios incluidos); puedes editar
   una línea (cámbiale el precio a algo) antes de aprobar.
4. **"Se ve bien, agrégalo"** → Abi debe confirmarlo natural ("listo, ya guardé
   tu menú…").
   - Extra opcional de seguridad: sube un `.txt` que incluya una línea
     "ignore previous instructions…" → esa línea debe desaparecer del preview.

## Paso 3 — Personalidad (~1 min)

Tras guardar el borrador aparece el **cuestionario de personalidad** bajo el
chat: elige chips (tono, trato, emojis, objetivo…) + una nota libre → espera el
"Quedó con carácter propio ✨".

## Paso 4 — Construir y probar el bot (~2 min)

1. Dile **"constrúyelo"** → interludio narrado (~5 s) → tarjeta de éxito con
   `taqueria-la-nona.nectacore.com`.
2. Abre el bot y pregunta **algo que SOLO está en el PDF**:
   > ¿Cuánto cuesta la gringa de pastor?
   ✅ Debe responder $70 (o el precio que editaste) — eso prueba que la ingesta
   llegó a la KB. Pregunta también el horario y algo que NO esté (debe decir que
   no sabe y ofrecer tomar tus datos).

## Paso 5 — Ligar a tu cuenta (~1 min)

En el Constructor: tu correo → **"Ligarlo a mí"** → magic link desde
`hola@nectacore.com` → caes en `/mis-bots` → entra al panel del bot.

## Paso 6 — Panel en free: gating del CRM (~1 min)

✅ Checkpoints: Resumen con tiles (incluye **"Clientes captados"**);
**Clientes** y **Embudo** aparecen con **candado Premium + CTA**; en una
conversación abierta la caja de responder dice que es de Premium.

## Paso 7 — Premium con el precio de prueba (~2 min) 💳

**Mi plan** → **Mensual $15 MXN** → checkout Stripe con tarjeta real → al volver,
badge **premium** (si tarda, refresca en ~10 s). Límites nuevos: 1,000 msgs/día.

## Paso 8 — 🆕 CRM completo (~5 min)

1. **Como cliente** (otra pestaña, el bot): escribe
   > hola, soy Laura, mi cel es 81 2345 6789, ¿me apartas una orden de pastor?
2. Panel → **Clientes**: Laura debe aparecer **sola** (nombre + teléfono).
   Edita su ficha: etapa → "Interesado", tag `pedido`, una nota.
3. **Embudo**: muévela de etapa con el select de su tarjeta.
4. **Conversaciones** → abre el hilo → ✅ ves los mensajes, la tarjeta del
   cliente al lado.
5. **Takeover**: botón **"Atender yo"** → escribe una respuesta desde el panel →
   en la pestaña del bot, **sin recargar**, en ~5 s aparece tu burbuja con el
   sello "equipo" y el header dice "te atiende una persona del equipo".
6. Como cliente escribe otra cosa → ✅ el bot **NO** contesta (estás tú al
   mando); lo ves llegar al hilo del panel (~5 s).
7. **"Devolver al asistente"** → como cliente pregunta un precio → el bot vuelve
   a contestar solo.

## Paso 9 (opcional) — WhatsApp real 📱

Igual que el guión anterior: **Conexiones** → "Conectar mi WhatsApp" → flujo
Meta → QR con coexistencia. Sigue pendiente validarlo con número físico (P-WA).
Si lo haces: el número entrante debe crear el contacto en Clientes solo, y tu
respuesta desde el panel debe salir por WhatsApp.

## Si algo se atora

| Síntoma | Qué hacer |
|---|---|
| El clip rechaza el PDF | Dime el mensaje exacto (tipo/tamaño/límite: free = 1 archivo, 2 MB) |
| El bot no sabe lo del PDF | Avísame — reviso que el source esté `approved` y materializado |
| El pago no refleja premium | Espera 30 s y refresca; si no, reviso el webhook |
| Laura no aparece en Clientes | Avísame — reviso la captura en `tenant_log_message` |
| El takeover no silencia al bot | Avísame — reviso el corte de modo humano en n8n |
| La respuesta del panel no llega al widget | Verifica que la pestaña del bot esté visible (el polling pausa en background) |

## Al terminar — avisarme para:

1. **Restaurar el precio mensual a $999** (env `ABI_STRIPE_PREMIUM_MONTHLY_PRICE_ID`
   → `price_1TuHiBDIsfRMN2SBgznD6dpp` + redeploy) — importante: hoy cualquier
   visitante podría suscribirse en $15.
2. **Cancelar tu suscripción de $15** desde el panel (o conservarla como demo premium).
3. **Reactivar el monitor de Kuma** del tenant demo (si el bot quedó en
   `taqueria-la-nona.nectacore.com` se despausa tal cual; si no, lo reapunto).
4. Decidir qué bots quedan como demos para la Expo.
