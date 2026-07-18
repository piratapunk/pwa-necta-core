import { looksLikeInjection } from '@/lib/security'

/*
 * Sanitización de contenido extraído (SECURITY.md capas 1 y 3):
 * canonicaliza Unicode, elimina invisibles/zero-width/bidi (trucos clásicos
 * de ocultar instrucciones) y tira líneas con patrones de inyección. El
 * contenido resultante sigue siendo DATO — la delimitación en el prompt
 * (capa 4) es del brain, no de aquí.
 */

/* controles C0/DEL (menos \n \t) · soft hyphen · zero-width y marcas de
   dirección · separadores de línea Unicode · invisibles de formato · bidi
   overrides/isolates · BOM */
const INVISIBLES = new RegExp(
  '[' +
    '\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F' +
    '\\u00AD' +
    '\\u200B-\\u200F' +
    '\\u2028\\u2029' +
    '\\u2060-\\u2064' +
    '\\u202A-\\u202E' +
    '\\u2066-\\u2069' +
    '\\uFEFF' +
    ']',
  'g'
)

export function sanitizeExtracted(
  raw: string,
  maxChars: number
): { text: string; droppedLines: number } {
  const normalized = raw.normalize('NFKC').replace(INVISIBLES, '')
  let droppedLines = 0
  const lines = normalized.split('\n').filter((line) => {
    if (looksLikeInjection(line)) {
      droppedLines += 1
      return false
    }
    return true
  })
  const text = lines
    .join('\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxChars)
  return { text, droppedLines }
}
