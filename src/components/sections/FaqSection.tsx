import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: '¿Necesito saber de tecnología?',
    a: 'No. Hablas con Abi como con una persona: le cuentas de tu negocio, le pasas tu información y eliges entre opciones sencillas. Si sabes usar WhatsApp, sabes usar esto.',
  },
  {
    q: '¿El plan gratis es gratis de verdad?',
    a: 'Sí. Armas tu asistente completo y lo pruebas funcionando, sin tarjeta y sin fecha de caducidad. Tiene límites de uso y corre en un canal de prueba; cuando quieras conectarlo a tu número real, ahí empieza Premium.',
  },
  {
    q: '¿Funciona con mi número de WhatsApp?',
    a: 'Sí, en el plan Premium tu asistente contesta desde tu número de siempre — o desde uno nuevo si lo prefieres. Tú sigues pudiendo entrar a la conversación cuando quieras.',
  },
  {
    q: '¿Qué pasa con mi información y la de mis clientes?',
    a: 'Tu información es tuya y solo se usa para que tu asistente conteste por ti. Todo lo que subes pasa por revisión automática antes de usarse, y tus datos de clientes viven en tu CRM, no se comparten con nadie.',
  },
  {
    q: '¿Puedo cambiar a mi asistente después de crearlo?',
    a: 'Cuando quieras. El tono, el saludo, las respuestas y la información se ajustan al instante desde tu panel — sin volver a empezar.',
  },
  {
    q: '¿Y si mi negocio necesita algo más a la medida?',
    a: 'Para operaciones con sistemas propios (CRM, ERP, pagos) está el plan Enterprise: nos sentamos contigo, conectamos tus sistemas y te acompañamos. Pide una junta desde el chat.',
  },
]

export function FaqSection() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="t-eyebrow">Dudas frecuentes</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Lo que todos preguntan antes de empezar
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
