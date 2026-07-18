/* Preguntas sugeridas por vertical — invitan al cliente a arrancar (patrón de
   la casa). Se muestran como chips hasta el primer mensaje. */

const BY_VERTICAL: Record<string, string[]> = {
  restaurante: ['¿Cuál es el menú?', '¿Hacen entregas?', '¿A qué hora abren?'],
  belleza: ['¿Qué servicios tienen?', 'Quiero una cita', '¿Cuánto cuesta?'],
  clinica: ['Quiero agendar cita', '¿Qué horarios manejan?', '¿Dónde están?'],
  inmobiliaria: ['¿Qué propiedades tienen?', 'Busco rentar', '¿Cómo agendo una visita?'],
  isp: ['¿Qué planes tienen?', 'Tengo una falla', '¿Cobertura en mi zona?'],
  tienda: ['¿Qué productos tienen?', '¿Hacen envíos?', '¿Cuánto cuesta?'],
  servicios: ['¿Qué servicios ofrecen?', 'Quiero una cotización', '¿A qué hora atienden?'],
  educacion: ['¿Qué cursos tienen?', '¿Cuánto cuesta?', '¿Cómo me inscribo?'],
  general: ['¿Qué ofrecen?', '¿A qué hora abren?', '¿Cómo los contacto?'],
}

export function suggestionsFor(vertical: string | undefined): string[] {
  return BY_VERTICAL[vertical ?? 'general'] ?? BY_VERTICAL.general
}
