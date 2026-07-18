import { Badge } from '@/components/ui/badge'

const rows = [
  { name: 'Mariana L.', item: 'Pidió cotización de 2 arreglos', tag: 'Lead', time: 'hace 4 min' },
  { name: 'Carlos R.', item: 'Cita agendada — mañana 10:30', tag: 'Cita', time: 'hace 12 min' },
  { name: 'Sofía M.', item: 'Preguntó por envíos a Zapopan', tag: 'Conversación', time: 'hace 31 min' },
  { name: 'Luis T.', item: 'Reclamo resuelto por el asistente', tag: 'Ticket', time: 'hace 1 h' },
]

export function CrmSection() {
  return (
    <section id="crm" className="scroll-mt-16 border-t bg-surface/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <div className="rounded-2xl border bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between border-b px-2 pb-3">
              <p className="font-display text-sm font-bold">Tu CRM · hoy</p>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="size-1.5 rounded-full bg-success" /> asistente en línea
              </span>
            </div>
            <ul className="divide-y">
              {rows.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-3 px-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="truncate text-xs text-text-muted">{r.item}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant="soft">{r.tag}</Badge>
                    <span className="text-[10px] text-text-muted">{r.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="t-eyebrow">La miel no se evapora</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Todo lo que tu asistente logra, cae en tu CRM
          </h2>
          <p className="mt-4 leading-relaxed text-text-muted">
            Cada conversación se vuelve algo que puedes usar: un lead con su
            teléfono, una cita en tu agenda, un pedido, un reclamo atendido.
            Nada se queda en el chat — y nada depende de tu memoria.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-text-muted">
            <li className="flex gap-2.5">
              <span className="text-accent">🍯</span>
              Leads con nombre y contacto, listos para darles seguimiento.
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent">🍯</span>
              Conversaciones completas por cliente, en un solo historial.
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent">🍯</span>
              Citas, tickets y ventas etiquetados solos, sin capturar nada a mano.
            </li>
          </ul>
          <p className="mt-6 text-sm text-text-muted">
            Y se conecta con lo tuyo:{' '}
            <strong className="text-text">+400 integraciones</strong> con las
            apps que ya usas — calendarios, hojas, pagos, tiendas en línea.
          </p>
        </div>
      </div>
    </section>
  )
}
