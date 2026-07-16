# NectaCore — Lenguaje visual

> Misma familia que Abi (`brand/visual-language.md`), registro más sólido. Los valores
> autoritativos (hex/oklch, familias tipográficas) viven en el design system del código
> (`src/app/globals.css` tokens); aquí va la intención.

## Concepto

**El núcleo de la colmena.** Si Abi es la abejita que ves, NectaCore es la estructura hexagonal
donde ocurre el trabajo: precisa, cálida por dentro (miel), oscura y premium por fuera (carbón).
"Honey-tech": tecnología con temperatura.

## Paleta (compartida con Abi, dosificada distinto)

- **Carbón / negro** — fondo dominante. En NectaCore pesa más que en Abi: más superficie oscura,
  más aire, menos travesura.
- **Miel / ámbar** — el acento: CTAs, celdas activas, datos que importan. En texto sobre claro,
  usar ámbar profundo (contraste AA).
- **Crema / hueso** — texto sobre carbón, superficies claras en la variante light.
- **Acentos de estado** — verde-miel (éxito/en línea), ámbar-quemado (alerta), índigo tenue
  (premium/enterprise).
- **Regla heredada:** dark-first con light real; todo por tokens, nunca hex hardcodeado en
  componentes (aprendizaje de web-agave).

## El motivo: el hexágono-núcleo

- **Marca gráfica:** un hexágono con núcleo de miel — una celda vista desde el centro de la
  colmena. Funciona como favicon, sello "powered by NectaCore" y bullet de sección.
- **Patrón de panal** sutil en fondos de sección (opacidad baja, nunca compite con el contenido).
- **Grid de capacidades:** los servicios/capacidades se presentan como **celdas** de panal que se
  "llenan" al pasar el cursor (la miel entra al hover).
- Compartido con Abi: el panal-de-progreso del Constructor es territorio de Abi; NectaCore usa el
  hexágono estático/estructural.

## Logo

- **Wordmark `NectaCore`** — una sola palabra, N y C en mayúscula (se lee empresa-plataforma).
  Sans de peso 700, tracking apretado, con el hexágono-núcleo como ícono a la izquierda o como
  remate (el punto de la "o" final como celda, p. ej.).
- Versiones: ícono solo (favicon/avatar), wordmark solo, lockup completo. Legibles en dark y light.
- Lockup de familia: `abi 🐝 · de NectaCore` para el sello del producto.

## Tipografía

- Igual que Abi: display sans cálida (600–800) para headings; sans neutra muy legible para texto
  y UI. NectaCore usa los pesos altos con más sobriedad (menos exclamación, más dato).

## Movimiento

- **Pulido, discreto.** Micro-transiciones (celdas que se llenan, glow ámbar en CTAs). Nada de
  mascota saltando: eso es de Abi. SVG+CSS deterministas, `prefers-reduced-motion` siempre.

## Aplicación en nectacore.com

- Web-first (desktop es la primera pantalla), completamente responsive a tablet/móvil.
- Secciones centradas: eyebrow en mayúsculas → heading → subhead de una línea (patrón de la casa).
- Hero oscuro con panal sutil + Abi como protagonista del producto.
- El chat central (Abi) siempre accesible: ahí la marca cambia de registro — entra el personaje.

## Checklist

- [ ] Tokens compartidos con Abi (miel/ámbar/carbón/crema), dark+light, AA.
- [ ] Hexágono-núcleo: favicon + sello + bullets.
- [ ] Grid de celdas para capacidades con hover de miel.
- [ ] Wordmark NectaCore dark/light.
- [ ] Nada revela Zernio/n8n/Agave.
