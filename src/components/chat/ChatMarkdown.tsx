import { Linkify } from '@/components/chat/Linkify'

/* markdown ligero para burbujas de chat: **negritas**, viñetas y saltos de
   línea — sin librerías; todo lo demás se muestra tal cual (contenido = dato) */

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
          <strong key={i} className="font-semibold">
            <Linkify text={part.slice(2, -2)} />
          </strong>
        ) : (
          <Linkify key={i} text={part} />
        )
      )}
    </>
  )
}

type Block = { type: 'p'; lines: string[] } | { type: 'ul'; items: string[] }

export function ChatMarkdown({ text }: { text: string }) {
  const blocks: Block[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line)
    const last = blocks[blocks.length - 1]
    if (bullet) {
      if (last?.type === 'ul') last.items.push(bullet[1])
      else blocks.push({ type: 'ul', items: [bullet[1]] })
    } else if (line.trim() === '') {
      blocks.push({ type: 'p', lines: [] })
    } else if (last?.type === 'p') {
      last.lines.push(line)
    } else {
      blocks.push({ type: 'p', lines: [line] })
    }
  }

  return (
    <div className="space-y-2">
      {blocks
        .filter((b) => (b.type === 'p' ? b.lines.length > 0 : b.items.length > 0))
        .map((b, i) =>
          b.type === 'ul' ? (
            <ul key={i} className="space-y-1">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-current opacity-60" />
                  <span className="min-w-0">
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              {b.lines.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  <Inline text={l} />
                </span>
              ))}
            </p>
          )
        )}
    </div>
  )
}
