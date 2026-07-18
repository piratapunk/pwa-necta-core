export const STAGES = [
  { key: 'nuevo', label: 'Nuevo' },
  { key: 'en_platica', label: 'En plática' },
  { key: 'interesado', label: 'Interesado' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'descartado', label: 'Descartado' },
] as const

export type StageKey = (typeof STAGES)[number]['key']

export function stageLabel(key: string): string {
  return STAGES.find((s) => s.key === key)?.label ?? key
}

export type CrmContact = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  company: string | null
  channel: string
  tags: string[]
  stage: StageKey
  notes: string | null
  created_at: string
  last_seen_at: string
  conversations?: number
}

export type CrmConversation = {
  session_id: string
  channel: string
  mode: 'bot' | 'human'
  started_at: string
  last_at: string
  messages?: number
  last_user_msg: string | null
  contact: { id: string; name: string | null; phone: string | null; stage: string } | null
}

export type CrmMessage = {
  id: number
  role: 'user' | 'assistant' | 'owner'
  content: string
  at: string
}
